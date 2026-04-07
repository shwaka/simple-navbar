import { createTheme, type Theme } from "@mui/material"

interface CreateSimpleThemeArgs {
  mainHue: number
}

export function createSimpleTheme({ mainHue }: CreateSimpleThemeArgs): Theme {
  return createTheme({
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: hslToHex(mainHue, 70, 40),
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: hslToHex(mainHue, 70, 60),
          },
        },
      },
    },
  })
}

// Source - https://stackoverflow.com/a/44134328
// Posted by Juraj, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-07, License - CC BY-SA 4.0

function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = (n: number): string => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, "0") // convert to Hex and prefix "0" if needed
  }
  return `#${f(0)}${f(8)}${f(4)}`
}
