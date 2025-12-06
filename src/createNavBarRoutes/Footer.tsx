import type { ReactElement } from "react"

import { Link, Paper } from "@mui/material"
import { Link as RouterLink } from "react-router"

import type { PageRoute } from "./PageRoute"

interface FooterProps {
  subpageRoutes: PageRoute[]
  display: "block" | "none"
}

export function Footer({ subpageRoutes, display }: FooterProps): ReactElement {
  return (
    <Paper
      elevation={3}
      sx={{
        margin: "10px",
        display: display,
      }}
    >
      <ul>
        {subpageRoutes.map(({ path, name }) => (
          <li key={path}>
            <Link component={RouterLink} to={path}>{name}</Link>
          </li>
        ))}
      </ul>
    </Paper>
  )
}
