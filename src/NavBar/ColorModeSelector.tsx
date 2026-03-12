import type { ReactElement } from "react"

import LightMode from "@mui/icons-material/LightMode"
import { IconButton } from "@mui/material"

export function ColorModeSelector(): ReactElement {
  return (
    <IconButton>
      <LightMode />
    </IconButton>
  )
}
