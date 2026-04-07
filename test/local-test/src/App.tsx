import { createRenderer, createSimpleTheme } from "@shwaka/simple-navbar"

import "./index.css"
import { ThemeProvider } from "@emotion/react"

const subpageRoutes = [
  {
    path: "/foo",
    element: <div>This is foo</div>,
    name: "Foo",
  },
  {
    path: "/bar",
    element: <div>This is bar</div>,
    name: "Bar",
  },
]

const renderRouterProvider = createRenderer({
  rootPageElement: <div>The root page</div>,
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
