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

    // FIXME fill clear degrades fps greartly introduce dirty regions

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const p = gridSize * viewport.z
    const xOffset = ((viewport.x1 * viewport.z) % p) + 0.5
    const yOffset = ((viewport.y1 * viewport.z) % p) + 0.5

    ctx.lineWidth = (viewport.z / 3) + 0.2;

    ctx.beginPath();
    let x = xOffset + 0.5
    let y = yOffset + 0.5

    while (x < ctx.canvas.width) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      x+=p
    }
    while (y < ctx.canvas.height) {
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      y+=p
    }

    ctx.strokeStyle = "#eee";
    ctx.stroke();

    ctx.lineWidth = 1

    // FIXME transformation on canvas
    ctx.setTransform(viewport.z, 0, 0, viewport.z, viewport.x1 * viewport.z, viewport.y1 * viewport.z)

    let layer = 0
    while (layer++ < 4) {
      elements.forEach((element) => {
        element.draw(layer, engineMode, ctx, viewport, gridSize, timestamp)
      })
    }

    // FIXME this second transformation degrades FPS greatly
    // FIXME introduce dirty regions
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    const lines = [
      `mode: ${engineMode}`,
      `fps: ${times.length}`,
    ]

    ctx.font = "12px Arial";
    const w_t = lines.reduce((result, current) => Math.max(result, ctx.measureText(current).width), 0) + 10

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(5, 7, w_t, 6 + (16 * lines.length - 1))
    ctx.strokeRect(5, 7, w_t, 6 + (16 * lines.length - 1))
    ctx.fillStyle = "black";

    lines.forEach((line, idx) => {
      ctx.fillText(line, 10, 22 + (16 * idx));
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
