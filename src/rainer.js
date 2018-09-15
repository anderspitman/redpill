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

      const allChars = []
      for (const line of lines) {
        for (const ch of line) {
          allChars.push(ch)
        }
      }
      console.log(allChars)

      //const svg = document.createElementNS(xmlns, 'svg')
      //svg.setAttribute('width', dim.width + 'px')
      //svg.setAttribute('height', dim.height + 'px')
      //el.appendChild(svg)

      //const background = document.createElementNS(xmlns, 'rect')
      //background.setAttribute('width', dim.width)
      //background.setAttribute('height', dim.height)
      //background.setAttribute('fill', theme.backgroundColor)
      //svg.appendChild(background)

      const canvas = document.createElement('canvas')
      canvas.setAttribute('width', dim.width)
      canvas.setAttribute('height', dim.height)
      el.appendChild(canvas)
      const ctx = canvas.getContext('2d')

      const columnWidth = theme.fontSize * .7
      const numColumns = dim.width / columnWidth

      this._el = el
      //this._svg = svg
      this._lines = lines
      this._chars = allChars
      this._theme = theme
      this._columnWidth = columnWidth
      this._numColumns = numColumns
      this._ctx = ctx
      this._dim = dim

      this.animate()
    })
    .catch((err) => {
      console.error(err)
    })
  }

  animate() {
    let columns = [];
    for (let col = 0; col < this._numColumns; col++) {
      columns.push(new RenderColumn({
        index: col,
        canvasCtx: this._ctx,
        lines: this._lines,
        chars: this._chars,
        theme: this._theme,
        columnWidth: this._columnWidth,
        height: this._dim.height,
      }))
    }

    this._ctx.textBaseline = 'middle'

    let elapsed = 0
    let timeLastFrame = timeNowSeconds()

    const update = () => {

      const startTime = timeNowSeconds()
      elapsed = startTime - timeLastFrame
      timeLastFrame = startTime

      this._ctx.fillStyle = this._theme.backgroundColor
      this._ctx.fillRect(0, 0, this._dim.width, this._dim.height)

      this._ctx.font = this._theme.fontWeight + ' ' + this._theme.fontSize + 'px ' + this._theme.fontFamily
      this._ctx.fillStyle = this._theme.fontColor

      for (const col of columns) {
        col.update(startTime, elapsed)
      }

      const endTime = timeNowSeconds()

      //console.log(`Render time: ${endTime - startTime}`)

      requestAnimationFrame(update)
    }

    update()
  }

  //animate() {
  //  for (let col = 0; col < this._numColumns; col++) {
  //  //for (let col = 0; col < 1; col++) {
  //    this._animateColumn(col)
  //  }
  //}

  //_animateColumn(columnIndex) {
  //  const text = this._getRandomLineText()
  //  const line = this._createLine(text)
  //  this._svg.appendChild(line)

  //  const x = columnIndex * this._columnWidth
  //  let y = 0

  //  setInterval(() => {
  //    y += 10
  //    requestAnimationFrame(() => { line.setAttribute('transform', translate(x, y) )})
  //  }, 100)
  //}

  //_getRandomLineText() {
  //  const numLines = this._lines.length
  //  const index = Math.floor(Math.random() * numLines)
  //  return this._lines[index]
  //}

  //_createLine(text) {
  //  const g = document.createElementNS(xmlns, 'g')
  //  g.setAttribute('transform', translate(0, 0))

  //  for (let i = 0; i < text.length; i++) {
  //    const char = text[i]
  //    const ch = document.createElementNS(xmlns, 'text')
  //    ch.textContent = char
  //    ch.setAttribute('fill', this._theme.fontColor)
  //    ch.setAttribute('font-family', this._theme.fontFamily)
  //    ch.setAttribute('font-size', this._theme.fontSize)
  //    ch.setAttribute('font-weight', this._theme.fontWeight)
  //    ch.setAttribute('transform', translate(0, i*this._theme.fontSize*.7))
  //    g.appendChild(ch)
  //  }

  //  return g
  //}
}

class RenderColumn {
  constructor({ index, canvasCtx, lines, chars, theme, columnWidth, height }) {

    this._startTime = timeNowSeconds() + Math.random() * 10

    this._fallRate = 8 + (Math.random() * 2)
    const changesPerSecond = 15
    this._changeRate = 1 / changesPerSecond
    this._timeLastChange = 0

    this._height = height
    this._lines = lines
    this._chars = chars
    this._ctx = canvasCtx
    this._theme = theme
    this._x = index * columnWidth
    this.restart()
  }

  update(timeNow, elapsed) {

    if (timeNow < this._startTime) {
      return
    }

    if (timeNow - this._timeLastChange > this._changeRate) {
      this._timeLastChange = timeNow
      this._text = this._text.slice(0, this._text.length - 1) + this._getRandomChar()
    }

    for (let i = 0; i < this._text.length; i++) {
      const char = this._text[i]
      const y = this._y + (i * this._theme.fontSize * .8)
      this._ctx.fillText(char, this._x, y)
      //console.log("here")
    }

    this._y += this._fallRate

    if (this._y > this._height) {
      this.restart()
    }
  }

  restart() {
    this._text = this._getRandomLineText()
    this._y = -1500
  }

  _getRandomLineText() {
    const numLines = this._lines.length
    const index = Math.floor(Math.random() * numLines)
    return this._lines[index]
  }

  _getRandomChar() {
    const numChars = this._chars.length
    const index = Math.floor(Math.random() * numChars)
    return this._chars[index]
  }
}

function translate(x, y) {
  return 'translate(' + x + ', ' + y + ')'
}

function timeNowSeconds() {
  return performance.now() / 1000
}
