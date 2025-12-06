import { createNavBarRoutes } from "@shwaka/simple-navbar"
import { createHashRouter, RouterProvider } from "react-router"

import "./index.css"

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

const router = createHashRouter(
  createNavBarRoutes({
    rootPageElement: <div>The root page</div>,
    subpageRoutes,
    siteTitle: "SimpleNavbar",
    gitHubUrl: "https://github.com/shwaka/simple-navbar",
    footerDisplay: "none",
  })
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
