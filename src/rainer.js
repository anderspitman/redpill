import { createFetcher } from './fetcher'
import { defaultTheme, validateTheme } from './theme'

const xmlns = "http://www.w3.org/2000/svg"

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
    const dim = el.getBoundingClientRect()

    fetcher.fetchLines().then((lines) => {
      console.log(lines)

      const svg = document.createElementNS(xmlns, 'svg')
      svg.setAttribute('width', dim.width + 'px')
      svg.setAttribute('height', dim.height + 'px')
      el.appendChild(svg)

      const background = document.createElementNS(xmlns, 'rect')
      background.setAttribute('width', dim.width)
      background.setAttribute('height', dim.height)
      background.setAttribute('fill', theme.backgroundColor)
      svg.appendChild(background)

      const columnWidth = 40
      const numColumns = dim.width / columnWidth

      this._el = el
      this._svg = svg
      this._lines = lines
      this._theme = theme
      this._columnWidth = columnWidth
      this._numColumns = numColumns

      this.animate()
    })
  }

  animate() {
    //for (let col = 0; col < this._numColumns; col++) {
    for (let col = 0; col < 1; col++) {
      this._animateColumn(col)
    }
  }

  _animateColumn(columnIndex) {
    const text = this._getRandomLineText()
    const line = this._createLine(text)
    this._svg.appendChild(line)

    const x = columnIndex * this._columnWidth
    let y = 0

    setInterval(() => {
      y += 10
      requestAnimationFrame(() => { line.setAttribute('transform', translate(x, y) )})
    }, 100)
  }

  _getRandomLineText() {
    const numLines = this._lines.length
    const index = Math.floor(Math.random() * numLines)
    return this._lines[index]
  }

  _createLine(text) {
    const g = document.createElementNS(xmlns, 'g')
    g.setAttribute('transform', translate(0, 0))

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const ch = document.createElementNS(xmlns, 'text')
      ch.textContent = char
      ch.setAttribute('fill', this._theme.fontColor)
      ch.setAttribute('font-family', this._theme.fontFamily)
      ch.setAttribute('font-size', this._theme.fontSize)
      ch.setAttribute('font-weight', this._theme.fontWeight)
      ch.setAttribute('transform', translate(0, i*this._theme.fontSize*.7))
      g.appendChild(ch)
    }

    return g
  }
}

function translate(x, y) {
  return 'translate(' + x + ', ' + y + ')'
}
