import { createNavBarRoutes } from "@shwaka/simple-navbar"
import { createHashRouter, RouterProvider } from "react-router"

const pageRoutes = [
  {
    path: "/",
    element: <div>The root page</div>,
    name: "Note: this name is ignored",
  },
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
    pageRoutes,
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
