import { createRenderer, createSimpleTheme, RouteCardList } from "@shwaka/simple-navbar"

import "./index.css"
import { ThemeProvider } from "@emotion/react"

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
]

const renderRouterProvider = createRenderer({
  rootPageElement: <RouteCardList subpageRoutes={subpageRoutes} />,
  subpageRoutes,
  siteTitle: "SimpleNavbar",
  gitHubUrl: "https://github.com/shwaka/simple-navbar",
  footerDisplay: "none",
  contentBoxSx: { paddingLeft: "10px" },
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
