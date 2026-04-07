import { type ReactElement } from "react"

import { Box, Card, CardActionArea, Typography } from "@mui/material"
import { Link } from "react-router"

import { type PageRoute } from "./createNavBarRoutes/PageRoute"

type Props = {
  subpageRoutes: PageRoute[]
  cardWidth?: number
}

export function RouteCardList({ subpageRoutes, cardWidth = 240 }: Props): ReactElement {
  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      {subpageRoutes
        .filter((route) => route.hidden !== true)
        .map((route) => (
          <Card key={route.path} sx={{ width: cardWidth }}>
            <CardActionArea component={Link} to={route.path} sx={{ height: "100%" }}>
              <Box p={2}>
                <Typography variant="h6">
                  {route.name}
                </Typography>

                {route.description !== undefined && (
                  <Typography variant="body2" color="text.secondary">
                    {route.description}
                  </Typography>
                )}
              </Box>
            </CardActionArea>
          </Card>
        ))}
    </Box>
  )
}
