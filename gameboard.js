(function() {
  const gridSize = 30
  const canvas = document.getElementById('canvas01')

  const ctx = canvas.getContext('2d')

  class Board {

    drawBackground(point) {
      ctx.beginPath()
      const minY = 0
      const maxY = canvas.height
      const minX = 0
      const maxX = canvas.width
      ctx.strokeStyle = '#F5F5F5'

      for (let x = minX; x < maxX; x += gridSize) {
        ctx.moveTo(x, minY)
        ctx.lineTo(x, maxY)
        ctx.stroke()
      }
      for (let y = minY; y < maxY; y += gridSize) {
        ctx.moveTo(minX, y)
        ctx.lineTo(maxX, y)
        ctx.stroke()
      }
      ctx.closePath()

      ctx.beginPath()
      ctx.font = "20px fantasy"
      ctx.fillStyle = "#AAA"
      ctx.fillText("Point: " + point, 190, 30)
      //ctx.fillText(point, 110, 10)
      ctx.closePath()
    }
  }


  window.gameboard = {
    Board
  }

})()
