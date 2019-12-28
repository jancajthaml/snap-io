import React, { ReactNode } from 'react'

import Canvas from '../../components/Canvas'
import Engine from '../Engine'

interface IProps {
  engine: Engine;
  children?: ReactNode;
}

class Composition extends React.PureComponent<IProps> {

  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, visible, selection } = this.props.engine

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const p = 10 * viewport.z
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

    visible.forEach((element: any) => {
      element.draw(ctx)
    })

    selection.draw(ctx)
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
