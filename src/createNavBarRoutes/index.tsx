import type { RouteObject } from "react-router"

import type { LayoutProps } from "./Layout"
import { Layout } from "./Layout"

export function createNavBarRoutes(layoutProps: LayoutProps): RouteObject[] {
  return [
    {
      path: "/",
      element: <Layout {...layoutProps} />,
      // The `map` below excludes `name`
      children: layoutProps.pageRoutes.map(({ path, element }) => ({ path, element })),
    },
  ]
}
