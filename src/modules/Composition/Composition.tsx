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
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);

    const { gridSize, viewport, visible, selection } = this.props.engine

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const p = gridSize * viewport.z
    const xOffset = (viewport.x1 * viewport.z) % p
    const yOffset = (viewport.y1 * viewport.z) % p
    ctx.lineWidth = (viewport.z / 3) + 0.2;

    ctx.beginPath();
    for (let x = xOffset + 0.5; x <= ctx.canvas.width + p; x += p) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
    }
    for (let y = yOffset + 0.5; y <= ctx.canvas.height + p; y += p) {
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
    }
    ctx.strokeStyle = "#ccc";
    ctx.stroke();

    ctx.lineWidth = 1

    //const fontSize = 12 * 0.3 * viewport.z
    //ctx.font = `lighter ${fontSize}px Arial`

    visible.forEach((element: any) => {
      element.draw(ctx, timestamp)
    })

    selection.draw(ctx)

    // FPS and visible entities info

    ctx.font = "12px Arial";
    const w_t = ctx.measureText(`visible: ${visible.length}`).width + 10
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(5, 7, w_t, 50)
    ctx.strokeRect(5, 7, w_t, 50)
    ctx.fillStyle = "black";

    ctx.fillText(`visible: ${visible.length}`, 10, 22);
    ctx.fillText(`fps: ${times.length}`, 10, 42);

    // Mouse coordinates ribon

    ctx.beginPath();
    ctx.moveTo(this.props.engine.currentMouseCoordinates.x1, this.props.engine.currentMouseCoordinates.y1);
    ctx.lineTo(this.props.engine.currentMouseCoordinates.x2, this.props.engine.currentMouseCoordinates.y2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "purple";
    ctx.stroke();
  }

  render() {
    return (
      <React.Fragment>
        <Canvas
          name="composition"
          opaque={false}
          draw={this.draw}
          onResize={this.props.engine.resize}
          onMouseUp={this.props.engine.mouseUp}
          onMouseDown={this.props.engine.mouseDown}
          onMouseMove={this.props.engine.mouseMove}
          onWheel={this.props.engine.mouseWheel}
        />
        {this.props.children}
      </React.Fragment>
    )
  }
}

export default Composition
