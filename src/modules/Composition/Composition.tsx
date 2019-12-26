import React, { ReactNode } from 'react'

import Canvas from '../../components/Canvas'
import Engine from '../Engine'

interface IProps {
  engine: Engine;
  children?: ReactNode;
}

class Composition extends React.PureComponent<IProps> {

  onResize = (x: number, y: number, width: number, height: number) => {
    this.props.engine.resize(x, y, width, height)
  }

  onMouseUp = (event: MouseEvent) => {
    this.props.engine.mouseUp(event)
  }

  onMouseDown = (event: MouseEvent) => {
    this.props.engine.mouseDown(event)
  }

  onMouseMove = (event: MouseEvent) => {
    this.props.engine.mouseMove(event)
  }

  onWheel = (event: WheelEvent) => {
    this.props.engine.mouseWheel(event)
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const engine = this.props.engine

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // FIXME get from state

    const p = 10 * engine.viewport.z
    const xOffset = (engine.viewport.x1 * engine.viewport.z) % p
    const yOffset = (engine.viewport.y1 * engine.viewport.z) % p
    ctx.lineWidth = (engine.viewport.z / 3) + 0.2;

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

    // FIXME get from state
    engine.visible.forEach((element: any) => {
      element.draw(ctx, engine)
    })

    // FIXME do this better e.g. with a entity
    engine.selection.drawSelectedBox(ctx, engine)
    engine.selection.drawSelectionBox(ctx, engine)
  }

  render() {
    return (
      <React.Fragment>
        <Canvas
          name="composition"
          opaque={false}
          draw={this.draw}
          onResize={this.onResize}
          onMouseUp={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onWheel={this.onWheel}
        />
        {this.props.children}
      </React.Fragment>
    )
  }
}

export default Composition
