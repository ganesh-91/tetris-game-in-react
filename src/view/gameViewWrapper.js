import React, { Component } from 'react';

class GameViewWrapper extends Component {
  constructor() {
    super();
    this.state = {
      score: 0,
      pause: false
    }
    this.matrix = [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ]
    this.lastTime = 0;
    this.dropCounter = 0;
    this.dropInterval = 1000;
    this.player = {
      pos: { x: 0, y: 0 },
      matrix: []
    }
    this.pause = false;
    this.arena = [];
    this.color = [
      null,
      "red",
      "brown",
      "blue",
      "green",
      "purple",
      "orange",
      "pink"
    ]
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <div>
          <span>Score : {this.state.score}</span>
        </div>
        <canvas ref="canvas" width={240} height={400} />
        <div>
          <div>
            <div className="display-inline-block">
              <div >
                <button onClick={() => {
                  if (!this.state.pause) {
                    this.playerMove(-1);
                  }
                }} className="button button-circle right">
                  &#8592;
                </button>
                <button onClick={() => {
                  if (!this.state.pause) {
                    this.playerMove(+1);
                  }
                }} className="button button-circle left">
                  &#8594;
                </button>
              </div>
              <div >
                <button onClick={() => {
                  if (!this.state.pause) {
                    this.playerDrop();
                  }
                }} className="button button-circle down">
                  &#8595;
                </button>
              </div>
            </div>
            <div className="display-inline-block margin-left-10">
              <div >
                <div className="display-inline-block">
                  <button onClick={() => {
                    this.setState({ pause: !this.state.pause }, () => {
                      if (!this.state.pause) {
                        this.update();
                      }
                    })
                  }} className="button button-circle pause">
                    P
                  </button>
                </div>
                <div className="display-inline-block">
                  <button onClick={() => {
                    this.resetPlayer();
                  }} className="button button-circle pause">
                    R
                  </button>
                </div>
              </div>
              <div >
                <button onClick={() => {
                  if (!this.state.pause) {
                    this.playerRotate(1);
                  }
                }} className="button button-circle padding-30">

                </button>
              </div>
            </div>
          </div>
          <p>Use &#8592;,&#8594;,&#8595; keys for movement.</p>
          <p> q, w for piece rotation.</p>
          <p>p for pausing the game and r for restart.</p>
        </div>
      </div >
    );
  }

  _handleKeyDown(e) {
    if (!this.state.pause) {
      switch (e.keyCode) {
        case 37:
          this.playerMove(-1);
          break;
        case 39:
          this.playerMove(+1);
          break;
        case 40:
          this.playerDrop();
          break;
        case 81:
          this.playerRotate(-1);
          break;
        case 87:
          this.playerRotate(1);
          break;
        case 82:
          this.resetPlayer();
          break;
        default:
          break;
      }
    }
    if (e.keyCode === 80) {
      this.setState({ pause: !this.state.pause }, () => {
        if (!this.state.pause) {
          this.update();
        }
      });
    }
  }

  componentWillMount() {
    document.addEventListener("keydown", (e) => {
      this._handleKeyDown(e);
    });
  }

  componentDidMount() {
    const context = this.refs.canvas.getContext('2d');
    context.scale(10, 10);

    this.arena = this.createMatrix(24, 40);
    this.player.matrix = this.createPiece("T");
    this.update();
  }

  arenaSweep() {
    let rowCount = 1;
    outer: for (let y = this.arena.length - 1; y > 0; --y) {
      for (let x = 0; x < this.arena[y].length; ++x) {
        if (this.arena[y][x] === 0) {
          continue outer;
        }
      }

      const row = this.arena.splice(y, 1)[0].fill(0);
      this.arena.unshift(row);
      ++y;
      this.setState({ score: this.state.score + (rowCount * 10) });
      // this.state.score += rowCount * 10;
      rowCount *= 2;
    }
  }

  collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
          return true;
        }
      }
    }
  }

  collisionDetect() {
    if (this.collide(this.arena, this.player)) {
      this.player.pos.y -= 1;
      this.merge(this.arena, this.player);
      this.resetPlayer();
      this.arenaSweep();
      // this.player.pos.y = 0;
    }
  }

  createMatrix(w, h) {
    const matrix = [];
    while (h--) {
      matrix.push(new Array(w).fill(0));
    }
    return matrix;
  }

  createPiece(type) {
    if (type === 'I') {
      return [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ];
    } else if (type === 'L') {
      return [
        [0, 2, 0],
        [0, 2, 0],
        [0, 2, 2],
      ];
    } else if (type === 'J') {
      return [
        [0, 3, 0],
        [0, 3, 0],
        [3, 3, 0],
      ];
    } else if (type === 'O') {
      return [
        [4, 4],
        [4, 4],
      ];
    } else if (type === 'Z') {
      return [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0],
      ];
    } else if (type === 'S') {
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0],
      ];
    } else if (type === 'T') {
      return [
        [0, 7, 0],
        [7, 7, 7],
        [0, 0, 0],
      ];
    }
  }

  draw() {
    const context = this.refs.canvas.getContext('2d');
    context.fillStyle = "#000";
    context.fillRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    this.drawMatrix(this.arena, { x: 0, y: 0 });
    this.drawMatrix(this.player.matrix, this.player.pos);
  }

  drawMatrix(matrix, offset) {
    const context = this.refs.canvas.getContext('2d');
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = this.color[value];
          context.fillRect(x + offset.x,
            y + offset.y,
            1, 1);
        }
      });
    });
  }

  playerDrop() {
    this.player.pos.y += 1;
    this.collisionDetect();
    this.dropCounter = 0;
  }

  playerMove(move) {
    this.player.pos.x += move;
    if (this.collide(this.arena, this.player)) {
      this.player.pos.x -= move;
    }
  }

  playerRotate(dir) {
    const pos = this.player.pos.x;
    let offset = 1;
    this.rotate(this.player.matrix, dir);
    while (this.collide(this.arena, this.player)) {
      this.player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1))
      if (offset > this.player.matrix[0].length) {
        this.rotate(this.player.matrix, -dir);
        this.player.pos.x = pos;
        return;
      }
    }
  }

  merge(arena, player) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          console.table(arena);
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      })
    })
  }

  update(time = 0) {

    if (!this.state.pause) {
      const deltaTime = time - this.lastTime;
      this.lastTime = time;
      this.dropCounter = this.dropCounter + deltaTime;
      if (this.dropCounter > this.dropInterval) {
        this.player.pos.y += 1;
        this.dropCounter = 0;
        this.collisionDetect();
      }

      this.draw();
      requestAnimationFrame(this.update.bind(this));
    }

  }

  rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < y; x++) {
        [
          matrix[x][y],
          matrix[y][x]
        ] = [
            matrix[y][x],
            matrix[x][y]
          ]
      }
    }
    if (dir > 0) {
      matrix = matrix.forEach((row) => { row.reverse(); })
    } else {
      matrix.reverse();
    }
  }
  resetPlayer() {
    const piece = "LSOTIZJ";
    this.player.matrix = this.createPiece(piece[piece.length * Math.random() | 0]);
    this.player.pos.y = 0;
    this.player.pos.x = (this.arena[0].length / 2 | 0) * (this.player.matrix[0] / 2 | 0);
    if (this.collide(this.arena, this.player)) {
      this.arena.forEach((row) => {
        row.fill(0);
      });
    }
  }

}

export default GameViewWrapper;