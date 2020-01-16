import React from 'react'
import { connect } from 'react-redux'
import { Rectangle } from '../../atoms'
import { IRootReduxState } from '../../reducer'
import { IDiagramSchema, IEntitySchema, ILinkSchema } from '../Diagram/reducer'
import { EngineMode } from '../Diagram/constants'
import { setGridSize, setEngineMode, setSchema, zoomIn, zoomOut, zoomToFit } from '../Diagram/actions'
import { getViewport, getEngineMode, getResolution, getGridSize } from '../Diagram/selectors'

interface IProps {
  engineMode: EngineMode;
  viewport: Rectangle;
  resolution: Rectangle;
  gridSize: number;
  setGridSize: (gridSize: number) => void;
  zoomToFit: () => void;
  zoomIn: (centerX: number, centerY: number, power: number) => void;
  zoomOut: (centerX: number, centerY: number, power: number) => void;
  setSchema: (schema: IDiagramSchema) => void;
  setEngineMode: (engineMode: EngineMode) => void;
}

const loadSchema_A = (): IDiagramSchema => {
  const howMany = 300
  const modulus = Math.floor(Math.pow(howMany, 0.5))

  const entities = new Map<string, IEntitySchema>()
  const links = new Map<string, ILinkSchema>()

  Array.from(Array(howMany).keys()).forEach((idx) => {
    entities.set(`port_${idx}`, {
      id: `port_${idx}`,
      x: (idx % modulus) * 5,
      y: Math.floor(idx / modulus) * 5,
      width: 4,
      height: 4,
      ports: [
        {
          id: `port_${idx}_port_center`,
          x: 0.5,
          y: 0.5,
        },
        {
          id: `port_${idx}_port_top`,
          x: 0.5,
          y: 0,
        },
        {
          id: `port_${idx}_port_bottom`,
          x: 0.5,
          y: 1,
        },
        {
          id: `port_${idx}_port_left`,
          x: 0,
          y: 0.5,
        },
        {
          id: `port_${idx}_port_right`,
          x: 1,
          y: 0.5,
        },
      ],
      type: 'port-entity',
    })
  })

  Array.from(Array(howMany - 1).keys()).forEach((idx) => {
    links.set(`port_${idx}_port_center-port_${idx+1}_port_center`, {
      id: `port_${idx}_port_center-port_${idx+1}_port_center`,
      type: 'link-entity',
      from: [`port_${idx}`, 'port_center'],
      to: [`port_${idx + 1}`, 'port_center'],
      breaks: [],
    })
  })

  return {
    id: 'schema-tiny',
    entities,
    links,
  }
}

const loadSchemaComplicatedGifs = (): IDiagramSchema => {
  const entities = new Map<string, IEntitySchema>()
  const links = new Map<string, ILinkSchema>()

  entities.set('image_0', {
    id: `image_0`,
    x: 0,
    y: 0,
    width: 4,
    height: 4,
    type: 'image-entity',
    url: 'https://i.imgur.com/pJuvVpo.gif',
  })

  entities.set('image_1', {
    id: `image_1`,
    x: 5,
    y: 0,
    width: 4,
    height: 4,
    type: 'image-entity',
    url: 'https://i.imgur.com/eW0qYKS.gif',
  })

  entities.set('image_2', {
    id: `image_2`,
    x: 10,
    y: 0,
    width: 4,
    height: 4,
    type: 'image-entity',
    url: 'https://media2.giphy.com/media/x5cIUstbjvsac/source.gif',
  })

  return {
    id: 'schema-gifs',
    entities,
    links,
  }
}

const loadSchema_C = (): IDiagramSchema => {
  const howMany = 100
  const modulus = Math.min(howMany, Math.round(Math.pow(howMany, 0.5)))

  const entities = new Map<string, IEntitySchema>()
  const links = new Map<string, ILinkSchema>()

  Array.from(Array(howMany).keys()).forEach((idx) => {
    if (idx % 8 === 0) {
      entities.set(`text_${idx}`, {
        id: `text_${idx}`,
        x: (idx % modulus) * 5,
        y: Math.floor(idx / modulus) * 5,
        width: 4,
        height: 4,
        type: 'text-entity',
        text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin mattis lacinia justo. Duis risus. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Curabitur bibendum justo non orci. Integer imperdiet lectus quis justo. Mauris dolor felis, sagittis at, luctus sed, aliquam non, tellus. Duis viverra diam non justo. Pellentesque arcu. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede.\nSed convallis magna eu sem. Etiam neque. Nulla est. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sapien nunc, commodo et, interdum suscipit, sollicitudin et, dolor. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Pellentesque pretium lectus id turpis. Praesent dapibus. Maecenas aliquet accumsan leo. Fusce aliquam vestibulum ipsum. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Vivamus porttitor turpis ac leo. Nulla accumsan, elit sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Donec iaculis gravida nulla. Nam sed tellus id magna elementum tincidunt. Duis condimentum augue id magna semper rutrum. Aliquam erat volutpat.',
      })
    } else if (idx % 2 === 0) {
      entities.set(`image_${idx}`, {
        id: `image_${idx}`,
        x: (idx % modulus) * 5,
        y: Math.floor(idx / modulus) * 5,
        width: 4,
        height: 4,
        type: 'image-entity',
        url: idx % 4 === 0 ? 'https://i.imgur.com/eW0qYKS.gif' : 'https://media2.giphy.com/media/x5cIUstbjvsac/source.gif',
      })
    } else {
      entities.set(`box_${idx}`, {
        id: `box_${idx}`,
        x: (idx % modulus) * 5,
        y: Math.floor(idx / modulus) * 5,
        width: 4,
        height: 4,
        type: 'box-entity',
        color: ["red", "blue", "green"][(idx % 3)],
      })
    }
  })

  return {
    id: 'schema-medium',
    entities,
    links,
  }
}

const loadSchema_D = (): IDiagramSchema => {
  const howMany = 1000
  const modulus = Math.floor(Math.pow(howMany, 0.5))

  const entities = new Map<string, IEntitySchema>()
  const links = new Map<string, ILinkSchema>()

  Array.from(Array(howMany).keys()).forEach((idx) => {
    if (idx % 8 === 0) {
      entities.set(`text_${idx}`, {
        id: `text_${idx}`,
        x: (idx % modulus) * 5,
        y: Math.floor(idx / modulus) * 5,
        width: 4,
        height: 4,
        type: 'text-entity',
        text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin mattis lacinia justo. Duis risus. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Curabitur bibendum justo non orci. Integer imperdiet lectus quis justo. Mauris dolor felis, sagittis at, luctus sed, aliquam non, tellus. Duis viverra diam non justo. Pellentesque arcu. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede.\nSed convallis magna eu sem. Etiam neque. Nulla est. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sapien nunc, commodo et, interdum suscipit, sollicitudin et, dolor. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Pellentesque pretium lectus id turpis. Praesent dapibus. Maecenas aliquet accumsan leo. Fusce aliquam vestibulum ipsum. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Vivamus porttitor turpis ac leo. Nulla accumsan, elit sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Donec iaculis gravida nulla. Nam sed tellus id magna elementum tincidunt. Duis condimentum augue id magna semper rutrum. Aliquam erat volutpat.',
      })
    } else if (idx % 2 === 0) {
      entities.set(`image_${idx}`, {
        id: `image_${idx}`,
        x: (idx % modulus) * 5,
        y: Math.floor(idx / modulus) * 5,
        width: 4,
        height: 4,
        type: 'image-entity',
        url: idx % 4 === 0 ? 'https://bellard.org/bpg/2.png' : 'https://media2.giphy.com/media/x5cIUstbjvsac/source.gif',
      })
    } else {
      entities.set(`box_${idx}`, {
        id: `box_${idx}`,
        x: (idx % modulus) * 5,
        y: Math.floor(idx / modulus) * 5,
        width: 4,
        height: 4,
        type: 'box-entity',
        color: ["red", "blue", "green"][(idx % 3)],
      })
    }
  })

  return {
    id: 'schema-huge',
    entities,
    links,
  }
}

const loadSchema_E = (): IDiagramSchema => {
  const howMany = 10000
  const modulus = Math.floor(Math.pow(howMany, 0.5))

  const entities = new Map<string, IEntitySchema>()
  const links = new Map<string, ILinkSchema>()

  Array.from(Array(howMany).keys()).forEach((idx) => {

    entities.set(`text_${idx}`, {
      id: `text_${idx}`,
      x: (idx % modulus) * 5,
      y: Math.floor(idx / modulus) * 5,
      width: 4,
      height: 4,
      type: 'text-entity',
      text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin mattis lacinia justo. Duis risus. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Curabitur bibendum justo non orci. Integer imperdiet lectus quis justo. Mauris dolor felis, sagittis at, luctus sed, aliquam non, tellus. Duis viverra diam non justo. Pellentesque arcu. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede.\nSed convallis magna eu sem. Etiam neque. Nulla est. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sapien nunc, commodo et, interdum suscipit, sollicitudin et, dolor. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Pellentesque pretium lectus id turpis. Praesent dapibus. Maecenas aliquet accumsan leo. Fusce aliquam vestibulum ipsum. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Vivamus porttitor turpis ac leo. Nulla accumsan, elit sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Donec iaculis gravida nulla. Nam sed tellus id magna elementum tincidunt. Duis condimentum augue id magna semper rutrum. Aliquam erat volutpat.',
    })

    /*
    entities.set(`image_${idx}`, {
      id: `image_${idx}`,
      x: (idx % modulus) * 5,
      y: Math.floor(idx / modulus) * 5,
      width: 4,
      height: 4,
      type: 'image-entity',
      url: 'https://bellard.org/bpg/2.png',
    })
    */

    /*
    entities.set(`image_${idx}`, {
      id: `image_${idx}`,
      x: (idx % modulus) * 5,
      y: Math.floor(idx / modulus) * 5,
      width: 4,
      height: 4,
      type: 'image-entity',
      url: 'https://media2.giphy.com/media/x5cIUstbjvsac/source.gif',
    })
    */

    /*
    entities.set(`box_${idx}`, {
      id: `box_${idx}`,
      x: (idx % modulus) * 5,
      y: Math.floor(idx / modulus) * 5,
      width: 4,
      height: 4,
      type: 'box-entity',
      color: ["red", "blue", "green"][(idx % 3)],
    })
    */

    //if (idx % 8 === 0) {

    /*} else if (idx % 2 === 0) {
      entities.set(`image_${idx}`, {
        id: `image_${idx}`,
        x: (idx % modulus) * 5,
        y: Math.floor(idx / modulus) * 5,
        width: 4,
        height: 4,
        type: 'image-entity',
        url: idx % 4 === 0 ? 'https://bellard.org/bpg/2.png' : 'https://media2.giphy.com/media/x5cIUstbjvsac/source.gif',
      })
    } else {
      entities.set(`box_${idx}`, {
        id: `box_${idx}`,
        x: (idx % modulus) * 5,
        y: Math.floor(idx / modulus) * 5,
        width: 4,
        height: 4,
        type: 'box-entity',
        color: ["red", "blue", "green"][(idx % 3)],
      })
    }*/
  })

  return {
    id: 'schema-masive',
    entities,
    links,
  }
}

// FIXME add gridSize from redux store and provide slider element that would change grisSize on change
const DebugPanel = (props: IProps) => {
  return (
    <div
      style={{
        fontFamily: 'Verdana',
        fontSize: 10,
      }}
    >
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
          engine mode
        </h5>

        <button
          onClick={(event) => {
            event.preventDefault()
            window.dispatchEvent(new Event('engine-cleanup'));
            if (props.engineMode === EngineMode.EDIT) {
              props.setEngineMode(EngineMode.VIEW)
            } else {
              props.setEngineMode(EngineMode.EDIT)
            }
            //window.dispatchEvent(new Event('engine-sync'))
          }}
        >
          {props.engineMode === EngineMode.EDIT
            ? 'switch to view'
            : 'switch to edit'
          }
        </button>
      </p>
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
            window.dispatchEvent(new Event('engine-sync'))
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
            props.setSchema(loadSchemaComplicatedGifs())
            props.zoomToFit()
            window.dispatchEvent(new Event('engine-sync'))
          }}
        >
          complicated gifs
        </button>
        <button
          style={{
            display: 'block',
          }}
          onClick={() => {
            window.dispatchEvent(new Event('engine-cleanup'));
            props.setSchema(loadSchema_C())
            props.zoomToFit()
            window.dispatchEvent(new Event('engine-sync'))
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
            window.dispatchEvent(new Event('engine-sync'))
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
            window.dispatchEvent(new Event('engine-sync'))
          }}
        >
          masive diagram
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
        <h5
          style={{
            margin: 0
          }}
        >
          {`zoom ( ${Math.round(((props.viewport.z - 0.3) * 100) / (12 - 0.3))}% )`}
        </h5>
        <div
          style={{
            display: 'block',
          }}
        >
          <button
            style={{
              display: 'inline-block',
            }}
            onClick={() => {
              // FIXME flickers
              props.zoomToFit()
              window.dispatchEvent(new Event('engine-sync'))
            }}
          >
            fit
          </button>
          <button
            style={{
              display: 'inline-block',
            }}
            onClick={() => {
              // FIXME flickers
              props.zoomIn(window.innerWidth / 2, window.innerHeight / 2, 10)
              window.dispatchEvent(new Event('engine-sync'))
            }}
          >
            +
          </button>
          <button
            style={{
              display: 'inline-block',
            }}
            onClick={() => {
              // FIXME flickers
              props.zoomOut(window.innerWidth / 2, window.innerHeight / 2, 10)
              window.dispatchEvent(new Event('engine-sync'))
            }}
          >
            -
          </button>
        </div>
      </p>
      <p>
        <h5
          style={{
            margin: 0
          }}
        >
        {`grid size ( ${props.gridSize} )`}
        </h5>
        <input
          type="range"
          min={6*2}
          max={6*10}
          style={{
            display: 'block',
          }}
          value={props.gridSize}
          onChange={(event) => {
            event.preventDefault()
            props.setGridSize(Number(event.target.value))
            window.dispatchEvent(new Event('engine-sync'))
          }}
        />
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
    </div>
  )
}

const mapStateToProps = (state: IRootReduxState) => ({
  engineMode: getEngineMode(state),
  gridSize: getGridSize(state),
  viewport: getViewport(state),
  resolution: getResolution(state),
})

const mapDispatchToProps = {
  setGridSize,
  zoomToFit,
  zoomIn,
  zoomOut,
  setSchema,
  setEngineMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(DebugPanel)
