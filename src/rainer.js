import { createFetcher } from './fetcher'
import { defaultTheme, validateTheme } from './theme'

const xmlns = "http://www.w3.org/2000/svg"

export class Rainer {
  constructor({ sourceType, githubUsername, domElementId, theme, excludeFileTypes}) {
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
      excludeFileTypes,
      numLines: 50,
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

      const canvas = document.createElement('canvas')
      canvas.setAttribute('width', dim.width)
      canvas.setAttribute('height', dim.height)
      el.appendChild(canvas)
      const ctx = canvas.getContext('2d')

      const columnWidth = theme.fontSize * .6
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
}

class RenderColumn {
  constructor({ index, canvasCtx, lines, chars, theme, columnWidth, height }) {

    this._startDelay = timeNowSeconds() + Math.random() * 10

    const changesPerSecond = 20
    this._changeRate = 1 / changesPerSecond
    this._timeLastChange = 0

    this._durationSeconds = 5 + Math.random() * 15;

    this._height = height
    this._lines = lines
    this._chars = chars
    this._ctx = canvasCtx
    this._theme = theme
    this._x = index * columnWidth
    this.restart()
  }

  update(timeNow, elapsed) {

    if (timeNow < this._startDelay) {
      return
    }

    if (timeNow - this._timeLastChange > this._changeRate) {
      this._timeLastChange = timeNow;
      this._renderStopIndex++;
      if (this._renderStopIndex > this._text.length) {
        this._renderStopIndex = this._text.length
      }

      const renderLength = this._renderStopIndex - this._renderStartIndex;
      if (renderLength > this._renderLength) {
        this._renderStartIndex++;
      }
    }

    for (let i = this._renderStartIndex; i < this._renderStopIndex; i++) {
      const char = this._text[i]
      const y = this._y + (i * this._theme.fontSize * .8)
      this._ctx.fillText(char, this._x, y)
    }

    if (timeNow - this._startTime > this._durationSeconds) {
      this.restart()
    }
  }

  restart() {
    this._text = this._getRandomLineText()
    this._y = 0
    this._renderStartIndex = 0
    this._renderStopIndex = 0
    this._renderLength = Math.random() * this._text.length
    this._startTime = timeNowSeconds();
  }

  _getRandomLineText() {
    const numLines = this._lines.length
    const index = Math.floor(Math.random() * numLines)
    return this._lines[index].split('')
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
