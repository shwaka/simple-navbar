import type { ReactElement } from "react"

import { Link, Paper } from "@mui/material"
import { Link as RouterLink } from "react-router"

import type { PageRoute } from "./PageRoute"

interface FooterProps {
  pageRoutes: PageRoute[]
  display: "block" | "none"
}

export function Footer({ pageRoutes, display }: FooterProps): ReactElement {
  return (
    <Paper
      elevation={3}
      sx={{
        margin: "10px",
        display: display,
      }}
    >
      <ul>
        {pageRoutes.filter(({ path }) => path !== "/").map(({ path, name }) => (
          <li key={path}>
            <Link component={RouterLink} to={path}>{name}</Link>
          </li>
        ))}
      </ul>
    </Paper>
  )
}
