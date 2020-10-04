import React, { ReactNode } from 'react'

import Canvas from '../../components/Canvas'
import Engine from '../Engine'

interface IProps {
  engine: Engine;
  children?: ReactNode;
}

let times: number[] = []

class Composition extends React.PureComponent<IProps> {

  draw = (ctx: CanvasRenderingContext2D, timestamp: number) => {
    // FIXME check if engine is in sync if not, skip this frame

    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);

    const { gridSize, viewport, elements, engineMode } = this.props.engine

    const pixelRatio = window.devicePixelRatio * viewport.z;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, (viewport.x1 * pixelRatio), viewport.y1 * pixelRatio)

    const x1 = -viewport.x1
    const y1 = -viewport.y1
    const width = ctx.canvas.width / viewport.z
    const height = ctx.canvas.height / viewport.z

    ctx.fillStyle = "white";
    ctx.fillRect(x1, y1, width, height);

    const xOffset = x1 % gridSize
    const yOffset = y1 % gridSize

    ctx.lineWidth = ((viewport.z / 3) + 0.2) / viewport.z;

    ctx.beginPath();
    let x = 0.5 -xOffset
    let y = 0.5 -yOffset

    while (x < width) {
      ctx.moveTo(x1 + x, y1);
      ctx.lineTo(x1 + x, y1 + height);
      x += gridSize
    }
    while (y < height) {
      ctx.moveTo(x1, y1 + y);
      ctx.lineTo(x1 + width, y1 + y);
      y += gridSize
    }

    ctx.strokeStyle = "#eee";
    ctx.stroke();

    // FIXME transformation on canvas

    ctx.lineWidth = 1
    let layer = 0
    while (layer++ < 4) {
      elements.forEach((element) => {
        element.draw(layer, engineMode, ctx, viewport, gridSize, timestamp)
      })
    }

    // FIXME this second transformation degrades FPS greatly
    // FIXME introduce dirty regions

    const lines = [
      `mode: ${engineMode}`,
      `fps: ${times.length}`,
    ]

    ctx.font = `${12 / viewport.z}px Arial`;
    const w_t = (lines.reduce((result, current) => Math.max(result, ctx.measureText(current).width), 0) + 10 / viewport.z)

    ctx.lineWidth = 1 / viewport.z
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(x1 + 5 / viewport.z, y1 + 7 / viewport.z, w_t, (6 + (16 * lines.length - 1)) / viewport.z)
    ctx.strokeRect(x1 + 5 / viewport.z, y1 + 7 / viewport.z, w_t, (6 + (16 * lines.length - 1)) / viewport.z)
    ctx.fillStyle = "black";

    lines.forEach((line, idx) => {
      ctx.fillText(line, x1 + 10 / viewport.z, y1 + (22 + (16 * idx)) / viewport.z);
    })
  }

  render() {
    return (
      <React.Fragment>
        <Canvas
          draw={this.draw}
          onResize={this.props.engine.resize}
          onKeyUp={this.props.engine.keyUp}
          onKeyDown={this.props.engine.keyDown}
          onMouseUp={this.props.engine.mouseUp}
          onMouseDown={this.props.engine.mouseDown}
          onMouseMove={this.props.engine.mouseMove}
          onDoubleClick={this.props.engine.doubleClick}
          onWheel={this.props.engine.mouseWheel}
        />
        {this.props.children}
      </React.Fragment>
    )
  }
}

export default Composition
