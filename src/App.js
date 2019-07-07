import React from "react";
import logo from "./logo.svg";
import "./app.scss";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDown: false,
      isRecording: false,
      position: { x: 0, y: 0 }
    };
    this.fragments = [[]];
  }

  escFunction = event => {
    if (event.keyCode === 27) {
      this.fragments = [[]];
      this.draw();
    }
  };

  componentDidMount() {
    window.addEventListener("resize", this.resizeCanvas);
    document.addEventListener("keydown", this.escFunction, false);
    this.canvas = document.getElementById("canvas");
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext("2d");
      this.ctx.imageSmoothingEnabled = true;
      this.resizeCanvas();
      window.requestAnimationFrame(this.draw);
    } else {
      console.log("UNSUPPORTED");
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resizeCanvas);
    document.removeEventListener("keydown", this.escFunction, false);
  };

  handleMouseDown = e => {
    this.fragments.push([]);
    this.addPoint(e.clientX, e.clientY, 5);
    this.setState({ isDown: true, isRecording: true });
  };

  handleMouseUp = e => {
    window.requestAnimationFrame(this.draw);
    this.setState({ isDown: false, isRecording: false });
  };

  resizeCanvas = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.draw();
  };

  addPoint = (x, y, size) => {
    this.fragments[this.fragments.length - 1].push({ x, y });
    window.requestAnimationFrame(this.draw);
  };

  handleMove = e => {
    if (this.state.isDown) {
      const { ctx } = this;
      const x = e.clientX;
      const y = e.clientY;
      this.addPoint(x, y, 5);
    }
  };

  getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  draw = () => {
    const { ctx, canvas } = this;
    if (!ctx || !canvas) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = `rgb(${this.getRandomInt(255)},
                       ${this.getRandomInt(255)}, ${this.getRandomInt(255)})`;

    ctx.fillRect(0, 0, width, height);
    const fragments = this.fragments;
    fragments.forEach(f => {
      if (f.length) {
        ctx.lineWidth = this.getRandomInt(50);
        ctx.beginPath();
        ctx.moveTo(f[0].x, f[0].y);
        f.forEach((c, i) => {
          ctx.globalAlpha = Math.random();
          ctx.shadowColor = `rgb(${this.getRandomInt(255)},
                             ${this.getRandomInt(255)}, ${this.getRandomInt(
            255
          )})`;
          ctx.shadowBlur = this.getRandomInt(50);
          ctx.strokeStyle = `rgb(
              ${this.getRandomInt(255)},
              ${this.getRandomInt(255)},
              ${this.getRandomInt(255)})`;
          ctx.lineTo(c.x, c.y);
        });
        ctx.stroke();
        ctx.closePath();
      }
    });
  };

  render() {
    return (
      <div className="App">
        <canvas
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseMove={this.handleMove}
          id="canvas"
        />
      </div>
    );
  }
}
