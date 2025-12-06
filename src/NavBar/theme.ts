import type { Theme } from "@mui/material"
import { createTheme } from "@mui/material"

// https://mui.com/material-ui/customization/palette/#adding-new-colors
declare module "@mui/material/styles" {
  interface Palette {
    currentPath: Palette["primary"]
    otherPath: Palette["primary"]
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    currentPath?: PaletteOptions["primary"]
    otherPath?: PaletteOptions["primary"]
  }
}

// Update the Button"s color prop options
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    currentPath: true
    otherPath: true
  }
}

export const theme = createTheme({
  palette: {
    currentPath: {
      // main: "#90caf9",
      main: "#00f",
    },
    otherPath: {
      // main: "#fff",
      main: "#000",
    },
  },
})

export function createNavBarTheme(theme: Theme): Theme {
  return createTheme(theme, {
    palette: {
      currentPath: {
        main: theme.palette.primary.main,
      },
      otherPath: {
        main: "#000",
      }
    }
  })
}
