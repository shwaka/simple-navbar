import { useState, type ReactElement } from "react"

import MenuIcon from "@mui/icons-material/Menu"
import { Box, Drawer, IconButton, List, ListItem } from "@mui/material"

import { displayMobile } from "./display"
import { GitHubLink } from "./GitHubLink"
import type { NavBarItem } from "./NavBarItem"
import { NavLinkButton } from "./NavLinkButton"

interface NavBarItemsMobileProps {
  items: NavBarItem[]
  gitHubUrl?: string
}

export function NavBarItemsMobile({ items, gitHubUrl }: NavBarItemsMobileProps): ReactElement {
  const [open, setOpen] = useState(false)
  return (
    <Box
      sx={{ display: displayMobile }}
    >
      <IconButton
        size="large" color="inherit"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{ width: "80vw" }}
        >
          <List dense={true}>
            {items.map((item) => (
              <ListItem key={`${item.path}-${item.text}`} disablePadding={true}>
                <NavLinkButton
                  to={item.path}
                  isMobile={true}
                  onClick={() => setOpen(false)}
                >
                  {item.text}
                </NavLinkButton>
              </ListItem>
            ))}
            <GitHubLink gitHubUrl={gitHubUrl} />
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}
