import type { MouseEvent } from "react"
import { Fragment, useState, type ReactElement } from "react"

import { Box, Button, ListItem, Menu } from "@mui/material"

import { displayDesktop } from "./display"
import { GitHubLink } from "./GitHubLink"
import type { NavBarItem } from "./NavBarItem"
import { NavLinkButton } from "./NavLinkButton"

function NavBarItemButton({ item, onClick }: { item: NavBarItem, onClick?: () => void }): ReactElement {
  return (
    <NavLinkButton
      to={item.path}
      isMobile={false}
      onClick={onClick}
    >
      {item.text}
    </NavLinkButton>
  )
}

function ExplicitItems({ items }: { items: NavBarItem[] }): ReactElement {
  return (
    <Fragment>
      {items.map((item) => (
        <NavBarItemButton
          key={`${item.path}-${item.text}`}
          item={item}
        />
      ))}
    </Fragment>
  )
}

function ImplicitItems({ items }: { items: NavBarItem[] }): ReactElement {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(menuAnchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setMenuAnchorEl(event.currentTarget)
  }
  const handleClose = (): void => {
    setMenuAnchorEl(null)
  }

  if (items.length == 0) {
    return (<Fragment></Fragment>)
  }

  return (
    <Fragment>
      <Button
        onClick={handleClick}
      >
        ▽others
      </Button>
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleClose}
      >
        {items.map((item) => (
          <ListItem
            key={`${item.path}-${item.text}`}
          >
            {/* MenuItem だとクリック可能範囲が全体になってしまう．NavLinkButton を流用するために ListItem を使う */}
            <NavBarItemButton
              item={item}
              onClick={handleClose}
            />
          </ListItem>
        ))}
      </Menu>
    </Fragment>
  )
}

interface NavBarItemsDesktopProps {
  items: NavBarItem[]
  numberOfExplicitItems?: number
  gitHubUrl?: string
}

export function NavBarItemsDesktop({ items, gitHubUrl, numberOfExplicitItems }: NavBarItemsDesktopProps): ReactElement {
  const num = (numberOfExplicitItems === undefined) ? 5 : numberOfExplicitItems
  const explicitItems = items.slice(0, num)
  const implicitItems = items.slice(num)
  return (
    <Box sx={{ flexGrow: 1, display: displayDesktop }}>
      <ExplicitItems items={explicitItems} />
      <ImplicitItems items={implicitItems} />
      <GitHubLink gitHubUrl={gitHubUrl} />
    </Box>
  )
}
