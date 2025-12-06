import type { ReactElement } from "react"

import { ThemeProvider } from "@emotion/react"
import { AppBar, Toolbar, useTheme } from "@mui/material"

import type { NavBarItem } from "./NavBarItem"
import { NavBarItemsDesktop } from "./NavBarItemsDesktop"
import { NavBarItemsMobile } from "./NavBarItemsMobile"
import { createNavBarTheme } from "./theme"
import { Title } from "./Title"

interface NavBarProps {
  title: string
  numberOfExplicitItems?: number
  gitHubUrl?: string
  items: NavBarItem[]
}

export function NavBar({ title, items, gitHubUrl, numberOfExplicitItems }: NavBarProps): ReactElement {
  const currentTheme = useTheme()
  const theme = createNavBarTheme(currentTheme)
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" color="inherit">
        <Toolbar disableGutters>
          <NavBarItemsMobile
            items={items} gitHubUrl={gitHubUrl}
          />
          <Title title={title} />
          <NavBarItemsDesktop
            items={items} gitHubUrl={gitHubUrl}
            numberOfExplicitItems={numberOfExplicitItems}
          />
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  )
}
