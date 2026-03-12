import { type MouseEvent, useState, type ReactElement, Fragment } from "react"

import LightMode from "@mui/icons-material/LightMode"
import { IconButton, Menu, MenuItem } from "@mui/material"

export function ColorModeSelector(): ReactElement {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (): void => {
    setAnchorEl(null)
  }
  return (
    <Fragment>
      <IconButton onClick={handleClick}>
        <LightMode />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={handleClose}>System</MenuItem>
        <MenuItem onClick={handleClose}>Light</MenuItem>
        <MenuItem onClick={handleClose}>Dark</MenuItem>
      </Menu>
    </Fragment>
  )
}
