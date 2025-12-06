import type { ReactElement } from "react"

import { Box } from "@mui/material"
import { Outlet } from "react-router"

import { NavBar } from "../NavBar"
import { Footer } from "./Footer"
import type { PageRoute } from "./PageRoute"

export interface LayoutProps {
  pageRoutes: PageRoute[]
  siteTitle: string
  numberOfExplicitItems?: number
  gitHubUrl: string
  footerDisplay: "block" | "none"
}

export function Layout({ pageRoutes, siteTitle, numberOfExplicitItems, gitHubUrl, footerDisplay }: LayoutProps): ReactElement {
  const items = pageRoutes.filter(({ path }) => path !== "/").map((page) => ({
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
        sx={{ marginTop: "10px", width: "100%", overflowX: "auto" }}
      >
        <Outlet />
        <Footer pageRoutes={pageRoutes} display={footerDisplay} />
      </Box>
    </div>
  )
}
