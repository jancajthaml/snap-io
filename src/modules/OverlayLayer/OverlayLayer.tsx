import React from 'react'

import Canvas from '../../components/Canvas'
import Engine from '../Engine'

interface IProps {
  engine: Engine;
}

class OverlayLayer extends React.PureComponent<IProps> {

  draw = (ctx: CanvasRenderingContext2D) => {
    const engine = this.props.engine
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    engine.selection.drawSelectionBox(ctx, engine)
  }

  render() {
    return (
      <Canvas
        name="selection"
        opaque={true}
        draw={this.draw}
      />
    )
  }
}

export default OverlayLayer
