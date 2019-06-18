(function() {

  const gridSize = 30
  const canvas = document.getElementById('canvas01')

  const ctx = canvas.getContext('2d')

  let detectedLine = 0

  class LineDetector {
    constructor() {
      this.minY = 0
      this.maxY = canvas.height
      this.minX = 0
      this.maxX = canvas.width
    }
    isBgColor(pixelData) {
      let red = pixelData[0]
      let green = pixelData[1]
      let blue = pixelData[2]
      let beckgroundRed = 245
      let beckgroundGreen = 245
      let beckgroundBlue = 245

      let isSameColor = ((red == beckgroundRed) && (green == beckgroundGreen) && (blue == beckgroundBlue))

      return isSameColor
    }

    countEmptyBlocks(y) {
      let emptyBlocks = 0
      for (let x = this.minX; x < this.maxX; x += gridSize) {
        let pixelData = ctx.getImageData(x, y, 1, 1).data

        if (this.isBgColor(pixelData)) {
          emptyBlocks++
        }
      }
      return emptyBlocks
    }

    isLineExist(field) {
      for (let y = 0; y < field.length; y++) {
        let isLine = true
        //let emptyBlocks = this.countEmptyBlocks(y)
        for (let x = 0; x < field[y].length; x++) {
          if (field[y][x] == 0) {
            isLine = false
            break
          }
        }
        /*if (emptyBlocks == 0) {
          //console.log("Line:", y)
          detectedLine = y
          return true
        }*/
        if (isLine) {
          console.log(y, field[y])
          detectedLine = y
          return true
        }
      }
      return false
    }

    getDetectedLine() {
      console.log("Detected Line:", detectedLine)
      return detectedLine
    }
  }


  window.gameControl = {
    LineDetector
  }

})()
