# simple-navbar: ページ初期レンダリング中の loading 表示

## 背景

`simple-navbar` の現在の `pageSuspense` は、route element を React の
`Suspense` で囲むことで、`React.lazy()` によるモジュール読み込み中に fallback を表示する。

この仕組みでは、lazy module がキャッシュ済みの2回目以降のページ表示では fallback が
表示されない。一方、ページコンポーネント自体の初期レンダリングが重い場合、ナビゲーションを
開始してから新しいページが表示されるまで何も反応がないように見える。

これは `Suspense` だけでは扱えない。キャッシュ済みの lazy component は suspend せず、
重い同期レンダリングが始まるとブラウザは途中で loading UI を描画できないためである。

## 目的

- lazy module の取得中だけでなく、ページ本体の初期レンダリング中にも fallback を表示する。
- モジュールがキャッシュ済みの再訪時にも同じ挙動にする。
- 既存利用者の挙動を変えないよう、明示的に有効化する opt-in 機能とする。
- lazy loading と初期レンダリング待ちで同じ fallback を使い、表示の切り替わりをなくす。

## API案

既存の `pageSuspense` にオプションを追加する案が、後方互換性を保ちやすい。

```tsx
const renderRouterProvider = createRenderer({
  // ...
  pageSuspense: {
    enabled: true,
    fallback: "default",
    deferInitialRender: true,
  },
})
```

型は次のように拡張する。

```ts
type PageSuspenseOptions =
  | { enabled: false }
  | {
      enabled: true
      fallback: "default" | ReactElement
      deferInitialRender?: boolean
    }
```

`deferInitialRender` のデフォルトは `false` とし、現在の挙動を維持する。

ただし、この機能は厳密には Suspense の機能ではない。今後 loading 関連の設定が増えるなら、
`pageLoading` のような独立した設定へ整理することも検討できる。初回実装では API の変更範囲が
小さい `pageSuspense.deferInitialRender` が現実的である。

## route preload の追加案

ページ本体のレンダリングを遅らせるだけだと、`React.lazy()` の import 開始も遅れる。
初回表示の待ち時間を増やさないため、任意の `preload` を route に持たせる。

```ts
interface PageRoute {
  path: string
  element: ReactElement
  name: string
  hidden?: boolean
  description?: string
  preload?: () => Promise<unknown>
}
```

利用側では lazy component と同じ loader を共有する。

```tsx
const loadExplorer = () => import("./Explorer").then(
  ({ Explorer: Component }) => ({ default: Component }),
)
const Explorer = lazy(loadExplorer)

const route = {
  path: "/explorer",
  element: <Explorer />,
  preload: loadExplorer,
  name: "Explorer",
}
```

`preload` は optional とする。指定がない場合も機能は動くが、lazy import はページ本体を
レンダリングし始めた時点で開始される。

## 内部実装方針

`PageSuspense` の内側、またはページごとの wrapper として `PageRenderGate` 相当の
コンポーネントを設ける。

処理順は以下とする。

1. route がマウントされた最初の render では fallback を返す。
2. mount 後に route の `preload?.()` を呼び、chunk の取得を開始する。
3. `requestAnimationFrame` を2回挟み、fallback が少なくとも一度ブラウザに描画される
   機会を作る。
4. `startTransition()` 内でページ本体を表示する state を更新する。
5. lazy import が未完了なら、外側の `Suspense` が同じ fallback を引き続き表示する。
6. route を離れた場合は予約済みの animation frame をキャンセルする。

構造のイメージは次のとおり。

```tsx
<Suspense fallback={fallback}>
  <PageRenderGate
    enabled={pageSuspense.deferInitialRender === true}
    fallback={fallback}
    preload={route.preload}
  >
    {route.element}
  </PageRenderGate>
</Suspense>
```

`PageRenderGate` の概略実装:

```tsx
function PageRenderGate({ enabled, fallback, preload, children }: Props): ReactElement {
  const [canRender, setCanRender] = useState(!enabled)

  useEffect(() => {
    if (!enabled) return

    void preload?.().catch(() => {
      // Speculative preload の Promise rejection はここで処理する。
      // 実際の lazy render で同じ loader が返すエラーは Suspense/Error Boundary に任せる。
    })

    let renderFrame: number | undefined
    const loadingFrame = requestAnimationFrame(() => {
      renderFrame = requestAnimationFrame(() => {
        startTransition(() => setCanRender(true))
      })
    })

    return () => {
      cancelAnimationFrame(loadingFrame)
      if (renderFrame !== undefined) cancelAnimationFrame(renderFrame)
    }
  }, [enabled, preload])

  return canRender ? <Fragment>{children}</Fragment> : fallback
}
```

`requestAnimationFrame` を1回だけにすると、effect の実行タイミングによっては fallback の
paint より前に本体 render が始まる可能性がある。2回使うことで、間に paint の機会を確保する。

`startTransition` により、React がページ本体を concurrent render できる場合は、完成するまで
現在の fallback を維持できる。ただし、commit 後のブラウザの layout・paint 自体が重い場合まで
完全に隠せるものではない。

## fallback の扱い

現在の default fallback はそのまま再利用する。

- `role="status"`
- `aria-label="Loading"`
- 高さ `40vh` の中央に `CircularProgress`

初期レンダリング用に別の fallback を作ると、lazy import 完了時に一度 UI が切り替わる可能性が
あるため、`Suspense` と `PageRenderGate` には同一の React element を渡す。

## 適用範囲

最初の案では、`deferInitialRender: true` のとき全 subpage route に適用する。ページごとに
制御したい要望が出た場合は、後から route 側に次のような override を追加できる。

```ts
interface PageRoute {
  // ...
  deferInitialRender?: boolean
}
```

最初から両方の設定を導入すると優先順位が複雑になるため、実需要がなければ global option のみにする。

## テスト方針

### PageRenderGate の単体テスト

- 初期表示では fallback が表示され、children は表示されない。
- mount 時に `preload` が1回呼ばれる。
- 1回目の animation frame 後も fallback が表示される。
- 2回目の animation frame 後に children が表示される。
- 途中で unmount すると予約済み frame がキャンセルされる。
- `enabled: false` では直ちに children が表示される。
- `preload` がない route でも動作する。

テストでは `requestAnimationFrame` と `cancelAnimationFrame` を stub し、frame callback を
手動で進める。実時間に依存するテストにはしない。

### route 作成処理のテスト

- `deferInitialRender` 省略時は従来と同じ構造・挙動になる。
- `deferInitialRender: true` のとき、各 subpage route で gate が有効になる。
- custom fallback が Suspense と gate の両方で使われる。
- route の `preload` が正しい gate に渡される。

### 手動確認

- 初回訪問時に spinner が表示され、その間に chunk が取得される。
- 別ページへ移動して戻った場合も spinner が表示される。
- 重いページ render 中に、直前の画面が固まったように見えない。
- 素早く別 route へ移動しても、離れたページが後から表示されない。
- React `StrictMode` 下で effect の再実行による警告や二重表示がない。

## 注意点

- この機能は実際の render 時間を短縮するものではなく、待機中のフィードバックを改善するもの。
- 軽いページにも最低1 paint 分の遅延が入るため、必ず opt-in にする。
- speculative な `preload()` の Promise には catch を付け、未処理 rejection を防ぐ。その後の
  lazy component の実レンダリングでも同じ loader が呼ばれるため、ユーザー向けのエラー処理は
  従来どおり Error Boundary 側に任せる。catch の意図をコードコメントで明示する。
- `preload` を render 中に呼ぶと副作用になるため、effect 内で開始する。
- state や DOM を保持したまま非表示にする仕組みではない。route 再訪時には通常どおり再マウントする。

## bibview 側の最終形

`simple-navbar` の対応版へ更新後、bibview は loader を route に渡して設定を有効化するだけにする。

```tsx
const renderRouterProvider = createRenderer({
  // ...
  subpageRoutes,
  pageSuspense: {
    enabled: true,
    fallback: "default",
    deferInitialRender: true,
  },
})
```

これにより、bibview 独自の loading wrapper や spinner component は不要になる。
