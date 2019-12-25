import SelectionEntity from './SelectionEntity'
import Point from '../atoms/Point'
import MouseFascade from '../components/MouseFascade'
import ElementsFascade from '../components/ElementsFascade'
import { MOUNT_NODE, MODE_SELECTION, MODE_RESIZE, MODE_TRANSLATE, MODE_SCENE_TRANSLATE } from '../global/constants'
import { IReduxStore } from '../store'
import { getViewport } from './Diagram/selectors'
import { setViewPort } from './Diagram/actions'

class Engine {
  dimension: Point;
  selection: SelectionEntity;
  update_visible: boolean;
  mouse: MouseFascade;
  elements: ElementsFascade;
  store: IReduxStore;

  constructor(store: IReduxStore) {
    this.dimension = new Point(1, 1)
    this.selection = new SelectionEntity()
    this.update_visible = false
    this.mouse = new MouseFascade()
    this.elements = new ElementsFascade()
    this.store = store
  }

  get viewport() {
    return getViewport(this.store.getState())
  }

  cleanup = () => {
    this.mouse.setEvent(undefined)
  }

  removeListeners = () => {
    document.removeEventListener('contextmenu', this.contextMenu)
    document.removeEventListener('mousedown', this.mouseDown)
    document.removeEventListener('mouseup', this.mouseUp)
    document.removeEventListener('mousemove', this.mouseMove)
    document.removeEventListener('wheel', this.mouseWheel)
    window.removeEventListener('resize', this.onResize)

    const rootElement = (document.getElementById(MOUNT_NODE) as HTMLElement)
    rootElement.removeEventListener('blur', this.mouseUp)
  }

  addListeners = () => {
    document.addEventListener('contextmenu', this.contextMenu)
    document.addEventListener('mousedown', this.mouseDown)
    document.addEventListener('mouseup', this.mouseUp)
    document.addEventListener('mousemove', this.mouseMove)
    document.addEventListener('wheel', this.mouseWheel, { passive: false })
    window.addEventListener('resize', this.onResize)

    const rootElement = (document.getElementById(MOUNT_NODE) as HTMLElement)
    rootElement.addEventListener('blur', this.mouseUp)
  }

  contextMenu = (event: MouseEvent) => {
    if (event.button === 0 && event.ctrlKey) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  mouseDown = (event: MouseEvent) => {
    event.preventDefault()
    if (event.button !== 0) {
      return
    }

    this.mouse.down(event)
    const pointOfClick = new Point(this.mouse.coordinates.x1 / this.viewport.z - this.viewport.x1, this.mouse.coordinates.y1 / this.viewport.z - this.viewport.y1)

    // FIXME if resizing switch in mode where resizing respects aspect ration
    // FIXME decide if resising based on whenever there is resizer selection
    // capute or this is moude down on canvas
    if (event.shiftKey) {
      this.mouse.setEvent(MODE_SELECTION)
      this.selection.mouseDown(this)
    } else if (this.selection.selectionCapture(pointOfClick)) {
      this.mouse.setEvent(MODE_TRANSLATE)
    } else if (this.selection.resizerCapture(this, pointOfClick)) {
      this.mouse.setEvent(MODE_RESIZE)
    } else {
      this.mouse.setEvent(MODE_SCENE_TRANSLATE)
    }
    const rootElement = (document.getElementById(MOUNT_NODE) as HTMLElement)
    rootElement.focus()

    window.dispatchEvent(new Event('canvas-update-composition'));
  }

  mouseWheel = (event: WheelEvent) => {
    event.preventDefault()

    const prevScale = this.viewport.z
    let nextScale = this.viewport.z
    if (event.deltaY > 0) {
      nextScale = Math.max(prevScale / 1.03, 0.2)
    } else {
      nextScale = Math.min(prevScale * 1.03, 8)
    }
    if (prevScale != nextScale) {
      const e = this.mouse.normalized(event)
      const zoomX = (e.x - this.viewport.x1 * prevScale) / prevScale
      const zoomY = (e.y - this.viewport.y1 * prevScale) / prevScale

      const nextViewPort = this.viewport.copy()
      nextViewPort.x1 = (-zoomX * nextScale + e.x) / nextScale
      nextViewPort.x2 = nextViewPort.x1 + (this.dimension.x / nextScale)
      nextViewPort.y1 = (-zoomY * nextScale + e.y) / nextScale
      nextViewPort.y2 = nextViewPort.y1 + (this.dimension.y / nextScale)
      nextViewPort.z = nextScale

      this.store.dispatch(setViewPort(nextViewPort))

      this.elements.updateVisible(nextViewPort)
      window.dispatchEvent(new Event('canvas-update-composition'));
    }
  }

  mouseUp = (event: MouseEvent | FocusEvent) => {
    if (this.mouse.currentEvent === null) {
      return
    }
    if (this.mouse.currentEvent === MODE_RESIZE) {
      this.selection.mouseUp()
    } else if (this.mouse.coordinates.x1 === this.mouse.coordinates.x2 && this.mouse.coordinates.y1 === this.mouse.coordinates.y2) {
      this.selection.updateSelected(this, !((event as MouseEvent).metaKey || (event as MouseEvent).ctrlKey))
      this.selection.compressSelected(this)
      this.selection.updateResizers()
    } else if (this.mouse.currentEvent === MODE_SELECTION) {
      this.selection.compressSelected(this)
      this.selection.updateResizers()
    }
    this.mouse.up()
    window.dispatchEvent(new Event('canvas-update-composition'));
  }

  mouseMove = (event: MouseEvent) => {
    switch (this.mouse.currentEvent) {

      case MODE_SCENE_TRANSLATE: {
        const e = this.mouse.normalized(event)
        const xDelta = (e.x - this.mouse.coordinates.x2) / this.viewport.z
        const yDelta = (e.y - this.mouse.coordinates.y2) / this.viewport.z
        this.mouse.move(event)

        const nextViewPort = this.viewport.copy()
        nextViewPort.x1 += xDelta
        nextViewPort.x2 = nextViewPort.x1 + (this.dimension.x / nextViewPort.z)
        nextViewPort.y1 += yDelta
        nextViewPort.y2 = nextViewPort.y1 + (this.dimension.y / nextViewPort.z)

        this.store.dispatch(setViewPort(nextViewPort))

        this.elements.updateVisible(nextViewPort)
        window.dispatchEvent(new Event('canvas-update-composition'));
        break
      }

      case MODE_TRANSLATE: {
        const e = this.mouse.normalized(event)
        const xDelta = (e.x - this.mouse.coordinates.x2) / this.viewport.z
        const yDelta = (e.y - this.mouse.coordinates.y2) / this.viewport.z
        this.mouse.move(event)
        this.elements.forEachSelected((element) => {
          element.bounds.translate(xDelta, yDelta)
        })
        this.selection.translate(xDelta, yDelta)
        window.dispatchEvent(new Event('canvas-update-composition'));
        break
      }

      case MODE_RESIZE: {
        const e = this.mouse.normalized(event)
        const xDelta = (e.x - this.mouse.coordinates.x2) / this.viewport.z
        const yDelta = (e.y - this.mouse.coordinates.y2) / this.viewport.z
        this.mouse.move(event)
        this.selection.mouseMove(this, xDelta, yDelta)
        window.dispatchEvent(new Event('canvas-update-composition'));
        break
      }

      case MODE_SELECTION: {
        this.mouse.move(event)
        this.selection.mouseMove(this, 0, 0)
        window.dispatchEvent(new Event('canvas-update-composition'));
        break
      }

      default: {
        break
      }
    }
  }

  resize = (width: number, height: number) => {
    this.dimension.x = width
    this.dimension.y = height

    const nextViewPort = this.viewport.copy()
    nextViewPort.resize(width / nextViewPort.z , height / nextViewPort.z)
    this.store.dispatch(setViewPort(nextViewPort))

    this.elements.updateVisible(nextViewPort)
  }

  onResize = () => {
    window.dispatchEvent(new Event('canvas-resize-composition'));
  }

  addEntity = (entity: any) => {
    this.elements.add(entity)
    this.elements.updateVisible(this.viewport)
  }

  removeEntity = (entity: any) => {
    this.elements.remove(entity)
    this.elements.updateVisible(this.viewport)
  }

}

export default Engine
