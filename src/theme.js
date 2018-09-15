export const defaultTheme = {
  numColumns: 40,
  fontFamily: 'Courier New',
  fontSize: 40,
  fontWeight: 'bold',
  fontColor: '#49C071',
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
