import { createTheme, type Theme } from "@mui/material"
import Color from "colorjs.io"

interface CreateSimpleThemeArgs {
  mainHue: number
}

export function createSimpleTheme({ mainHue }: CreateSimpleThemeArgs): Theme {
  return createTheme({
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: oklchToHex(0.60, 0.70, mainHue),
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: oklchToHex(0.60, 0.70, mainHue),
          },
        },
      },
    },
  })
}

// HSLだと，色によって背景とのコントラストがかなり違ってしまう
function oklchToHex(l: number, c: number, h: number): string {
  const color = new Color("oklch", [l, c, h])
  return color.to("srgb").toString({ format: "hex" })
}
