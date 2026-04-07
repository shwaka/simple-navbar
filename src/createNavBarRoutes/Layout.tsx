import type { ReactElement } from "react"

import { useTheme } from "@emotion/react"
import { Box, CssBaseline, type SxProps } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { deepmerge } from "@mui/utils"
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

export function Layout({ subpageRoutes, siteTitle, numberOfExplicitItems, gitHubUrl, footerDisplay, contentBoxSx }: LayoutProps): ReactElement {
  validateSubpageRoutes(subpageRoutes)
  const items = subpageRoutes.map((page) => ({
    path: page.path,
    text: page.name,
  }))
  const parentTheme = useTheme()
  // https://mui.com/material-ui/customization/theming/#createtheme-options-args-theme
  // createTheme に複数のargsを与えるのはdeprecaded.
  // 自分で deepmerge することが推奨されている．
  // 外側でカスタムthemeを導入している場合に，そのdarkの値を尊重したいので，
  // parentThemeを後に置く必要がある．
  const theme = createTheme(deepmerge(
    {
      colorSchemes: {
        dark: true,
      }
    },
    parentTheme,
  ))
  return (
    <div>
      <ThemeProvider theme={theme}>
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
