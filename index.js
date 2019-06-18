(function() {
  const gridSize = 30
  const canvas = document.getElementById('canvas01')

  const ctx = canvas.getContext('2d')

  const Board = window.gameboard.Board

  const LineDetector = window.gameControl.LineDetector

  const Block = window.blocks.Block
  const BlockStick = window.blocks.BlockStick
  const BlockMountain = window.blocks.BlockMountain
  const BlockSquare = window.blocks.BlockSquare

  const row = canvas.height/gridSize
  const col = canvas.width/gridSize
  let field = []

  for(let y = 0; y < row; y++){
    field[y] = []
    for (let x = 0; x < col; x++){
      field[y][x] = 0
    }
  }

  let runningID = 0

  const lineDetector = new LineDetector()
  const board = new Board()

  // Button & Mouse Event
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

  canvas.addEventListener("click", () => {
    blockDrop.rotate()
  })

  window.addEventListener("keydown", (e) => {
    blockDrop.move(e)
  }, false)


  let point = 0

  // Speed
  const tickTime = 300

  let randomColor = Math.random() * 360

  let dropping = false
  let blockDrop = null
  let blocksArray = []
  let fieldArray = []

  function drawExistingBlocks() {
    for (let block of blocksArray) {
      //console.log(block.color)
      for(let cell of block.cells){
        if(field[block.row + cell[1]][block.col + cell[0]]== 0){
          cell[0] = 0
          cell[1] = 0
        }
      }
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

  function fillField(){
    for (let x of fieldArray){
      field[x[0]][x[1]]=1
    }
    //console.log(field)
  }

  function gameRunning() {
    let intervalID = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (runningID == 0)
        runningID = intervalID

      board.drawBackground(point)
      drawExistingBlocks()

      if (!dropping) { // Create new block
        randomColor = Math.random() * 360
        let tmp = new NewBlock()
        blockDrop = tmp.newBlock()
        dropping = true // Start dropping
      } else { // Block is dropping
        blockDrop.draw(ctx)
        if (blockDrop.next(field)) { // If block touched bottom
          blocksArray.push(blockDrop)
          dropping = false // Stop the block from dropping
          fieldArray = blockDrop.getPosition()
          fillField()
          if (lineDetector.isLineExist(field)) {
            point = point + 10
            field[lineDetector.getDetectedLine()].fill(0)
            console.log("Line!!",field[lineDetector.getDetectedLine()])
          }

          if (blockDrop.gameOver()) {
            clearInterval(intervalID)
            drawGameOver()
          }
        }
      }

    }, tickTime)
  }


  class NewBlock {
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
