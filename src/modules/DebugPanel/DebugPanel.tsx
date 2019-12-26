import React from 'react'
import Rectangle from '../../atoms/Rectangle'
import Point from '../../atoms/Point'
import { connect } from 'react-redux'
import { IRootReduxState } from '../../reducer'
import { getViewport, getResolution, getElements, getSelected, getVisible } from '../Diagram/selectors'

interface IProps {
  viewport: Rectangle;
  resolution: Point;
  visible: any[];
  elements: any[];
  selected: any[];
}

const DebugPanel = (props: IProps) => {
  return (
    <div tabIndex={0}>
      <h4
        style={{
          margin: 0
        }}
      >
        Debug Panel
      </h4>
      <p>
        <h5
          style={{
            margin: 0
          }}
        >
          viewport
        </h5>
        <ul>
          <li>
          {`x: ${props.viewport.x1.toFixed(2)}`}
          </li>
          <li>
          {`y: ${props.viewport.y1.toFixed(2)}`}
          </li>
          <li>
          {`w: ${(props.viewport.x2 - props.viewport.x1).toFixed(2)}`}
          </li>
          <li>
          {`h: ${(props.viewport.y2 - props.viewport.y1).toFixed(2)}`}
          </li>
          <li>
          {`z: ${props.viewport.z.toFixed(2)}`}
          </li>
        </ul>
        <button>
          zoom to fit
        </button>
      </p>
      <p>
        <h5
          style={{
            margin: 0
          }}
        >
          resolution
        </h5>
        <ul>
          <li>
          {`w: ${(props.resolution.x).toFixed(2)}`}
          </li>
          <li>
          {`h: ${(props.resolution.y).toFixed(2)}`}
          </li>
        </ul>
      </p>
      <p>
        <h5
          style={{
            margin: 0
          }}
        >
          elements
        </h5>
        <ul>
          <li>
          {`elements: ${props.elements.length}`}
          </li>
          <li>
          {`visible: ${props.visible.length}`}
          </li>
          <li>
          {`selected: ${props.selected.length}`}
          </li>
        </ul>
      </p>
    </div>
  )
}

const mapStateToProps = (state: IRootReduxState) => ({
  viewport: getViewport(state),
  resolution: getResolution(state),
  visible: getVisible(state),
  elements: getElements(state),
  selected: getSelected(state),
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(DebugPanel)
