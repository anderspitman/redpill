export const defaultTheme = {
  numColumns: 40,
  fontFamily: 'Courier New',
  fontSize: 16,
  fontWeight: 'normal',
}

export function validateTheme(theme) {
  function themeThrow(message) {
    throw "Invalid theme: " + message
  }

  if (!theme.numColumns) {
    themeThrow("numColumns")
  }
}
