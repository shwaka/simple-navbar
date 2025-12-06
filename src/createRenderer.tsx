import { type ReactElement } from "react"

import { createHashRouter, RouterProvider } from "react-router"

import { createNavBarRoutes } from "./createNavBarRoutes"

type Args = Parameters<typeof createNavBarRoutes>[0]

export function createRenderer(args: Args): () => ReactElement {
  const router = createHashRouter(createNavBarRoutes(args))
  const renderRouterProvider = (): ReactElement => (
    <RouterProvider router={router} />
  )
  return renderRouterProvider
}
