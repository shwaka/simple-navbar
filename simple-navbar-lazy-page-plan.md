# simple-navbar: route-level Suspense support

## Goal

Add optional page-level Suspense support to `@shwaka/simple-navbar` so applications can use
`React.lazy()` for route-level code splitting without wrapping every route element in their own
`Suspense` boundary.

The responsibilities should remain separated as follows:

- The application decides which page modules are loaded with dynamic `import()`.
- `simple-navbar` places a `Suspense` boundary around each route element.
- The application selects the built-in loading UI or supplies its own through the
  `createRenderer` / `createNavBarRoutes` options.

This feature must be opt-in and must not change the behavior of existing users.

## Proposed API

Add an optional `pageSuspense` property to the arguments shared by `createNavBarRoutes()` and
`createRenderer()`.

```tsx
import type { ReactElement } from "react"

type PageSuspenseOptions =
  | { enabled: false }
  | { enabled: true; fallback: "default" | ReactElement }
```

`pageSuspense` is optional:

- When omitted or disabled, route elements are passed through unchanged.
- When enabled, every root/subpage route element is wrapped in an individual `Suspense` boundary.
- `fallback: "default"` selects the library's loading indicator; a `ReactElement` supplies a
  custom one.

The discriminated union makes enabling the feature explicit and does not assign special behavior
to `null` or `undefined` fallback values.

## Why simple-navbar should not own dynamic imports

`simple-navbar` does not know the application module paths or exports, so the application should
continue to declare lazy components:

```tsx
const Explorer = lazy(() => import("./Explorer").then(
  ({ Explorer: Component }) => ({ default: Component }),
))
```

The library should only provide the page-level `Suspense` boundary. This keeps module ownership
with the application and avoids coupling `simple-navbar` to a particular file layout or export
style.

## Implementation

### 1. Add a route-element wrapper

Add a small helper near `createNavBarRoutes`:

```tsx
import { Suspense, type ReactElement } from "react"

function wrapPageWithSuspense(
  element: ReactElement,
  pageSuspense: PageSuspenseOptions | undefined,
): ReactElement {
  if (pageSuspense?.enabled !== true) {
    return element
  }
  const fallback = pageSuspense.fallback === "default"
    ? <DefaultPageFallback />
    : pageSuspense.fallback
  return (
    <Suspense fallback={fallback}>
      {element}
    </Suspense>
  )
}
```

`DefaultPageFallback` displays an accessible, centered MUI progress indicator in the page area.

### 2. Wrap each route separately

Update `createNavBarRoutes()` so that each route receives its own boundary:

```tsx
function createNavBarRoutes({
  rootPageElement,
  pageSuspense,
  ...layoutProps
}: CreateNavBarRoutesArgs): RouteObject[] {
  const routeObjects: RouteObject[] = [
    {
      path: "/",
      element: wrapPageWithSuspense(rootPageElement, pageSuspense),
    },
    ...layoutProps.subpageRoutes.map(({ path, element }) => ({
      path,
      element: wrapPageWithSuspense(element, pageSuspense),
    })),
  ]

  return [
    {
      path: "/",
      element: <Layout {...layoutProps} />,
      children: routeObjects,
    },
  ]
}
```

`pageSuspense` is consumed while routes are created and is not passed to `Layout`.

### 3. Do not wrap only the shared Outlet

Avoid implementing the feature solely as:

```tsx
<Suspense fallback={fallback}>
  <Outlet />
</Suspense>
```

That creates one persistent boundary shared by every route. During a transition, React may retain
the previous page instead of displaying the fallback for the new page. Giving each route its own
boundary preserves the behavior of an application-level helper such as:

```tsx
function lazyPage(element: ReactElement): ReactElement {
  return <Suspense fallback={<PageLoading />}>{element}</Suspense>
}
```

It also keeps the navbar and surrounding layout mounted while only the page body is suspended.

## Example usage

```tsx
import { lazy, type ReactElement } from "react"

import { createRenderer } from "@shwaka/simple-navbar"

const ShowReferences = lazy(() => import("./ShowReferences").then(
  ({ ShowReferences: Component }) => ({ default: Component }),
))
const Explorer = lazy(() => import("./Explorer").then(
  ({ Explorer: Component }) => ({ default: Component }),
))

function PageLoading(): ReactElement {
  return (
    <div
      role="status"
      style={{
        display: "grid",
        minHeight: "40vh",
        placeItems: "center",
      }}
    >
      Loading…
    </div>
  )
}

const subpageRoutes = [
  {
    path: "/show-ref",
    element: <ShowReferences />,
    name: "ShowRef",
  },
  {
    path: "/explorer",
    element: <Explorer />,
    name: "Explorer",
  },
]

const renderRouterProvider = createRenderer({
  rootPageElement: <div>The root page</div>,
  subpageRoutes,
  pageSuspense: {
    enabled: true,
    fallback: <PageLoading />,
  },
  siteTitle: "Bibview",
  gitHubUrl: "https://github.com/shwaka/biblio",
  footerDisplay: "none",
})
```

Creating `<ShowReferences />` in the route definition does not start its dynamic import. The lazy
loader runs only when React Router renders that route.

## Backward compatibility

This should be a backward-compatible minor feature:

- `pageSuspense` is optional.
- Existing `PageRoute` objects are unchanged.
- Existing eager route elements continue to work.
- When `pageSuspense` is omitted or disabled, no additional `Suspense` boundary is added.
- Applications that already wrap route elements in `Suspense` may continue doing so, although they
  should remove the redundant application-level wrapper after adopting `pageSuspense`.

The default loading indicator is deliberately minimal. Applications retain control of presentation
by supplying their own fallback element.

## Tests

Add tests for `createNavBarRoutes()` or `createRenderer()` covering the following cases.

### Existing behavior without pageSuspense

- Route elements are returned unchanged when `pageSuspense` is omitted or disabled.
- The root route and subpage paths remain unchanged.
- Existing navigation tests continue to pass.

### Lazy page with pageSuspense

Create a deferred lazy component:

```tsx
let resolvePage: ((module: { default: () => ReactElement }) => void) | undefined

const LazyPage = lazy(() => new Promise((resolve) => {
  resolvePage = resolve
}))
```

Then verify:

1. Navigate to the lazy route.
2. The supplied fallback is visible.
3. The navbar/layout remains visible.
4. Resolve the lazy module inside `act()`.
5. The page content replaces the fallback.

### Default fallback

- Passing `pageSuspense: { enabled: true, fallback: "default" }` shows the built-in loading
  indicator.
- Passing a React element shows the custom fallback instead.

### Separate boundaries per route

- Two lazy routes can be navigated independently.
- Resolving one lazy route does not resolve or render the other.
- The fallback appears for a newly visited unresolved route.

## Documentation

Document that `pageSuspense` supplies only the Suspense boundary and UI. It does not automatically
split application code. Consumers must use `React.lazy()` and dynamic `import()` for the route
component.

Also document these operational characteristics:

- A lazy module is normally downloaded only on the first visit and then cached.
- `Suspense` handles the loading state, not import failures.
- Applications that need recovery from failed dynamic imports should add an Error Boundary and/or
  deployment-specific handling for stale hashed assets.

## bibview migration after releasing simple-navbar

After publishing and installing the new `simple-navbar` version:

1. Keep the four `lazy()` component declarations in `bibview/src/App.tsx`.
2. Remove the local `lazyPage()` helper.
3. Remove the `Suspense` import from bibview.
4. Change route elements back from `lazyPage(<Explorer />)` to `<Explorer />`, and likewise for the
   other pages.
5. Pass `pageSuspense: { enabled: true, fallback: <PageLoading /> }` to `createRenderer()`.
6. Keep `PageLoading` in bibview so the application controls its presentation.
7. Run lint, tests, and the production build.
8. Confirm that route-level chunks are still emitted and that the chunk-size warning remains
   resolved.

Expected bibview route definition after migration:

```tsx
const subpageRoutes = [
  {
    path: "/show-ref",
    element: <ShowReferences />,
    name: "ShowRef",
  },
  {
    path: "/explorer",
    element: <Explorer />,
    name: "Explorer",
  },
  {
    path: "/overview",
    element: <CollectionOverview />,
    name: "Overview",
  },
  {
    path: "/msc-info",
    element: <MscInfo />,
    name: "MSCガイド",
  },
]

const renderRouterProvider = createRenderer({
  rootPageElement: <div>The root page</div>,
  subpageRoutes,
  pageSuspense: {
    enabled: true,
    fallback: <PageLoading />,
  },
  siteTitle: "Bibview",
  gitHubUrl: "https://github.com/shwaka/biblio",
  footerDisplay: "none",
  contentBoxSx: {
    paddingLeft: "5px",
    paddingRight: "5px",
    overflowX: null,
  },
})
```

## Possible future extension

React Router also supports a native `route.lazy` API that can lazily provide route `Component`,
`loader`, and `action` implementations. Exposing that API through `PageRoute` could be useful if
`simple-navbar` later needs to support data routes.

That is a broader API change and is not required for the current use case. The proposed
`pageSuspense` feature should remain focused on providing a reusable page-level Suspense boundary
for applications that already use `React.lazy()`.
