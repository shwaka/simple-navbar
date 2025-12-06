import { type PageRoute } from "./PageRoute"

export function validateSubpageRoutes(subpageRoutes: PageRoute[]): void {
  for (const subpageRoute of subpageRoutes) {
    const path = subpageRoute.path
    if (path.length === 0) {
      throw new Error("path must be non-empty in subpageRoutes")
    }
    if (path === "/") {
      throw new Error("path must not be \"/\" in subpageRoutes")
    }
    if (!path.startsWith("/")) {
      throw new Error(`path must start with "/" in subpageRoutes, but was ${path}`)
    }
  }
}
