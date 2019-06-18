(function() {
    const gridSize = 30
    const canvas = document.getElementById('canvas01')

    const ctx = canvas.getContext('2d')

    const Board = window.gameboard.Board

    const Block = window.blocks.Block
    const BlockStick = window.blocks.BlockStick
    const BlockMountain = window.blocks.BlockMountain
    const BlockSquare = window.blocks.BlockSquare

    let runningID = 0

    const startBtn = document.getElementById("gameStartBtn")
    const stopBtn = document.getElementById("gameStopBtn")

    startBtn.onclick = function() {
      gameRunning()
      startBtn.disable = true
      stopBtn.disable = false
    }

    stopBtn.onclick = function() {
      clearInterval(runningID)
      startBtn.disable = false
      stopBtn.disable = true
      runningID = 0
    }


    let point = 0
/*
    function drawBackground() {
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
*/

    function isBgColor(pixelData) {
      let red = pixelData[0]
      let green = pixelData[1]
      let blue = pixelData[2]
      let beckgroundRed = 245
      let beckgroundGreen = 245
      let beckgroundBlue = 245

      let isSameColor =  ((red == beckgroundRed) && (green == beckgroundGreen) && (blue == beckgroundBlue))

      return isSameColor
    }

      function isLineExist() {
        const minY = 0
        const maxY = canvas.height
        const minX = 0
        const maxX = canvas.width

        function countEmptyBlocks(y){
          let emptyBlocks = 0
          for (let x = minX; x < maxX; x += gridSize) {
            let pixelData = ctx.getImageData(x, y, 1, 1).data

            if (isBgColor(pixelData)) {
              emptyBlocks++
            }
          }
          return emptyBlocks
        }

        for (let y = minY; y < maxY; y += gridSize) {
          let emptyBlocks = countEmptyBlocks(y)

          if (emptyBlocks == 0) {
            console.log("Line:", y)
            return true
          }
        }
        return false
      }

        // Speed
        const tickTime = 300

        let randomColor = Math.random() * 360

        let dropping = false
        let blockDrop = null
        let blocksArray = []

        function drawExistingBlocks() {
          for (let block of blocksArray) {
            block.draw(ctx)
          }
        }

        function drawGameOver() {
          ctx.beginPath()
          ctx.font = "48px fantasy"
          ctx.fillStyle = "blue"
          ctx.fillText("Game Over!", 5, 200)
          ctx.closePath()
        }

        function gameRunning() {
          let intervalID = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            if (runningID == 0)
              runningID = intervalID

            new Board().drawBackground(point)
            drawExistingBlocks()

            if (!dropping) { // Create new block
              randomColor = Math.random() * 360
              let tmp = new newBlocks()
              blockDrop = tmp.newBlock()
              dropping = true // Start dropping
            } else { // Block is dropping
              blockDrop.draw(ctx)
              if (blockDrop.next()) { // If block touched bottom
                blocksArray.push(blockDrop)
                dropping = false // Stop the block from dropping

                if (isLineExist()) {
                  point = point + 10
                }

                if (blockDrop.gameOver()) {
                  clearInterval(intervalID)
                  drawGameOver()
                }
              }
            }

          }, tickTime)
        }

        canvas.addEventListener("click", () => {
          blockDrop.rotate()
        })
        window.addEventListener("keydown", (e) => {
          blockDrop.move(e)
        }, false)



        class newBlocks {

          newBlock() {
            let x = Math.random() * 10 + 1
            let block01 = null

            if (x <= 3) {
              block01 = new BlockStick({
                col: 2,
                row: 0,
                color: "hsl(" + randomColor + ",50%,50%)"
              })

            } else if (x <= 6) {
              block01 = new BlockSquare({
                col: 4,
                row: 0,
                color: "hsl(" + randomColor + ",50%,50%)"
              })

            } else {
              block01 = new BlockMountain({
                col: 6,
                row: 0,
                color: "hsl(" + randomColor + ",50%,50%)"
              })
            }
            return block01
          }

        }

    })()
