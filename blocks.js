(function() {
  const gridSize = 30
  const canvas = document.getElementById('canvas01')

  const ctx = canvas.getContext('2d')

  const row = canvas.height / gridSize
  const col = canvas.width / gridSize

  var Minos = [
    [
      [1, 1, 1, 1],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 1, 0]
    ],
    [
      [0, 1, 1, 0],
      [1, 1, 0, 0]
    ],
    [
      [1, 1, 0, 0],
      [0, 1, 1, 0]
    ],
    [
      [0, 0, 1, 0],
      [1, 1, 1, 0]
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 1, 0]
    ],
  ]

  class Block {
    constructor(col, row, cells, color) {
      this.col = col
      this.row = row
      this.cells = cells
      this.color = color
    }

    draw(ctx) {
      ctx.beginPath()
      ctx.fillStyle = this.color
      for (let cell of this.cells) {
        ctx.fillRect(
          (this.col + cell[0]) * gridSize,
          (this.row + cell[1]) * gridSize,
          1 * gridSize,
          1 * gridSize,
        )
      }
      ctx.closePath()
    }

    done(field) {
      for (let cell of this.cells) {
        let isTouchBottom = cell[1] + this.row + 1 >= row //(cell[1] + this.row + 1) * gridSize >= canvas.height
        if (isTouchBottom)
          return true

        let isTouchOther = true

        if(field[cell[1]+this.row+1][field[cell[0]+this.col]]==0){
          isTouchOther = false
        }

        /*
        let tmpHeight = (cell[1] + this.row + 1) * gridSize
        let pixelData = ctx.getImageData((cell[0] + this.col) * gridSize, tmpHeight, 1, 1).data

        if ((pixelData[0] == 245) && (pixelData[1] == 245) && (pixelData[2] == 245))
          isTouchOther = false

        for (let tmpH of this.cells) {
          if ((tmpH[0] == cell[0]) && (tmpH[1] != (cell[1])) && (tmpHeight == (tmpH[1] + this.row) * gridSize)) {
            isTouchOther = false
          }
        }
        */
        if (isTouchOther)
          return true

      }
      return false
    }

    getPosition() {
      let blockPosition = [
        [, ],
        [, ],
        [, ],
        [, ]
      ]
      let i = 0
      for (let cell of this.cells) {
        blockPosition[i][1] = [this.col + cell[0]]
        blockPosition[i][0] = [this.row + cell[1]]
        i++
      }
      //console.log(blockPosition)
      return blockPosition
    }

    gameOver() {
      for (let cell of this.cells) {
        let isTouchTop = (cell[1] + this.row) * gridSize <= gridSize
        if (isTouchTop) {
          console.log("Touch Top")
          return true
        }
      }
      return false
    }


    next(field) {
      if (this.done(field)) {
        return true
      }
      this.row += 1
      return false
    }
  }



  const BlockStickHorizontal = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0]
  ]

  const BlockStickVertical = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3]
  ]

  const vertical = 0
  const horizontal = 1

  class BlockStick extends Block {
    constructor({
      col,
      row,
      color
    } = {}) {
      let cells = BlockStickVertical
      let stateDir = vertical
      super(col, row, cells, color)
    }

    rotate() {
      if (this.stateDir == null)
        this.stateDir = vertical

      if (this.stateDir == vertical) {
        if (this.col * gridSize > canvas.width - gridSize * 4)
          this.col = (canvas.width - gridSize * 4) / gridSize
        this.cells = BlockStickHorizontal
      } else if (this.stateDir == horizontal) {
        this.cells = BlockStickVertical
      }
      this.stateDir++
      if (this.stateDir == 2)
        this.stateDir = vertical
    }

    canMoveLeft() {
      if (this.col > 0)
        return true
      return false
    }
    moveLeft() {
      this.col--
    }
    canMoveRight() {
      if (this.col * gridSize < (canvas.width - gridSize))
        return true
      return false
    }
    moveRight() {
      this.col++
    }
    canMoveDown() {
      if (this.row * gridSize < canvas.height - gridSize * 4)
        return true
      return false
    }
    moveDown() {
      this.row++
    }

    move(e) {
      switch (e.keyCode) {
        case 37: // <
          if (this.canMoveLeft())
            this.moveLeft()
          break
        case 39: // >
          if (this.canMoveRight())
            this.moveRight()
          break
          /*  case 40: // V
              if (this.canMoveDown())
                this.moveDown()
              break */
        default:
          break
      }
    }
  }



  const BlockMountainRight = [
    [0, 0],
    [0, 1],
    [1, 0],
    [0, -1]
  ]
  const BlockMountainLeft = [
    [0, 0],
    [-1, 0],
    [0, -1],
    [0, 1]
  ]
  const BlockMountainDown = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, 1]
  ]
  const BlockMountainUp = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1]
  ]

  const directionUp = 0
  const directionRight = 1
  const directionDown = 2
  const directionLeft = 3

  class BlockMountain extends Block {
    constructor({
      col,
      row,
      color
    } = {}) {
      let cells = BlockMountainUp // _1_
      let stateDir = directionUp
      super(col, row, cells, color)

    }

    rotate() {
      if (this.stateDir == null) {
        this.stateDir = directionUp
      }

      const nextCells = [BlockMountainRight, BlockMountainDown, BlockMountainLeft, BlockMountainUp]
      this.cells = nextCells[this.stateDir]
      if (this.stateDir == directionRight) {
        if (this.col == 0)
          this.col++
      } else if (this.stateDir == directionLeft) {
        if (this.col * gridSize == canvas.width - gridSize)
          this.col--
      }

      this.stateDir++
      if (this.stateDir == 4)
        this.stateDir = directionUp
    }

    canMoveRight() {
      if ((this.stateDir == directionLeft) && (this.col * gridSize < canvas.width - gridSize))
        return true
      if (this.col * gridSize < (canvas.width - gridSize * 2))
        return true
      return false
    }

    moveRight() {
      this.col++
    }

    move(e) {
      switch (e.keyCode) {
        case 37: // <
          if ((this.stateDir == directionRight) && (this.col > 0))
            this.col--
          else if (this.col > 1)
            this.col--
          break
        case 39: // >
          if (this.canMoveRight())
            this.moveRight()
          break
          /*    case 40: // V
                if (this.row * gridSize < canvas.height - gridSize * 2)
                  this.row++
                break*/
        default:
          break
      }
    }

  }



  const BlockSquareShape = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
  ]

  class BlockSquare extends Block {
    constructor({
      col,
      row,
      color
    } = {}) {
      let cells = BlockSquareShape
      super(col, row, cells, color)
    }

    rotate() {

    }

    canMoveLeft() {
      if (this.col > 0)
        return true
      return false
    }
    moveLeft() {
      this.col--
    }
    canMoveRight() {
      if (this.col * gridSize < (canvas.width - gridSize * 2))
        return true
      return false
    }
    moveRight() {
      this.col++
    }
    canMoveDown() {
      if (this.row * gridSize < canvas.height - gridSize * 2)
        return true
      return false
    }
    moveDown() {
      this.row++
    }

    move(e) {
      switch (e.keyCode) {
        case 37: // <
          if (this.canMoveLeft())
            this.moveLeft()
          break
        case 39: // >
          if (this.canMoveRight())
            this.moveRight()
          break
          /*      case 40: // V
                  if (this.canMoveDown())
                    this.moveDown()
                  break */
        default:
          break
      }
    }
  }

  window.blocks = {
    Block,
    BlockMountain,
    BlockStick,
    BlockSquare
  }

})()
