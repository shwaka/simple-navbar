import type { ReactElement } from "react"

import GitHub from "@mui/icons-material/GitHub"
import { IconButton, Link } from "@mui/material"

export function GitHubLink({ gitHubUrl }: { gitHubUrl?: string }): ReactElement | null {
  if (gitHubUrl === undefined) {
    return null
  }
  return (
    <IconButton
      component={Link}
      href={gitHubUrl}
      target="_blank"
    >
      <GitHub />
    </IconButton>
  )
}
