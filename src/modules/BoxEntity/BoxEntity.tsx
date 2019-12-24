import React from 'react'

//import Canvas from '../../components/Canvas'
import Engine from '../Engine'
//import Rectangle from '../../atoms/Rectangle'

interface IProps {
  engine: Engine;
  selected?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

class BoxEntity extends React.PureComponent<IProps> {

  componentDidMount() {
    console.log('BoxEntity unmount - register to engine')
    this.props.engine.addEntity(this)
  }

  componentWillUnmount() {
    console.log('BoxEntity unmount - deregister from engine')
    this.props.engine.removeEntity(this)
  }

  draw = (ctx: CanvasRenderingContext2D) => {
    const engine = this.props.engine

    if (this.props.selected) {
      ctx.fillStyle = "black"
    } else {
      ctx.fillStyle = this.props.color
    }
    const x = (engine.viewport.x1 + this.props.x) * engine.scale
    const y = (engine.viewport.y1 + this.props.y) * engine.scale
    const w = this.props.width * engine.scale
    const h = this.props.height * engine.scale

    ctx.fillRect(x, y, w, h);
  }

  render() {
    return <React.Fragment />
  }
}

export default BoxEntity
