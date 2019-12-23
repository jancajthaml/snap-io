import React from 'react'

import Canvas from '../../components/Canvas'
import Engine from '../Engine'

interface IProps {
  engine: Engine;
}

class ElementsLayer extends React.PureComponent<IProps> {

  draw = (ctx: CanvasRenderingContext2D) => {
    const engine = this.props.engine
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    engine.elements.forEachVisible((element: any) => {
      element.draw(ctx, engine)
    })
    engine.selection.drawSelectedBox(ctx, engine)

  }

  render() {
    return (
      <Canvas
        name="elements"
        opaque={true}
        draw={this.draw}
      />
    )
  }
}

export default ElementsLayer
