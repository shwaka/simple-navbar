import { type MouseEvent, useState, type ReactElement, Fragment, useCallback } from "react"

import LightMode from "@mui/icons-material/LightMode"
import { IconButton, Menu, MenuItem } from "@mui/material"
import { useColorScheme } from "@mui/material/styles"

export function ColorModeSelector(): ReactElement {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = useCallback((): void => {
    setAnchorEl(null)
  }, [setAnchorEl])
  const { mode, setMode } = useColorScheme()
  const setColorMode = useCallback((m: "light" | "dark" | "system" | null): void => {
    setMode(m)
    handleClose()
  }, [setMode, handleClose])
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
        <MenuItem onClick={() => setColorMode("system")}>System</MenuItem>
        <MenuItem onClick={() => setColorMode("light")}>Light</MenuItem>
        <MenuItem onClick={() => setColorMode("dark")}>Dark</MenuItem>
      </Menu>
    </Fragment>
  )
}
