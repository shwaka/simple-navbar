import {
  Fragment,
  Suspense,
  startTransition,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react"

import { Box, CircularProgress } from "@mui/material"

export type PageSuspenseOptions =
  | {
    enabled: false
  }
  | {
    enabled: true
    fallback: "default" | ReactElement
    deferInitialRender?: boolean
  }

interface PageRenderGateProps {
  enabled: boolean
  fallback: ReactElement
  preload?: () => Promise<unknown>
  children: ReactElement
}

export function PageRenderGate({
  enabled, fallback, preload, children,
}: PageRenderGateProps): ReactElement {
  const [canRender, setCanRender] = useState(!enabled)
  const didPreload = useRef(false)

  useEffect(() => {
    if (!enabled) {
      return
    }

    if (!didPreload.current && preload !== undefined) {
      didPreload.current = true
      // This is a speculative preload. The actual lazy render remains
      // responsible for surfacing loader failures to an Error Boundary.
      try {
        void preload().catch(() => undefined)
      } catch {
        // A synchronous loader failure is likewise left to the lazy render.
      }
    }

    let renderFrame: number | undefined
    const loadingFrame = requestAnimationFrame(() => {
      renderFrame = requestAnimationFrame(() => {
        startTransition(() => setCanRender(true))
      })
    })

    return () => {
      cancelAnimationFrame(loadingFrame)
      if (renderFrame !== undefined) {
        cancelAnimationFrame(renderFrame)
      }
    }
  }, [enabled, preload])

  return canRender ? <Fragment>{children}</Fragment> : fallback
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
      {/* Keep the arc length stable when a synchronous page render blocks the
          main thread. MUI recommends disableShrink for high-CPU-load cases. */}
      <CircularProgress disableShrink />
    </Box>
  )
}

export function wrapPageWithSuspense(
  element: ReactElement,
  pageSuspense: PageSuspenseOptions | undefined,
  routeKey: string,
  deferInitialRender = false,
  preload?: () => Promise<unknown>,
): ReactElement {
  if (pageSuspense?.enabled !== true) {
    return element
  }
  const fallback = pageSuspense.fallback === "default"
    ? <DefaultPageFallback />
    : pageSuspense.fallback
  return (
    <Suspense key={routeKey} fallback={fallback}>
      {deferInitialRender
        ? (
          <PageRenderGate enabled={true} fallback={fallback} preload={preload}>
            {element}
          </PageRenderGate>
        )
        : element}
    </Suspense>
  )
}
