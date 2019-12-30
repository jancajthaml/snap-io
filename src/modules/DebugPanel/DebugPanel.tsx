import React from 'react'
import Rectangle from '../../atoms/Rectangle'

import { connect } from 'react-redux'
import { IRootReduxState } from '../../reducer'
import { IDiagramSchema, IEntitySchema } from '../Diagram/reducer'
import { setSchema, zoomToFit } from '../Diagram/actions'
import { getViewport, getResolution, getSchema } from '../Diagram/selectors'

interface IProps {
  viewport: Rectangle;
  resolution: Rectangle;
  schema: IDiagramSchema;
  zoomToFit: () => void;
  setSchema: (schema: IDiagramSchema) => void;
}

const loadSchema_A = (): IDiagramSchema => {
  const howMany = 1
  const modulus = Math.floor(Math.pow(howMany, 0.5))

  const result = {} as { [key: string]: IEntitySchema }
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

  return {
    id: 'schema-tiny',
    root: result,
  }
}

const loadSchema_B = (): IDiagramSchema => {
  const howMany = 10
  const modulus = Math.floor(Math.pow(howMany, 0.5))

  const result = {} as { [key: string]: IEntitySchema }
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

  return {
    id: 'schema-small',
    root: result,
  }
}

const loadSchema_C = (): IDiagramSchema => {
  const howMany = 100
  const modulus = Math.min(howMany, Math.round(Math.pow(howMany, 0.5)))

  const result = {} as { [key: string]: IEntitySchema }
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

  return {
    id: 'schema-medium',
    root: result,
  }
}

const loadSchema_D = (): IDiagramSchema => {
  const howMany = 1000
  const modulus = Math.floor(Math.pow(howMany, 0.5))

  const result = {} as { [key: string]: IEntitySchema }
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

  return {
    id: 'schema-huge',
    root: result,
  }
}

const loadSchema_E = (): IDiagramSchema => {
  const howMany = 10000
  const modulus = Math.floor(Math.pow(howMany, 0.5))

  const result = {} as { [key: string]: IEntitySchema }
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

  return {
    id: 'schema-masive',
    root: result,
  }
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
        <button
          style={{
            display: 'block',
          }}
          onClick={() => {
            window.dispatchEvent(new Event('engine-cleanup'));
            props.setSchema(loadSchema_A())
            props.zoomToFit()
          }}
        >
          tiny diagram
        </button>
        <button
          style={{
            display: 'block',
          }}
          onClick={() => {
            window.dispatchEvent(new Event('engine-cleanup'));
            props.setSchema(loadSchema_B())
            props.zoomToFit()
          }}
        >
          small diagram
        </button>
        <button
          style={{
            display: 'block',
          }}
          onClick={() => {
            window.dispatchEvent(new Event('engine-cleanup'));
            props.setSchema(loadSchema_C())
            props.zoomToFit()
          }}
        >
          medium diagram
        </button>
        <button
          style={{
            display: 'block',
          }}
          onClick={() => {
            window.dispatchEvent(new Event('engine-cleanup'));
            props.setSchema(loadSchema_D())
            props.zoomToFit()
          }}
        >
          huge diagram
        </button>
        <button
          style={{
            display: 'block',
          }}
          onClick={() => {
            window.dispatchEvent(new Event('engine-cleanup'));
            props.setSchema(loadSchema_E())
            props.zoomToFit()
          }}
        >
          masive diagram
        </button>
        <pre
          style={{
            fontFamily: 'Verdana',
            fontSize: 8,
            height: 100,
            overflowY: 'scroll',
            border: '1px solid black',
          }}
        >
          {JSON.stringify(props.schema, null, 2)}
        </pre>
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
        <button
          style={{
            display: 'block',
          }}
          onClick={() => {
            props.zoomToFit()
            window.dispatchEvent(new Event('canvas-update-composition'));
          }}
        >
          zoom to fit
        </button>
        <button
          style={{
            display: 'block',
          }}
          onClick={() => {

          }}
        >
          zoom in
        </button>
        <button
          style={{
            display: 'block',
          }}
          onClick={() => {

          }}
        >
          zoom out
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
          {`elements: ${Object.keys(props.schema.root).length}`}
          </li>
        </ul>
      </p>
    </div>
  )
}

const mapStateToProps = (state: IRootReduxState) => ({
  viewport: getViewport(state),
  resolution: getResolution(state),
  schema: getSchema(state),
})

const mapDispatchToProps = {
  zoomToFit,
  setSchema,
}

export default connect(mapStateToProps, mapDispatchToProps)(DebugPanel)
