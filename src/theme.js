export const defaultTheme = {
  fontFamily: 'Courier New',
  fontSize: 20,
  fontWeight: 'bold',
  fontColor: '#26a750',
  backgroundColor: 'black',
}

export function validateTheme(theme) {
  function themeThrow(message) {
    throw "Invalid theme: " + message
  }
}
