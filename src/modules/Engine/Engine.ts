import { Rectangle, Point } from '../../atoms'
import { IReduxStore } from '../../store'
import { getGridSize, getEngineMode, getViewport, getResolution } from '../Diagram/selectors'
import { zoomIn, zoomOut, setViewPort, setResolution, patchSchema, removeFromSchema } from '../Diagram/actions'
import { IEntitySchema } from '../Diagram/reducer'
import { EngineMode } from '../Diagram/constants'
import { ICanvasEntitySchema } from '../../@types/index'

class Engine {
  currentMouseEventOwner: any;
  currentMouseCoordinates: {
    original: Rectangle;
    scaled: Rectangle;
  };
  store: IReduxStore;

  elements: Map<string, ICanvasEntitySchema>;

  selected: Set<ICanvasEntitySchema>;
  visible: Set<ICanvasEntitySchema>;
  delayedSync?: any;

  constructor(store: IReduxStore) {
    this.currentMouseCoordinates = {
      original: new Rectangle(),
      scaled: new Rectangle(),
    }
    this.store = store
    this.elements = new Map<string, ICanvasEntitySchema>()
    this.selected = new Set<ICanvasEntitySchema>()
    this.visible = new Set<ICanvasEntitySchema>()
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

  get gridSize() {
    return getGridSize(this.store.getState())
  }

  cleanup = () => {
    this.currentMouseEventOwner = undefined
    if (this.delayedSync !== undefined) {
      clearTimeout(this.delayedSync)
    }
    this.setSelected()
  }

  sync = (event: CustomEventInit) => {
    if (this.delayedSync !== undefined) {
      clearTimeout(this.delayedSync)
    }
    if (event.detail && event.detail.hardSync === false) {
      this.updateVisible(this.viewport)
    } else {
      this.visible = new Set(this.elements.values())
      this.delayedSync = setTimeout(() => {
        this.updateVisible(this.viewport)
      }, 100)

    }
  }

  teardown = () => {
    window.removeEventListener('engine-cleanup', this.cleanup)
    window.removeEventListener('engine-sync', this.sync)
    this.cleanup()
  }

  bootstrap = () => {
    window.addEventListener('engine-cleanup', this.cleanup)
    window.addEventListener('engine-sync', this.sync)
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
      const { viewport, elements, gridSize } = this

      const pointOfClick = new Point(
        ((this.currentMouseCoordinates.scaled.x1 / viewport.z) - viewport.x1) / gridSize,
        ((this.currentMouseCoordinates.scaled.y1 / viewport.z) - viewport.y1) / gridSize,
      )

      const captures: ICanvasEntitySchema[] = []

      elements.forEach((element) => {
        if (element.mouseDownCapture) {
          const candidate = element.mouseDownCapture(pointOfClick, viewport, gridSize)
          if (candidate) {
            captures.push(candidate)
          }
        }
      })

      const capture = captures[0]

      let stopPropagation = false
      if (capture && capture.onMouseDown) {
        stopPropagation = capture.onMouseDown()
      }

      if (stopPropagation) {
        this.currentMouseEventOwner = capture
        return
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
    this.sync({
      detail: {
        hardSync: false,
      },
    })
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

    const { resolution, viewport, currentMouseCoordinates, gridSize } = this

    const x = event.clientX - resolution.x1
    const y = event.clientY - resolution.y1

    if (this.currentMouseEventOwner === this) {
      const xDelta = (x - currentMouseCoordinates.original.x2) / viewport.z
      const yDelta = (y - currentMouseCoordinates.original.y2) / viewport.z

      const nextViewPort = viewport.copy()
      nextViewPort.translate(xDelta, yDelta)

      this.updateVisible(nextViewPort)

      this.store.dispatch(setViewPort(nextViewPort))
    } else if (this.currentMouseEventOwner.onMouseMove) {
      currentMouseCoordinates.scaled.x2 = event.clientX - resolution.x1
      currentMouseCoordinates.scaled.y2 = event.clientY - resolution.y1

      let xDelta = Math.round((currentMouseCoordinates.scaled.x2 - currentMouseCoordinates.scaled.x1) / gridSize / viewport.z)
      let yDelta = Math.round((currentMouseCoordinates.scaled.y2 - currentMouseCoordinates.scaled.y1) / gridSize / viewport.z)

      if (xDelta === -0) {
        xDelta = 0
      }
      if (yDelta === -0) {
        yDelta = 0
      }
      if (xDelta !== 0 || yDelta !== 0) {
        this.currentMouseEventOwner.onMouseMove(xDelta, yDelta)
      }

      currentMouseCoordinates.scaled.x1 += xDelta * gridSize * viewport.z
      currentMouseCoordinates.scaled.y1 += yDelta * gridSize * viewport.z
    }

    currentMouseCoordinates.original.x2 = x
    currentMouseCoordinates.original.y2 = y
  }

  elementUpdated = (id: string, newSchema: IEntitySchema) => {
    if (this.engineMode !== EngineMode.EDIT) {
      return
    }
    this.store.dispatch(patchSchema({ [id]: newSchema }))
  }

  elementDeleted = (id: string) => {
    if (this.engineMode !== EngineMode.EDIT) {
      return
    }
    this.setSelected()
    this.store.dispatch(removeFromSchema(id))
  }

  resize = (x: number, y: number, width: number, height: number) => {
    const nextViewPort = this.viewport.copy()
    nextViewPort.resize(width / nextViewPort.z , height / nextViewPort.z)
    this.updateVisible(nextViewPort)
    this.store.dispatch(setResolution(new Rectangle(x, y, width, height)))
    this.store.dispatch(setViewPort(nextViewPort))
  }

  updateVisible = (viewport: Rectangle) => {
    const { gridSize } = this
    const nextVisible = new Set<ICanvasEntitySchema>(this.selected)

    this.elements.forEach((element) => {
      if (element.isVisible(gridSize, viewport)) {
        nextVisible.add(element)
      }
    })
    this.visible = nextVisible
    //this.visible = [...nextVisible]
    /*
    this.visible.sort(function(x, y) {
      if (x.state.selected && y.state.selected) {
        return 0;
      }
      if (x.state.selected && !y.state.selected) {
        return 1;
      }
      return -1;
    });
    */
  }

  connectEntities = () => {
    const { viewport, elements, gridSize } = this


    const startCoordinates = new Point(
      ((this.currentMouseCoordinates.original.x1 / viewport.z) - viewport.x1) / gridSize,
      ((this.currentMouseCoordinates.original.y1 / viewport.z) - viewport.y1) / gridSize,
    )

    const endCoordinates = new Point(
      ((this.currentMouseCoordinates.original.x2 / viewport.z) - viewport.x1) / gridSize,
      ((this.currentMouseCoordinates.original.y2 / viewport.z) - viewport.y1) / gridSize,
    )

    const startCaptures: ICanvasEntitySchema[] = []
    const endCaptures: ICanvasEntitySchema[] = []

    elements.forEach((element) => {
      if (element.mouseDownCapture) {
        const candidate = element.mouseDownCapture(startCoordinates, viewport, gridSize)
        if (candidate && candidate.createLink && candidate.canBeLinked()) {
          startCaptures.push(candidate)
        }
      }
      if (element.mouseDownCapture) {
        const candidate = element.mouseDownCapture(endCoordinates, viewport, gridSize)
        if (candidate && candidate.acceptLink && candidate.canBeLinked()) {
          endCaptures.push(candidate)
        }
      }
    })

    const startCapture: any = startCaptures[0]
    const endCapture: any = endCaptures[0]

    if (startCapture && endCapture) {
      startCapture.createLink(endCapture)
      endCapture.acceptLink(startCapture)

      const startSchema = startCapture.serialize()
      const endSchema = endCapture.serialize()

      const newSchema = {
        [startSchema.id]: startSchema,
        [endSchema.id]: endSchema,
        [`${startCapture.id}-${endCapture.id}`]: {
          id: `${startCapture.id}-${endCapture.id}`,
          type: 'link-entity',
          from: [`${startSchema.id}`, `${startCapture.id}`],
          to: [`${endSchema.id}`, `${endCapture.id}`],
        }
      }

      this.store.dispatch(patchSchema(newSchema))

    }
  }

  setSelected = (element?: any) => {
    if (this.engineMode !== EngineMode.EDIT) {
      return
    }

    this.selected.forEach((element) => {
      element.setState({
        selected: false,
      })
    })

    this.selected.clear()

    if (element) {
      this.selected.add(element)
      element.setState({
        selected: true,
      })
      /*
      // FIXME too eager
      this.visible.sort(function(x, y) {
        if (x.state.selected && y.state.selected) {
          return 0;
        }
        if (x.state.selected && !y.state.selected) {
          return 1;
        }
        return -1;
      });
      */
    }
  }

  addEntity = (id: string, entity: any) => {
    this.elements.set(id, entity)
    this.visible.add(entity)
  }

  removeEntity = (id: string) => {
    const entity = this.elements.get(id)
    if (entity) {
      this.elements.delete(id)  // = this.elements.filter((value) => value !== entity)
      this.visible.delete(entity)   //= this.visible.filter((value) => value !== entity)
      this.selected.delete(entity)  // = this.selected.filter((value) => value !== entity)
    }
  }

  getEntityByID = (id: string) => {
    return this.elements.get(id)
  }
}

export default Engine
