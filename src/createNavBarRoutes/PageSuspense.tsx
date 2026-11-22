import {
  Fragment,
  Suspense,
  startTransition,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react"

import { Box, CircularProgress, Typography } from "@mui/material"

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
  fallback: ReactElement
  loadingFallback: ReactElement
  renderingFallback: ReactElement
  preload?: () => Promise<unknown>
  children: ReactElement
}

interface RenderGateBranchProps {
  fallback: ReactElement
  children: ReactElement
}

function scheduleAfterPaint(callback: () => void): () => void {
  let renderFrame: number | undefined
  const loadingFrame = requestAnimationFrame(() => {
    renderFrame = requestAnimationFrame(callback)
  })

  return () => {
    cancelAnimationFrame(loadingFrame)
    if (renderFrame !== undefined) {
      cancelAnimationFrame(renderFrame)
    }
  }
}

function PageRenderGateWithoutPreload({
  fallback, children,
}: RenderGateBranchProps): ReactElement {
  const [canRender, setCanRender] = useState(false)

  useEffect(() => {
    return scheduleAfterPaint(() => {
      startTransition(() => setCanRender(true))
    })
  }, [])

  return canRender ? <Fragment>{children}</Fragment> : fallback
}

interface PageRenderGateWithPreloadProps {
  preload: () => Promise<unknown>
  loadingFallback: ReactElement
  renderingFallback: ReactElement
  children: ReactElement
}

type PreloadedRenderPhase = "loading" | "rendering" | "render"

function PageRenderGateWithPreload({
  preload, loadingFallback, renderingFallback, children,
}: PageRenderGateWithPreloadProps): ReactElement {
  const [phase, setPhase] = useState<PreloadedRenderPhase>("loading")
  const preloadPromise = useRef<Promise<void> | undefined>(undefined)

  useEffect(() => {
    if (preloadPromise.current === undefined) {
      // This is a speculative preload. The actual lazy render remains
      // responsible for surfacing loader failures to an Error Boundary.
      try {
        preloadPromise.current = preload().then(
          () => undefined,
          () => undefined,
        )
      } catch {
        // A synchronous loader failure is likewise left to the lazy render.
        preloadPromise.current = Promise.resolve()
      }
    }

    let cancelled = false
    let cancelRenderingPaint: (() => void) | undefined
    const cancelLoadingPaint = scheduleAfterPaint(() => {
      void preloadPromise.current?.then(() => {
        if (cancelled) {
          return
        }

        setPhase("rendering")
        cancelRenderingPaint = scheduleAfterPaint(() => {
          startTransition(() => setPhase("render"))
        })
      })
    })

    return () => {
      cancelled = true
      cancelLoadingPaint()
      cancelRenderingPaint?.()
    }
  }, [preload])

  if (phase === "loading") {
    return loadingFallback
  }
  if (phase === "rendering") {
    return renderingFallback
  }
  return <Fragment>{children}</Fragment>
}

export function PageRenderGate({
  fallback, loadingFallback, renderingFallback, preload, children,
}: PageRenderGateProps): ReactElement {
  if (preload === undefined) {
    return (
      <PageRenderGateWithoutPreload fallback={fallback}>
        {children}
      </PageRenderGateWithoutPreload>
    )
  }

  return (
    <PageRenderGateWithPreload
      preload={preload}
      loadingFallback={loadingFallback}
      renderingFallback={renderingFallback}
    >
      {children}
    </PageRenderGateWithPreload>
  )
}

interface DefaultPageFallbackProps {
  statusText?: "Loading..." | "Rendering..."
}

function DefaultPageFallback({ statusText }: DefaultPageFallbackProps): ReactElement {
  // Keep the arc length stable when a synchronous page render blocks the main
  // thread. MUI recommends disableShrink for high-CPU-load cases.
  const progress = <CircularProgress disableShrink />

  return (
    <Box
      role="status"
      aria-label={statusText === "Rendering..." ? "Rendering" : "Loading"}
      sx={{
        display: "grid",
        minHeight: "40vh",
        placeItems: "center",
      }}
    >
      {statusText === undefined
        ? progress
        : (
          <Box sx={{ display: "grid", gap: 1, justifyItems: "center" }}>
            {progress}
            <Typography>{statusText}</Typography>
          </Box>
        )}
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
  const customFallback = pageSuspense.fallback === "default"
    ? undefined
    : pageSuspense.fallback
  const fallback = customFallback ?? <DefaultPageFallback />
  const loadingFallback = customFallback ??
    <DefaultPageFallback statusText="Loading..." />
  const renderingFallback = customFallback ??
    <DefaultPageFallback statusText="Rendering..." />
  const suspenseFallback = deferInitialRender && preload !== undefined
    ? loadingFallback
    : fallback
  return (
    <Suspense key={routeKey} fallback={suspenseFallback}>
      {deferInitialRender
        ? (
          <PageRenderGate
            fallback={fallback}
            loadingFallback={loadingFallback}
            renderingFallback={renderingFallback}
            preload={preload}
          >
            {element}
          </PageRenderGate>
        )
        : element}
    </Suspense>
  )
}
