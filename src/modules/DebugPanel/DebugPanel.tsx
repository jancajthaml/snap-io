import React from 'react'
import Rectangle from '../../atoms/Rectangle'

import { connect } from 'react-redux'
import { IRootReduxState } from '../../reducer'
import { IDiagramSchema } from '../Diagram/reducer'
import { setSchema, zoomToFit } from '../Diagram/actions'
import { getViewport, getResolution, getElements, getSelected, getVisible } from '../Diagram/selectors'

interface IProps {
  viewport: Rectangle;
  resolution: Rectangle;
  visible: any[];
  elements: { [key: string]: any };
  selected: any[];
  zoomToFit: () => void;
  setSchema: (schema: IDiagramSchema) => void;
}

const loadSchema_A = (): IDiagramSchema => {
  const howMany = 9
  const modulus = Math.floor(Math.pow(howMany, 0.5))

  const result = {} as IDiagramSchema
  Array.from(Array(howMany).keys()).forEach((idx) => {
    result[`box_${idx}`] = {
      id: `box_${idx}`,
      x: (idx % modulus) * 70,
      y: Math.floor(idx / modulus) * 70,
      width: 60,
      height: 60,
      type: 'box-entity'
    }
  })
  return result
}

const loadSchema_B = (): IDiagramSchema => {
  const howMany = 900
  const modulus = Math.floor(Math.pow(howMany, 0.5))

  const result = {} as IDiagramSchema
  Array.from(Array(howMany).keys()).forEach((idx) => {
    result[`box_${idx}`] = {
      id: `box_${idx}`,
      x: (idx % modulus) * 70,
      y: Math.floor(idx / modulus) * 70,
      width: 60,
      height: 60,
      type: 'box-entity'
    }
  })
  return result
}

const loadSchema_C = (): IDiagramSchema => {
  const howMany = 9000
  const modulus = Math.floor(Math.pow(howMany, 0.5))

  const result = {} as IDiagramSchema
  Array.from(Array(howMany).keys()).forEach((idx) => {
    result[`box_${idx}`] = {
      id: `box_${idx}`,
      x: (idx % modulus) * 70,
      y: Math.floor(idx / modulus) * 70,
      width: 60,
      height: 60,
      type: 'box-entity'
    }
  })
  return result
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
          schemas
        </h5>
        <button onClick={() => {
          props.setSchema(loadSchema_A())
          props.zoomToFit()
        }}>
          small diagram
        </button>
        <button onClick={() => {
          props.setSchema(loadSchema_B())
          props.zoomToFit()
        }}>
          medium diagram
        </button>
        <button onClick={() => {
          props.setSchema(loadSchema_C())
          props.zoomToFit()
        }}>
          huge diagram
        </button>
      </p>
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
        <button onClick={() => {
          props.zoomToFit()
          window.dispatchEvent(new Event('canvas-update-composition'));
        }}>
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
          {`x: ${props.resolution.x1.toFixed(2)}`}
          </li>
          <li>
          {`y: ${props.resolution.y1.toFixed(2)}`}
          </li>
          <li>
          {`w: ${(props.resolution.x2 - props.resolution.x1).toFixed(2)}`}
          </li>
          <li>
          {`h: ${(props.resolution.y2 - props.resolution.y1).toFixed(2)}`}
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
          {`elements: ${Object.keys(props.elements).length}`}
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
  zoomToFit,
  setSchema,
}

export default connect(mapStateToProps, mapDispatchToProps)(DebugPanel)
