import { useState, type ReactElement } from "react"

import MenuIcon from "@mui/icons-material/Menu"
import { Box, Divider, Drawer, IconButton, List, ListItem } from "@mui/material"
import { styled } from "@mui/material/styles"

import { ColorModeSelector } from "./ColorModeSelector"
import { displayMobile } from "./display"
import { GitHubLink } from "./GitHubLink"
import type { NavBarItem } from "./NavBarItem"
import { NavLinkButton } from "./NavLinkButton"
import { Title } from "./Title"

// Copied from https://mui.com/material-ui/react-drawer/
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  // justifyContent: "flex-end",
}))

interface NavBarItemsMobileProps {
  title: string
  items: NavBarItem[]
  gitHubUrl?: string
}

export function NavBarItemsMobile({ title, items, gitHubUrl }: NavBarItemsMobileProps): ReactElement {
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
        <DrawerHeader>
          <Title title={title} />

          <Box sx={{ flexGrow: 1 }} />{/* Put the rest on the right */}

          <GitHubLink gitHubUrl={gitHubUrl} />
          <ColorModeSelector />
        </DrawerHeader>
        <Divider />
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
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}
