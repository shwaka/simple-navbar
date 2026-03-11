import type { ReactElement } from "react"

import { Box, CssBaseline, type SxProps } from "@mui/material"
import { ThemeProvider, createTheme, Theme } from "@mui/material/styles"
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
  colorMode?: "light" | "dark"
}

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
})

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

function getTheme(colorMode: "light" | "dark" | undefined): Theme {
  switch (colorMode) {
    case "light":
    case undefined:
      return lightTheme
    case "dark":
      return darkTheme
  }
}

export function Layout({ subpageRoutes, siteTitle, numberOfExplicitItems, gitHubUrl, footerDisplay, contentBoxSx, colorMode }: LayoutProps): ReactElement {
  validateSubpageRoutes(subpageRoutes)
  const items = subpageRoutes.map((page) => ({
    path: page.path,
    text: page.name,
  }))
  const colorTheme = getTheme(colorMode)
  return (
    <div>
      <ThemeProvider theme={colorTheme}>
        <CssBaseline />
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
      </ThemeProvider>
    </div>
  )
}
