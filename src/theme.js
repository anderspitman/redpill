export const defaultTheme = {
  numColumns: 40,
  fontFamily: 'Courier New',
  fontSize: 60,
  fontWeight: 'bold',
  fontColor: '#40C219',
  backgroundColor: 'black',
}

export function validateTheme(theme) {
  function themeThrow(message) {
    throw "Invalid theme: " + message
  }

  if (!theme.numColumns) {
    themeThrow("numColumns")
  }
}
