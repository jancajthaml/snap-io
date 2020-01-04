import React from 'react'

import Engine from '../../modules/Engine'
import Point from '../../atoms/Point'
import Rectangle from '../../atoms/Rectangle'
import { IEntitySchema } from './types'

interface IProps extends IEntitySchema {
  engine: Engine;
}

interface IState {
  selected: boolean;
}

class TextEntity extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      selected: false,
    }
  }

  componentDidMount() {
    this.props.engine.addEntity(this)
  }

  componentWillUnmount() {
    this.props.engine.removeEntity(this)
  }

  mouseDownCapture = (point: Point): boolean => {
    return point.x >= this.props.x && point.x <= (this.props.x + this.props.width) && point.y >= this.props.y && point.y <= (this.props.y + this.props.height);
  }

  drawDetail = (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number) => {
    if (this.state.selected) {
      ctx.fillStyle = "black"
    } else {
      ctx.fillStyle = "orange"
    }

    const x = (viewport.x1 + Math.round(this.props.x) * gridSize) * viewport.z
    const y = (viewport.y1 + Math.round(this.props.y) * gridSize) * viewport.z
    const w = Math.round(this.props.width) * gridSize * viewport.z
    const h = Math.round(this.props.height) * gridSize * viewport.z

    ctx.fillRect(x, y, w, h);

    const fontSize = 12 * 0.3 * viewport.z
    ctx.font = `lighter ${fontSize}px Arial`

    if (this.state.selected) {
      ctx.fillStyle = "white"
    } else {
      ctx.fillStyle = "black"
    }

    let textPadding = 0.2 * fontSize
    let textW = w - (2*textPadding)
    let textY = y + fontSize
    let textH = textY + h - (2*textPadding) - fontSize
    let textX = x + textPadding
    let textHeight = ctx.measureText('m').width * 0.75 + fontSize * 0.25

    this.props.text.split("\n").forEach((line) => {
      const words = line.split(' ');
      let printLine = ''

      for (let n = 0; n < words.length; n++) {
        const testLine = `${printLine}${words[n]} `;
        var testWidth = ctx.measureText(testLine).width;
        if (testWidth >= textW && n > 0) {
          if (textY <= textH) {
            ctx.fillText(printLine, textX, textY);
          }
          printLine = `${words[n]} `;
          textY += textHeight;
        } else {
          printLine = testLine;
        }
      }
      if (textY <= textH) {
        ctx.fillText(printLine, textX, textY);
      }
      textY += textHeight;
    })
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const { viewport, gridSize } = this.props.engine

    this.drawDetail(ctx, viewport, gridSize)
  }

  serialize = () => ({
    id: this.props.id,
    type: this.props.type,
    text: this.props.text,
    x: Math.round(this.props.x),
    y: Math.round(this.props.y),
    width: Math.round(this.props.width),
    height: Math.round(this.props.height),
  })

  render() {
    return <React.Fragment />
  }
}

export default TextEntity
