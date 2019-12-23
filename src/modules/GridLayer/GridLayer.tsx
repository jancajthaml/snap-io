import React from 'react'

import Canvas from '../../components/Canvas'
import Engine from '../Engine'

interface IProps {
  engine: Engine;
}

class GridLayer extends React.PureComponent<IProps> {

  draw = (ctx: CanvasRenderingContext2D) => {
    const engine = this.props.engine
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const p = 10 * engine.scale
    const xOffset = (engine.viewport.x1 * engine.scale) % p
    const yOffset = (engine.viewport.y1 * engine.scale) % p
    ctx.lineWidth = (engine.scale / 3) + 0.2;

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
  }

  render() {
    return (
      <Canvas
        name="grid"
        opaque={false}
        draw={this.draw}
      />
    )
  }
}

export default GridLayer
