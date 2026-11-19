import { type ReactElement } from "react"

import type { RouteObject } from "react-router"

import type { LayoutProps } from "./Layout"
import { Layout } from "./Layout"
import type { PageSuspenseOptions } from "./PageSuspense"
import { wrapPageWithSuspense } from "./PageSuspense"

type CreateNavBarRoutesArgs = LayoutProps & {
  rootPageElement: ReactElement
  pageSuspense?: PageSuspenseOptions
}

export function createNavBarRoutes({
  rootPageElement, pageSuspense, ...layoutProps
}: CreateNavBarRoutesArgs): RouteObject[] {
  const routeObjects: RouteObject[] = [
    {
      path: "/",
      element: wrapPageWithSuspense(rootPageElement, pageSuspense),
    },
    ...layoutProps.subpageRoutes.map(
      ({ path, element }) => ({
        path,
        element: wrapPageWithSuspense(element, pageSuspense),
      })
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
