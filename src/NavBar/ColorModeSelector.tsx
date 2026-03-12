import { type MouseEvent, useState, type ReactElement, Fragment, useCallback } from "react"

import DarkMode from "@mui/icons-material/DarkMode"
import LightMode from "@mui/icons-material/LightMode"
import SettingsBrightness from "@mui/icons-material/SettingsBrightness"
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material"
import { useColorScheme } from "@mui/material/styles"

const colorModeMenuConfig = {
  system: {
    text: "System",
    // MUI公式ドキュメントの system/light/dark 設定画面で使われてたアイコン
    icon: (): ReactElement => (<SettingsBrightness fontSize="small" />),
  },
  light: {
    text: "Light",
    icon: (): ReactElement => (<LightMode fontSize="small" />),
  },
  dark: {
    text: "Dark",
    icon: (): ReactElement => (<DarkMode fontSize="small" />),
  },
} as const

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
        {(["system", "light", "dark"] as const).map((m) => (
          <MenuItem
            selected={m === mode}
            onClick={() => setColorMode(m)}
            key={m}
          >
            <ListItemIcon>
              {colorModeMenuConfig[m].icon()}
            </ListItemIcon>
            <ListItemText>
              {m}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  )
}
