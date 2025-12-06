import type { ReactElement } from "react"

export interface PageRoute {
  path: string
  element: ReactElement
  name: string
}
