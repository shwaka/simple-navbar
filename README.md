## Install
1. Create Personal Access Token in GitHub
2. Write the following in (somewhere imported by) `.zshrc`.
   ```bash
   export NODE_AUTH_TOKEN="your_token_here"
   ```
3. Write the following in `.npmrc` (at `~/.npmrc` or project directory)
   ```
   @shwaka:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```
4. Run
   ```bash
   npm i @shwaka/simple-navbar
    ```

## Dev
Run `npm run dev` in the root and `test/local-test/`.

## Publish
1. Update `"version"` in `package.json`
2. Commit it and run `git tag v9.99.99` (Note: tag MUST start with `v`)
3. `git push` and `git push --tags`
4. Update version of `"@shwaka/simple-navbar"` in `test/github-test/package.json`. Commit and push it.
    - Note: Before this, you MUST push the above and wait for publication in GitHub Actions.

## Memo
- `tsup@8.5.1` contains a bug around `--watch` (does not emit `.js`).
  So `8.3.0` is selected.

## Custom theme

Use `createSimpleTheme` to create a theme by specifying only the hue of the
primary color. `mainHue` is an angle in degrees from `0` to `360`.

```typescript
import { ThemeProvider } from "@mui/material"
import { createSimpleTheme } from "@shwaka/simple-navbar"

const myTheme = createSimpleTheme({
  mainHue: 250,
})

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      {renderRouterProvider()}
    </ThemeProvider>
  )
}
```

For more detailed customization, create a MUI theme directly with
`createTheme`.

```typescript
const myTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#990000",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#00ee00",
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={myTheme}>
      {renderRouterProvider()}
    </ThemeProvider>
  )
}
```

## Lazy-loaded pages

Applications can use `React.lazy()` for route-level code splitting and let
`simple-navbar` provide a separate `Suspense` boundary for each page. The
application remains responsible for the dynamic import.

```tsx
import { lazy } from "react"

import { createRenderer } from "@shwaka/simple-navbar"

const loadExplorer = () => import("./Explorer").then(
  ({ Explorer: Component }) => ({ default: Component }),
)
const Explorer = lazy(loadExplorer)

const renderRouterProvider = createRenderer({
  rootPageElement: <div>The root page</div>,
  subpageRoutes: [
    {
      path: "/explorer",
      element: <Explorer />,
      preload: loadExplorer,
      name: "Explorer",
    },
  ],
  pageSuspense: {
    enabled: true,
    fallback: "default",
    deferInitialRender: true,
  },
  siteTitle: "Example",
  footerDisplay: "none",
})
```

Set `fallback` to a React element to replace the default loading indicator:

```tsx
pageSuspense: {
  enabled: true,
  fallback: <PageLoading />,
}
```

When `pageSuspense` is omitted or has `enabled: false`, route elements are not
wrapped in `Suspense`, preserving the existing behavior. `Suspense` handles the
loading state but not dynamic import failures; use an Error Boundary when the
application needs error recovery.

Set `deferInitialRender: true` to show the same fallback while a subpage begins
its initial render, including repeat visits after its lazy module is cached.
The option defaults to `false`. An optional route `preload` function can start
loading the lazy module while the fallback is being painted; use the same
loader for both `lazy()` and `preload` as shown above.

When the built-in fallback and `preload` are both used, the indicator shows
`Loading...` until preload completes and `Rendering...` while the page begins
rendering. Without `preload`, the built-in indicator has no phase text. Custom
fallback elements are rendered unchanged.
