import type { ReactElement } from "react"

import { AppBar, Toolbar } from "@mui/material"

import type { NavBarItem } from "./NavBarItem"
import { NavBarItemsDesktop } from "./NavBarItemsDesktop"
import { NavBarItemsMobile } from "./NavBarItemsMobile"
import { Title } from "./Title"

interface NavBarProps {
  title: string
  numberOfExplicitItems?: number
  gitHubUrl?: string
  items: NavBarItem[]
}

export function NavBar({ title, items, gitHubUrl, numberOfExplicitItems }: NavBarProps): ReactElement {
  return (
    <AppBar position="sticky" color="inherit">
      <Toolbar disableGutters>
        <NavBarItemsMobile
          title={title} items={items} gitHubUrl={gitHubUrl}
        />
        <Title title={title} />
        <NavBarItemsDesktop
          items={items} gitHubUrl={gitHubUrl}
          numberOfExplicitItems={numberOfExplicitItems}
        />
      </Toolbar>
    </AppBar>
  )
}
