import { createFetcher } from './fetcher'
import { defaultTheme, validateTheme } from './theme'

export class Rainer {
  constructor({ sourceType, githubUsername, githubPassword, domElementId, theme, fileTypes }) {
    if (sourceType !== 'github') {
      throw "Invalid sourceType: " + sourceType
    }

    if (!theme) {
      theme = defaultTheme
    }

    validateTheme(theme)

    const fetcherOptions = {
      sourceType,
      githubUsername,
      githubPassword,
      fileTypes,
      numLines: 10,
    }

    const fetcher = createFetcher(fetcherOptions)
    const el = document.getElementById(domElementId)

    fetcher.fetchLines().then((lines) => {
      console.log("donz")
      console.log(lines)
    })

    this._el = el
  }
}
