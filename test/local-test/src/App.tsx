import { createRenderer, createSimpleTheme, RouteCardList } from "@shwaka/simple-navbar"
import { lazy } from "react"

import "./index.css"
import { ThemeProvider } from "@emotion/react"

const DefaultFallbackDemo = lazy(async () => {
  const module = await import("./DefaultFallbackDemo")
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return module
})

const subpageRoutes = [
  {
    path: "/foo",
    element: <div>This is foo</div>,
    name: "Foo",
    description: "ここにFooの説明を書く．"
  },
  {
    path: "/bar",
    element: <div>This is bar</div>,
    name: "Bar",
  },
  {
    path: "/baz",
    element: <div>This is baz</div>,
    name: "Baz",
    hidden: true,
  },
  {
    path: "/default-fallback",
    element: <DefaultFallbackDemo />,
    name: "Default fallback",
    description: "1.5秒間の遅延読み込み中に、既定のfallbackを表示します。",
  },
]

const renderRouterProvider = createRenderer({
  rootPageElement: <RouteCardList subpageRoutes={subpageRoutes} />,
  subpageRoutes,
  siteTitle: "SimpleNavbar",
  gitHubUrl: "https://github.com/shwaka/simple-navbar",
  footerDisplay: "none",
  contentBoxSx: { paddingLeft: "10px" },
  pageSuspense: {
    enabled: true,
    fallback: "default",
  },
})

const theme = createSimpleTheme({
  mainHue: 250,
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      {renderRouterProvider()}
    </ThemeProvider>
  )
}

export default App
