import type { ReactElement } from "react"

import { Button } from "@mui/material"
import { Link, useLocation } from "react-router"

interface NavLinkButtonProps {
  to: string
  children: string
  isMobile: boolean
  onClick?: () => void
}

export function NavLinkButton({ to, children, isMobile, onClick }: NavLinkButtonProps): ReactElement {
  const { pathname } = useLocation()
  const color = (pathname === to) ? "primary.main" : "text.primary"
  const size = isMobile ? "small" : "large"
  const additionalSx = isMobile
    ? {
      justifyContent: "flex-start",
      lineHeight: 1.0,
    }
    : {}
  const fullWidth = isMobile ? true : false
  return (
    <Button
      variant="text" size={size}
      sx={{
        color, // cannot put "text.primary" to Button.color directly
        fontSize: "h6.fontSize",
        textTransform: "none",
        ...additionalSx,
      }}
      component={Link}
      fullWidth={fullWidth}
      to={to}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
