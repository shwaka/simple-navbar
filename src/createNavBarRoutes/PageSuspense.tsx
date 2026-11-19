import { Suspense, type ReactElement } from "react"

import { Box, CircularProgress } from "@mui/material"

export type PageSuspenseOptions =
  | {
    enabled: false
  }
  | {
    enabled: true
    fallback: "default" | ReactElement
  }

function DefaultPageFallback(): ReactElement {
  return (
    <Box
      role="status"
      aria-label="Loading"
      sx={{
        display: "grid",
        minHeight: "40vh",
        placeItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export function wrapPageWithSuspense(
  element: ReactElement,
  pageSuspense: PageSuspenseOptions | undefined,
  routeKey: string,
): ReactElement {
  if (pageSuspense?.enabled !== true) {
    return element
  }
  const fallback = pageSuspense.fallback === "default"
    ? <DefaultPageFallback />
    : pageSuspense.fallback
  return (
    <Suspense key={routeKey} fallback={fallback}>
      {element}
    </Suspense>
  )
}
