import Rectangle from '../atoms/Rectangle'
import Point from '../atoms/Point'
import { MOUNT_NODE, MODE_SELECTION, MODE_RESIZE, MODE_TRANSLATE, MODE_SCENE_TRANSLATE } from '../global/constants'
import { IReduxStore } from '../store'
import { getGridSize, getViewport, getResolution } from './Diagram/selectors'
import { setViewPort, setResolution, patchSchema } from './Diagram/actions'
import { IEntitySchema } from './Diagram/reducer'
import SelectionFascade from './SelectionFascade'

class Engine {
  selection: SelectionFascade;
  currentMouseEvent?: string;
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
    this.selection = new SelectionFascade(this)
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
    this.setMouseEvent(undefined)
    this.selection.cleanup()
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

  setMouseEvent = (event: string | undefined) => {
    switch (event) {
      case MODE_SELECTION: {
        (document.getElementById(MOUNT_NODE) as HTMLElement).style.cursor = "default"
        break
      }
      case MODE_TRANSLATE:
      case MODE_SCENE_TRANSLATE: {
        (document.getElementById(MOUNT_NODE) as HTMLElement).style.cursor = "move"
        break
      }
      default: {
        (document.getElementById(MOUNT_NODE) as HTMLElement).style.cursor = "default"
        break
      }
    }
    this.currentMouseEvent = event
  }

  mouseDown = (event: MouseEvent) => {
    const { resolution, viewport, elements } = this

    const x = event.clientX - resolution.x1
    const y = event.clientY - resolution.y1

    this.currentMouseCoordinates.x1 = x
    this.currentMouseCoordinates.y1 = y
    this.currentMouseCoordinates.x2 = x
    this.currentMouseCoordinates.y2 = y

    const pointOfClick = new Point(
      (this.currentMouseCoordinates.x1 / viewport.z) - viewport.x1,
      (this.currentMouseCoordinates.y1 / viewport.z) - viewport.y1,
    )

    const capture = elements.find((element) => {
      if (element.mouseDownCapture && element.mouseDownCapture(pointOfClick)) {
        return element
      }
    })

    if (capture && capture.onMouseDown) {
      capture.onMouseDown(pointOfClick)
    } else {
      if (event.shiftKey) {
        this.setMouseEvent(MODE_SELECTION)
        this.selection.onMouseDown()
      } else if (this.selection.selectionCapture(pointOfClick)) {
        this.setMouseEvent(MODE_TRANSLATE)
      } else if (this.selection.resizerCapture(pointOfClick)) {
        this.setMouseEvent(MODE_RESIZE)
      } else {
        this.setMouseEvent(MODE_SCENE_TRANSLATE)
      }
    }

    window.dispatchEvent(new Event('canvas-update-composition'));
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
    if (this.currentMouseEvent === undefined) {
      return
    }

    if (this.currentMouseEvent === MODE_RESIZE) {
      this.selection.onMouseUp()
    } else if (
      this.currentMouseCoordinates.x1 === this.currentMouseCoordinates.x2 &&
      this.currentMouseCoordinates.y1 === this.currentMouseCoordinates.y2
    ) {
      this.selection.updateSelected(this.viewport, this.currentMouseCoordinates, !((event as MouseEvent).metaKey || (event as MouseEvent).ctrlKey))
      this.selection.compressSelected()
      this.selection.bounds.updateResizers()
    } else if (this.currentMouseEvent === MODE_SELECTION) {
      this.selection.compressSelected()
      this.selection.bounds.updateResizers()
    }

    if (this.currentMouseEvent === MODE_TRANSLATE || this.currentMouseEvent === MODE_RESIZE) {
      let updateBulk = {} as { [key: string]: IEntitySchema }

      this.selected.forEach((element) => {
        updateBulk[element.props.id] = element.serialize()
      })

      this.store.dispatch(patchSchema(updateBulk))
    }

    this.setMouseEvent(undefined)

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

    switch (this.currentMouseEvent) {

      case MODE_SCENE_TRANSLATE: {
        const { resolution, viewport, currentMouseCoordinates } = this
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

        //window.dispatchEvent(new Event('canvas-update-composition'));
        break
      }

      case MODE_TRANSLATE: {
        const { resolution, viewport, currentMouseCoordinates, gridSize } = this
        currentMouseCoordinates.x2 = event.clientX - resolution.x1
        currentMouseCoordinates.y2 = event.clientY - resolution.y1

        const xDelta = Math.round((currentMouseCoordinates.x2 - currentMouseCoordinates.x1) / gridSize / viewport.z)
        const yDelta = Math.round((currentMouseCoordinates.y2 - currentMouseCoordinates.y1) / gridSize / viewport.z)

        if ((xDelta === -0 || xDelta === 0) && (yDelta === -0 || yDelta === 0)) {
          break
        }
        this.selected.forEach((element) => {
          element.props.x += xDelta
          element.props.y += yDelta
        })
        this.selection.bounds.translate(xDelta * gridSize, yDelta * gridSize)

        currentMouseCoordinates.x1 += xDelta * gridSize * viewport.z
        currentMouseCoordinates.y1 += yDelta * gridSize * viewport.z

        break
      }

      case MODE_RESIZE: {
        const { resolution, viewport, currentMouseCoordinates, gridSize } = this

        currentMouseCoordinates.x2 = event.clientX - resolution.x1
        currentMouseCoordinates.y2 = event.clientY - resolution.y1

        const xDelta = Math.round((currentMouseCoordinates.x2 - currentMouseCoordinates.x1) / gridSize / viewport.z)
        const yDelta = Math.round((currentMouseCoordinates.y2 - currentMouseCoordinates.y1) / gridSize / viewport.z)

        if ((xDelta === -0 || xDelta === 0) && (yDelta === -0 || yDelta === 0)) {
          break
        }

        this.selection.onResize(xDelta === -0 ? 0 : xDelta, yDelta === -0 ? 0 : yDelta)

        currentMouseCoordinates.x1 += xDelta * gridSize * viewport.z
        currentMouseCoordinates.y1 += yDelta * gridSize * viewport.z

        break
      }

      case MODE_SELECTION: {
        const { resolution, currentMouseCoordinates } = this
        currentMouseCoordinates.x2 = event.clientX - resolution.x1
        currentMouseCoordinates.y2 = event.clientY - resolution.y1
        this.selection.onMouseMove()
        break
      }

      default: {
        break
      }
    }
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
    this.visible = [...this.selected]

    this.elements.forEach((element) => {
      const outOfRight = (viewport.x2 - 2 * viewport.x1 - element.props.x * gridSize) < 0
      const outOfLeft = (viewport.x1 + (element.props.x + element.props.width) * gridSize) < 0
      const outOfBottom = (viewport.y2 - 2 * viewport.y1 - element.props.y * gridSize) < 0
      const outOfUp = (viewport.y1 + (element.props.y + element.props.height) * gridSize) < 0
      if (!(outOfRight || outOfLeft || outOfBottom || outOfUp)) {
        this.visible.push(element)
      }
    })
    this.visible.sort(function(x, y) {
      if (x.state.selected && y.state.selected) {
        return 0;
      }
      if (x.state.selected && !y.state.selected) {
        return 1;
      }
      return -1;
    });
  }

  updateSelected = (selection: Rectangle, clearPrevious: boolean) => {
    const { gridSize } = this
    if (clearPrevious) {
      this.selected.forEach((element) => {
        element.setState({
          selected: false,
        })
      })
      this.selected = []
    }
    this.visible.forEach((element) => {
      const insideRectangle = !((element.props.x * gridSize) > selection.x2 || selection.x1 > ((element.props.x + element.props.width) * gridSize) || (element.props.y * gridSize) > selection.y2 || selection.y1 > ((element.props.y + element.props.height) * gridSize))
      if (insideRectangle) {
        this.selected.push(element)
        element.setState({
          selected: true,
        })
      }
    })
    this.visible.sort(function(x, y) {
      if (x.state.selected && y.state.selected) {
        return 0;
      }
      if (x.state.selected && !y.state.selected) {
        return 1;
      }
      return -1;
    });
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
