import { Rectangle, Point, C } from '../../atoms'
import { IReduxStore } from '../../store'
import { getEngineMode, getViewport, getResolution } from '../Diagram/selectors'
import { zoomIn, zoomOut, setViewPort, setResolution, patchEntitySchema, patchLinkSchema, removeEntityFromSchema, removeLinkFromSchema } from '../Diagram/actions'
import { IEntitySchema, ILinkSchema } from '../Diagram/reducer'
import { EngineMode } from '../Diagram/constants'
import { ICanvasEntitySchema, ICanvasEntityWrapperSchema } from '../../@types/index'
import ResizerHandle from '../../enhancers/Resizable/ResizerHandle'
import LinkEntityRenderer from '../../entities/LinkEntity/LinkEntityRenderer'
import PortHandle from '../../entities/PortEntity/PortHandle'
import PointHandle from '../../entities/LinkEntity/PointHandle'

class Engine implements ICanvasEntityWrapperSchema {
  currentMouseEventOwner: any;
  currentMouseCoordinates: {
    original: Rectangle;
    scaled: Rectangle;
  };
  store: IReduxStore;

  elements: Map<string, ICanvasEntitySchema>;

  selected: Set<ICanvasEntitySchema>;

  constructor(store: IReduxStore) {
    this.currentMouseCoordinates = {
      original: new Rectangle(),
      scaled: new Rectangle(),
    }
    this.store = store
    this.elements = new Map<string, ICanvasEntitySchema>()
    this.selected = new Set<ICanvasEntitySchema>()
  }

  get engineMode() {
    return getEngineMode(this.store.getState())
  }

  get viewport() {
    return getViewport(this.store.getState())
  }

  get resolution() {
    return getResolution(this.store.getState())
  }

  cleanup = () => {
    this.currentMouseEventOwner = undefined
    this.setSelected()
  }

  teardown = () => {
    window.removeEventListener('engine-cleanup', this.cleanup)
    this.cleanup()
  }

  bootstrap = () => {
    window.addEventListener('engine-cleanup', this.cleanup)
  }

  keyUp = (event: KeyboardEvent) => {
    if (this.engineMode !== EngineMode.EDIT) {
      return
    }
    this.selected.forEach((element) => {
      if (element.onKeyUp) {
        element.onKeyUp(event)
      }
    })
  }

  keyDown = (event: KeyboardEvent) => {
    if (this.engineMode !== EngineMode.EDIT) {
      return
    }
    this.selected.forEach((element) => {
      if (element.onKeyDown) {
        element.onKeyDown(event)
      }
    })
  }

  doubleClick = (event: MouseEvent) => {
    const { resolution } = this

    const x = event.clientX - resolution.x1
    const y = event.clientY - resolution.y1

    this.currentMouseCoordinates.original.x1 = x
    this.currentMouseCoordinates.original.y1 = y
    this.currentMouseCoordinates.original.x2 = x
    this.currentMouseCoordinates.original.y2 = y

    this.currentMouseCoordinates.scaled.x1 = x
    this.currentMouseCoordinates.scaled.y1 = y
    this.currentMouseCoordinates.scaled.x2 = x
    this.currentMouseCoordinates.scaled.y2 = y

    if (this.engineMode === EngineMode.EDIT) {
      const { viewport, elements } = this

      const pointOfClick = new Point(
        ((this.currentMouseCoordinates.scaled.x1 / viewport.z) - viewport.x1) / C.GRID_SIZE,
        ((this.currentMouseCoordinates.scaled.y1 / viewport.z) - viewport.y1) / C.GRID_SIZE,
      )

      const captures: ICanvasEntitySchema[] = []

      elements.forEach((element) => {
        if (element.mouseDownCapture) {
          captures.push(...element.mouseDownCapture(pointOfClick, viewport, C.GRID_SIZE).filter((node) => Boolean(node.onMouseDoubleClick)))
        }
      })

      captures.sort(function(a, b) {
        if (a == b) {
          return 0
        }
        if (a instanceof PointHandle && !(b instanceof ResizerHandle)) {
          return -1
        }
        if (a instanceof LinkEntityRenderer && !(b instanceof PointHandle) && !(b instanceof PortHandle)) {
          return -1
        }
        if (a instanceof ResizerHandle && !(b instanceof LinkEntityRenderer)) {
          return -1
        }
        if (a instanceof PortHandle && !(b instanceof ResizerHandle)) {
          return -1
        }
        return 1
      })

      if (captures.length > 0) {
        const capture = captures[0]
        if ((capture as any).onMouseDoubleClick(viewport, C.GRID_SIZE, pointOfClick)) {
          //this.currentMouseEventOwner = capture
          return
        }
      }
    }
  }

  mouseDown = (event: MouseEvent) => {
    const { resolution } = this

    const x = event.clientX - resolution.x1
    const y = event.clientY - resolution.y1

    this.currentMouseCoordinates.original.x1 = x
    this.currentMouseCoordinates.original.y1 = y
    this.currentMouseCoordinates.original.x2 = x
    this.currentMouseCoordinates.original.y2 = y

    this.currentMouseCoordinates.scaled.x1 = x
    this.currentMouseCoordinates.scaled.y1 = y
    this.currentMouseCoordinates.scaled.x2 = x
    this.currentMouseCoordinates.scaled.y2 = y

    if (this.engineMode === EngineMode.EDIT) {
      const { viewport, elements } = this

      const pointOfClick = new Point(
        ((this.currentMouseCoordinates.scaled.x1 / viewport.z) - viewport.x1) / C.GRID_SIZE,
        ((this.currentMouseCoordinates.scaled.y1 / viewport.z) - viewport.y1) / C.GRID_SIZE,
      )

      const captures: ICanvasEntitySchema[] = []

      elements.forEach((element) => {
        if (element.mouseDownCapture) {
          captures.push(...element.mouseDownCapture(pointOfClick, viewport, C.GRID_SIZE).filter((node) => Boolean(node.onMouseDown)))
        }
      })

      captures.sort(function(a, b) {
        if (a == b) {
          return 0
        }
        if (a instanceof PointHandle && !(b instanceof ResizerHandle)) {
          return -1
        }
        if (a instanceof LinkEntityRenderer && !(b instanceof PointHandle) && !(b instanceof PortHandle)) {
          return -1
        }
        if (a instanceof ResizerHandle && !(b instanceof LinkEntityRenderer)) {
          return -1
        }
        if (a instanceof PortHandle && !(b instanceof ResizerHandle)) {
          return -1
        }
        return 1
      })

      if (captures.length > 0) {
        const capture = captures[0]
        if ((capture as any).onMouseDown()) {
          this.currentMouseEventOwner = capture
          return
        }
      }

    }

    this.currentMouseEventOwner = this
  }

  mouseWheel = (event: WheelEvent) => {
    const { resolution } = this

    const x = event.clientX - resolution.x1 / 2
    const y = event.clientY - resolution.y1 / 2

    if (event.deltaY > 0) {
      this.store.dispatch(zoomOut(x, y, 1))
    } else {
      this.store.dispatch(zoomIn(x, y, 1))
    }
  }

  mouseUp = (event: MouseEvent) => {
    if (this.currentMouseEventOwner === undefined) {
      return
    }

    if (this.currentMouseEventOwner === this) {
      if (
        this.currentMouseCoordinates.original.x1 === this.currentMouseCoordinates.original.x2 &&
        this.currentMouseCoordinates.original.y1 === this.currentMouseCoordinates.original.y2
      ) {
        this.setSelected()
      }
    } else if (this.currentMouseEventOwner.onMouseUp) {
      this.currentMouseEventOwner.onMouseUp()
    }

    this.currentMouseEventOwner = undefined

    const resolution = this.resolution
    const x = event.clientX - resolution.x1
    const y = event.clientY - resolution.y1

    this.currentMouseCoordinates.scaled.x1 = x
    this.currentMouseCoordinates.scaled.y1 = y
    this.currentMouseCoordinates.scaled.x2 = x
    this.currentMouseCoordinates.scaled.y2 = y

    this.currentMouseCoordinates.original.x1 = x
    this.currentMouseCoordinates.original.y1 = y
    this.currentMouseCoordinates.original.x2 = x
    this.currentMouseCoordinates.original.y2 = y
  }

  mouseMove = (event: MouseEvent) => {
    if (this.currentMouseEventOwner === undefined) {
      return
    }

    const { resolution, viewport, currentMouseCoordinates } = this

    const x = event.clientX - resolution.x1
    const y = event.clientY - resolution.y1

    if (this.currentMouseEventOwner === this) {
      const xDelta = (x - currentMouseCoordinates.original.x2) / viewport.z
      const yDelta = (y - currentMouseCoordinates.original.y2) / viewport.z

      const nextViewPort = viewport.copy()
      nextViewPort.translate(xDelta, yDelta)

      this.store.dispatch(setViewPort(nextViewPort))
    } else if (this.currentMouseEventOwner.onMouseMove) {
      currentMouseCoordinates.scaled.x2 = event.clientX - resolution.x1
      currentMouseCoordinates.scaled.y2 = event.clientY - resolution.y1

      let xDelta = Math.round((currentMouseCoordinates.scaled.x2 - currentMouseCoordinates.scaled.x1) / C.GRID_SIZE / viewport.z)
      let yDelta = Math.round((currentMouseCoordinates.scaled.y2 - currentMouseCoordinates.scaled.y1) / C.GRID_SIZE / viewport.z)

      if (xDelta === -0) {
        xDelta = 0
      }
      if (yDelta === -0) {
        yDelta = 0
      }
      if (xDelta !== 0 || yDelta !== 0) {
        this.currentMouseEventOwner.onMouseMove(xDelta, yDelta)
      }

      currentMouseCoordinates.scaled.x1 += xDelta * C.GRID_SIZE * viewport.z
      currentMouseCoordinates.scaled.y1 += yDelta * C.GRID_SIZE * viewport.z
    }

    currentMouseCoordinates.original.x2 = x
    currentMouseCoordinates.original.y2 = y
  }

  entityUpdated = (id: string, newSchema: IEntitySchema) => {
    if (this.engineMode !== EngineMode.EDIT) {
      return
    }
    this.store.dispatch(patchEntitySchema({ [id]: newSchema }))
  }

  linkUpdated = (id: string, newSchema: ILinkSchema) => {
    if (this.engineMode !== EngineMode.EDIT) {
      return
    }
    this.store.dispatch(patchLinkSchema({ [id]: newSchema }))
  }

  entityDeleted = (id: string) => {
    if (this.engineMode !== EngineMode.EDIT) {
      return
    }
    this.setSelected()
    this.store.dispatch(removeEntityFromSchema(id))
  }

  linkDeleted = (id: string) => {
    if (this.engineMode !== EngineMode.EDIT) {
      return
    }
    this.setSelected()
    this.store.dispatch(removeLinkFromSchema(id))
  }

  resize = (x: number, y: number, width: number, height: number) => {
    const nextViewPort = this.viewport.copy()
    nextViewPort.resize(width / nextViewPort.z , height / nextViewPort.z)
    this.store.dispatch(setResolution(new Rectangle(x, y, width, height)))
    this.store.dispatch(setViewPort(nextViewPort))
  }

  connectEntities = () => {
    const { viewport, elements } = this

    const startCoordinates = new Point(
      ((this.currentMouseCoordinates.original.x1 / viewport.z) - viewport.x1) / C.GRID_SIZE,
      ((this.currentMouseCoordinates.original.y1 / viewport.z) - viewport.y1) / C.GRID_SIZE,
    )

    const endCoordinates = new Point(
      ((this.currentMouseCoordinates.original.x2 / viewport.z) - viewport.x1) / C.GRID_SIZE,
      ((this.currentMouseCoordinates.original.y2 / viewport.z) - viewport.y1) / C.GRID_SIZE,
    )

    const startCaptures: ICanvasEntitySchema[] = []
    const endCaptures: ICanvasEntitySchema[] = []

    elements.forEach((element) => {
      if (element.linkCapture) {
        const candidate = element.linkCapture(startCoordinates, viewport, C.GRID_SIZE)
        if (candidate) {
          startCaptures.push(candidate)
        }
      }
      if (element.linkCapture) {
        const candidate = element.linkCapture(endCoordinates, viewport, C.GRID_SIZE)
        if (candidate) {
          endCaptures.push(candidate)
        }
      }
    })

    const startCapture: any = startCaptures[0]
    const endCapture: any = endCaptures[0]

    if (startCapture == endCapture) {
      return
    }

    if (startCapture && endCapture) {
      const startSchema = startCapture.serialize()
      const endSchema = endCapture.serialize()

      const newSchema = {
        [`${startCapture.id}-${endCapture.id}`]: {
          id: `${startCapture.id}-${endCapture.id}`,
          type: 'link-entity',
          from: [`${startSchema.id}`, `${startCapture.id}`],
          to: [`${endSchema.id}`, `${endCapture.id}`],
          breaks: [],
        }
      }

      this.store.dispatch(patchLinkSchema(newSchema))
    }
  }

  setSelected = (element?: any) => {
    if (this.engineMode !== EngineMode.EDIT) {
      return
    }

    this.selected.forEach((element) => {
      if (element.selectionCapture) {
        element.selectionCapture(false)
      }
    })

    this.selected.clear()

    if (element) {
      this.selected.add(element)
      if (element.selectionCapture) {
        element.selectionCapture(true)
      }
    }
  }

  addNode = (id: string, entity: any) => {
    this.elements.set(id, entity)
  }

  removeNode = (id: string) => {
    const entity = this.elements.get(id)
    if (entity) {
      this.elements.delete(id)
      this.selected.delete(entity)
    }
  }

  getEntityByID = (id: string) => {
    return this.elements.get(id)
  }
}

export default Engine
