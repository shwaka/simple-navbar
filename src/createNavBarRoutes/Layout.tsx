import type { ReactElement } from "react"

import { Box, type SxProps } from "@mui/material"
import { Outlet } from "react-router"

import { NavBar } from "../NavBar"
import { Footer } from "./Footer"
import type { PageRoute } from "./PageRoute"
import { validateSubpageRoutes } from "./validateSubpageRoutes"

export interface LayoutProps {
  subpageRoutes: PageRoute[]
  siteTitle: string
  numberOfExplicitItems?: number
  gitHubUrl?: string
  footerDisplay: "block" | "none"
  contentBoxSx?: SxProps
}

export function Layout({ subpageRoutes, siteTitle, numberOfExplicitItems, gitHubUrl, footerDisplay, contentBoxSx }: LayoutProps): ReactElement {
  validateSubpageRoutes(subpageRoutes)
  const items = subpageRoutes.map((page) => ({
    path: page.path,
    text: page.name,
  }))
  return (
    <div>
      <NavBar
        title={siteTitle} items={items} gitHubUrl={gitHubUrl}
        numberOfExplicitItems={numberOfExplicitItems}
      />
      <Box
        sx={{
          boxSizing: "border-box",
          marginTop: "10px",
          width: "100%", overflowX: "auto",
          ...contentBoxSx,
        }}
      >
        <Outlet />
        <Footer subpageRoutes={subpageRoutes} display={footerDisplay} />
      </Box>
    </div>
  )
}
