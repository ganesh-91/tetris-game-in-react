import React, { Component } from 'react';

class GameViewWrapper extends Component {
  constructor() {
    super();
    this.matrix = [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ]
    this.state = {
      x: 5,
      y: 5,
      player: {
        pos: { x: 5, y: 5 },
        matrix: this.matrix
      },
      lastTime: 0,
      dropCounter: 0,
      dropInterval: 1000,
      arena: null
    };
    this.updateCanvas = this.updateCanvas.bind(this);
  }

  render() {
    return (
      <div>
        {/* <input value={this.state.player.pos.x} onChange={(e) => { this.updateState(e); }} /> */}
        <canvas ref="canvas" width={240} height={400} />
      </div>
    );
  }
  // updateState(e) {
  //   let newState = Object.assign({}, this.state.player)
  //   newState.pos.x = parseInt(e.target.value);
  //   this.setState({ player: newState }, () => {
  //     this.state.player;
  //   });
  // }
  componentDidMount() {
    const context = this.refs.canvas.getContext('2d');
    context.scale(20, 20);
    this.updateCanvas();
    this.updateArena();
  }

  updateArena() {
    // let arena = this.createMatrix(12, 20);
    this.setState({ arena: this.createMatrix(12, 20) });
  }

  collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 &&
          (arena[y + o.y] &&
            arena[y + o.y][x + o.x]) !== 0) {
          debugger;
          arena
          return true;
        }
      }
    }
    return false;
  }

  componentWillMount() {
    let keydown;
    document.addEventListener("keydown", (e) => {
      if (!keydown) {
        keydown = true;
        this._handleKeyDown(e);
      }
      window.addEventListener('keyup', function () {
        keydown = false;
      });

    });
  }

  createMatrix(w, h) {
    const matrix = [];
    while (h--) {
      matrix.push(new Array(w).fill(0));
    }
    return matrix;
  }

  draw() {
    const context = this.refs.canvas.getContext('2d');
    context.fillStyle = "#000";
    context.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    this.drawMatrix(this.state.player.matrix, this.state.player.pos);
  }

  drawMatrix(matrix, offSet) {
    const context = this.refs.canvas.getContext('2d');
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = "#fff";
          context.fillRect(
            x + offSet.x,
            y + offSet.y,
            1, 1);
        }
      });
    });
  }

  mergeArena(player) {
    let { arena } = Object.assign({}, this.state);

    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          debugger;
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
    this.setState({ arena });
  }

  playerDrop() {
    let newState = Object.assign({}, this.state);
    newState.player.pos.y += 1;
    newState.dropCounter = 0;
    newState.player.pos.y++;
    if (this.collide(newState.arena, newState.player)) {
      newState.player.pos.y--;
      this.mergeArena(newState.player);
      newState.player.pos.y = 0;
    }
    newState.dropCounter = 0;
    this.setState({ newState }, () => {
      console.log(this.state);
    });
  }

  _handleKeyDown(e) {
    let newState = Object.assign({}, this.state);
    switch (e.keyCode) {
      case 37:
        newState.player.pos.x -= 1;
        break;
      case 38:
        // newState.player.pos.y -= 1;
        break;
      case 39:
        newState.player.pos.x += 1;
        break;
      case 40:
        this.playerDrop();
        break;
      default:
        break;
    }
    this.setState({ newState });
  }

  updateCanvas(time = 0) {
    const { dropCounter, dropInterval } = this.state;

    const deltaTime = time - this.state.lastTime;
    // console.log(deltaTime);
    this.setState({ lastTime: time });
    this.setState({ dropCounter: this.state.dropCounter + deltaTime });
    if (dropCounter > dropInterval) {
      let newState = Object.assign({}, this.state.player);
      newState.pos.y += 1;
      this.setState({ player: newState, dropCounter: 0 });
    }
    this.draw();
    requestAnimationFrame(this.updateCanvas);
  }
}

export default GameViewWrapper;
