import type { ReactElement, ReactNode } from "react"

import { Box, CssBaseline, type SxProps, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material"
import { ThemeProvider, createTheme, useColorScheme } from "@mui/material/styles"
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

function SelectColorMode(): ReactNode {
  const { mode, setMode } = useColorScheme()
  if (mode === undefined) {
    return null
  }
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "text.primary",
        borderRadius: 1,
        p: 3,
        minHeight: "56px",
      }}
    >
      <FormControl>
        <FormLabel id="demo-theme-toggle">Theme</FormLabel>
        <RadioGroup
          aria-labelledby="demo-theme-toggle"
          name="theme-toggle"
          row
          value={mode}
          onChange={(event) =>
            setMode(event.target.value as "system" | "light" | "dark")}
        >
          <FormControlLabel value="system" control={<Radio />} label="System" />
          <FormControlLabel value="light" control={<Radio />} label="Light" />
          <FormControlLabel value="dark" control={<Radio />} label="Dark" />
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
})

export function Layout({ subpageRoutes, siteTitle, numberOfExplicitItems, gitHubUrl, footerDisplay, contentBoxSx }: LayoutProps): ReactElement {
  validateSubpageRoutes(subpageRoutes)
  const items = subpageRoutes.map((page) => ({
    path: page.path,
    text: page.name,
  }))
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
          <SelectColorMode />
          <Outlet />
          <Footer subpageRoutes={subpageRoutes} display={footerDisplay} />
        </Box>
      </ThemeProvider>
    </div>
  )
}
