import { type ReactElement } from "react"

import type { RouteObject } from "react-router"

import type { LayoutProps } from "./Layout"
import { Layout } from "./Layout"

type CreateNavBarRoutesArgs = LayoutProps & {
  rootPageElement: ReactElement
}

export function createNavBarRoutes({
  rootPageElement, ...layoutProps
}: CreateNavBarRoutesArgs): RouteObject[] {
  const routeObjects: RouteObject[] = [
    {
      path: "/",
      element: rootPageElement
    },
    ...layoutProps.subpageRoutes.map(
      ({ path, element }) => ({ path, element })
    )
  ]
  return [
    {
      path: "/",
      element: <Layout {...layoutProps} />,
      // The `map` below excludes `name`
      children: routeObjects,
    },
  ]
}
