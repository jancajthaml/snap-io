import Rectangle from '../atoms/Rectangle'
import Point from '../atoms/Point'
import { IReduxStore } from '../store'
import { getGridSize, getViewport, getResolution } from './Diagram/selectors'
import { setViewPort, setResolution , patchSchema } from './Diagram/actions'
import { IEntitySchema } from './Diagram/reducer'

class Engine {
  currentMouseEventOwner: any;
  currentMouseCoordinates: Rectangle;
  store: IReduxStore;

  elements: any[];
  selected: any[];
  visible: any[];
  delayedSync: any;

  constructor(store: IReduxStore) {
    this.currentMouseCoordinates = new Rectangle()
    this.store = store
    this.elements = []
    this.selected = []
    this.visible = []
    this.delayedSync = null
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
    if (this.delayedSync) {
      clearTimeout(this.delayedSync)
    }
  }

  sync = () => {
    if (this.delayedSync) {
      clearTimeout(this.delayedSync)
    }
    this.delayedSync = setTimeout(() => {
      this.updateVisible(this.viewport)
    }, 1)
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

  mouseDown = (event: MouseEvent) => {
    const { resolution, viewport, elements, gridSize } = this

    const x = event.clientX - resolution.x1
    const y = event.clientY - resolution.y1

    this.currentMouseCoordinates.x1 = x
    this.currentMouseCoordinates.y1 = y
    this.currentMouseCoordinates.x2 = x
    this.currentMouseCoordinates.y2 = y

    const pointOfClick = new Point(
      ((this.currentMouseCoordinates.x1 / viewport.z) - viewport.x1) / gridSize,
      ((this.currentMouseCoordinates.y1 / viewport.z) - viewport.y1) / gridSize,
    )

    const capture = elements
      .map((element) => element.mouseDownCapture
        ? element.mouseDownCapture(pointOfClick, viewport, gridSize)
        : undefined
      ).filter((element) => element)[0]

    let stopPropagation = false
    if (capture && capture.onMouseDown) {
      stopPropagation = capture.onMouseDown()
    }

    if (stopPropagation) {
      this.currentMouseEventOwner = capture
      return
    }

    this.currentMouseEventOwner = this
  }

  mouseWheel = (event: WheelEvent) => {
    const viewport = this.viewport
    const prevScale = viewport.z
    let nextScale = viewport.z

    if (event.deltaY > 0) {
      nextScale = Math.max(prevScale / 1.03, 0.3)
    } else {
      nextScale = Math.min(prevScale * 1.03, 12)
    }

    if (prevScale === nextScale) {
      return
    }

    const resolution = this.resolution
    const x = event.clientX - resolution.x1
    const y = event.clientY - resolution.y1

    const zoomX = (x - viewport.x1 * prevScale) / prevScale
    const zoomY = (y - viewport.y1 * prevScale) / prevScale

    const nextViewPort = viewport.copy()
    nextViewPort.x1 = (-zoomX * nextScale + x) / nextScale
    nextViewPort.x2 = nextViewPort.x1 + ((resolution.x2 - resolution.x1) / nextScale)
    nextViewPort.y1 = (-zoomY * nextScale + y) / nextScale
    nextViewPort.y2 = nextViewPort.y1 + ((resolution.y2 - resolution.y1) / nextScale)
    nextViewPort.z = nextScale

    this.updateVisible(nextViewPort)

    this.store.dispatch(setViewPort(nextViewPort))
  }

  mouseUp = (event: MouseEvent) => {
    if (this.currentMouseEventOwner === undefined) {
      return
    }

    if (this.currentMouseEventOwner === this) {
      if (
        this.currentMouseCoordinates.x1 === this.currentMouseCoordinates.x2 &&
        this.currentMouseCoordinates.y1 === this.currentMouseCoordinates.y2
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

    this.currentMouseCoordinates.x1 = x
    this.currentMouseCoordinates.y1 = y
    this.currentMouseCoordinates.x2 = x
    this.currentMouseCoordinates.y2 = y
  }

  // FIXME do not immediatelly dispatch delta x and delta y remember original position of
  // mouse down and current position of mouse move and calculate delta based on that
  mouseMove = (event: MouseEvent) => {
    if (this.currentMouseEventOwner === undefined) {
      return
    }

    const { resolution, viewport, currentMouseCoordinates, gridSize } = this

    if (this.currentMouseEventOwner === this) {
      const x = event.clientX - resolution.x1
      const y = event.clientY - resolution.y1
      const xDelta = (x - currentMouseCoordinates.x2) / viewport.z
      const yDelta = (y - currentMouseCoordinates.y2) / viewport.z

      currentMouseCoordinates.x2 = x
      currentMouseCoordinates.y2 = y

      const nextViewPort = viewport.copy()
      nextViewPort.translate(xDelta, yDelta)

      this.updateVisible(nextViewPort)

      this.store.dispatch(setViewPort(nextViewPort))

    } else if (this.currentMouseEventOwner.onMouseMove) {

      currentMouseCoordinates.x2 = event.clientX - resolution.x1
      currentMouseCoordinates.y2 = event.clientY - resolution.y1

      let xDelta = Math.round((currentMouseCoordinates.x2 - currentMouseCoordinates.x1) / gridSize / viewport.z)
      let yDelta = Math.round((currentMouseCoordinates.y2 - currentMouseCoordinates.y1) / gridSize / viewport.z)

      if (xDelta === -0) {
        xDelta = 0
      }
      if (yDelta === -0) {
        yDelta = 0
      }
      if (xDelta !== 0 || yDelta !== 0) {
        this.currentMouseEventOwner.onMouseMove(xDelta, yDelta)
      }

      currentMouseCoordinates.x1 += xDelta * gridSize * viewport.z
        currentMouseCoordinates.y1 += yDelta * gridSize * viewport.z
    }
  }

  elementUpdated = (id: string, newSchema: IEntitySchema) => {
    this.store.dispatch(patchSchema({ [id]: newSchema }))
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
    const nextVisible = new Set<any>(this.selected)

    this.elements.forEach((element) => {
      const outOfRight = (viewport.x2 - 2 * viewport.x1 - element.props.x * gridSize) < 0
      const outOfLeft = (viewport.x1 + (element.props.x + element.props.width) * gridSize) < 0
      const outOfBottom = (viewport.y2 - 2 * viewport.y1 - element.props.y * gridSize) < 0
      const outOfUp = (viewport.y1 + (element.props.y + element.props.height) * gridSize) < 0
      if (!(outOfRight || outOfLeft || outOfBottom || outOfUp)) {
        nextVisible.add(element)
      }
    })
    this.visible = [...nextVisible]
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

  setSelected = (element?: any) => {
    this.selected.forEach((element) => {
      element.setState({
        selected: false,
      })
    })

    if (element) {
      this.selected = [element]
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
    } else {
      this.selected = []
    }
  }

  addEntity = (entity: any) => {
    this.elements.push(entity)
  }

  removeEntity = (entity: any) => {
    this.elements = this.elements.filter((value) => value !== entity)
    this.visible = this.visible.filter((value) => value !== entity)
    this.selected = this.selected.filter((value) => value !== entity)
  }

}

export default Engine
