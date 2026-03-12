import type { ReactElement } from "react"

import { Button } from "@mui/material"
import { Link as RouterLink } from "react-router"

interface TitleDesktopProps {
  title: string
  onClick?: () => void
}

export function Title({ title, onClick }: TitleDesktopProps): ReactElement {
  return (
    <Button
      variant="text" size="large"
      sx={{
        mr: 2,
        fontWeight: 700,
        fontSize: "h6.fontSize",
        textTransform: "none",
      }}
      color="inherit" component={RouterLink}
      to="/"
      onClick={onClick}
    >
      {title}
    </Button>
  )
}
