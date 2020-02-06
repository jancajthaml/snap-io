import React, { ReactNode } from 'react'
import { connect } from 'react-redux'

import { IRootReduxState } from '../../reducer'

import { Rectangle } from '../../atoms'
import Canvas from '../../components/Canvas'
import Engine from '../Engine'
import { getViewport } from '../Diagram/selectors'

interface IProps {
  engine: Engine;
  viewport: Rectangle;
  children?: ReactNode;
}

//let times: number[] = []

class Composition extends React.PureComponent<IProps> {

  /*
  draw = (ctx: CanvasRenderingContext2D, timestamp: number) => {
    // FIXME check if engine is in sync if not, skip this frame

    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);

    const { gridSize, viewport, elements, engineMode } = this.props.engine

    ctx.setTransform(viewport.z, 0, 0, viewport.z, viewport.x1 * viewport.z, viewport.y1 * viewport.z)

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

    //ctx.lineWidth = ((viewport.z / 2) + 0.5) / viewport.z;
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
  */

  render() {
    return (
      <React.Fragment>
        <Canvas
          viewport={this.props.viewport}
          //draw={this.draw}
          onResize={this.props.engine.resize}
          onKeyUp={this.props.engine.keyUp}
          onKeyDown={this.props.engine.keyDown}
          onMouseUp={this.props.engine.mouseUp}
          onMouseDown={this.props.engine.mouseDown}
          onMouseMove={this.props.engine.mouseMove}
          onDoubleClick={this.props.engine.doubleClick}
          onWheel={this.props.engine.mouseWheel}
        >
          {this.props.children}
        </Canvas>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: IRootReduxState) => ({
  //engineMode: getEngineMode(state),
  //gridSize: getGridSize(state),
  viewport: getViewport(state),
  //resolution: getResolution(state),
})

const mapDispatchToProps = {
  /*
  setGridSize,
  zoomToFit,
  zoomIn,
  zoomOut,
  setSchema,
  setEngineMode,
  */
}

export default connect(mapStateToProps, mapDispatchToProps)(Composition)


//export default Composition
