import Rectangle from '../atoms/Rectangle'
import SelectionEntity from './SelectionEntity'
import Point from '../atoms/Point'
import MouseFascade from '../components/MouseFascade'
import { MOUNT_NODE, MODE_SELECTION, MODE_RESIZE, MODE_TRANSLATE, MODE_SCENE_TRANSLATE } from '../global/constants'
import { IReduxStore } from '../store'
import { getViewport, getResolution, getElements, getSelected, getVisible } from './Diagram/selectors'
import { setViewPort, setResolution, updateSelection, addElement, removeElement } from './Diagram/actions'

class Engine {
  selection: SelectionEntity;
  mouse: MouseFascade;
  store: IReduxStore;

  constructor(store: IReduxStore) {
    this.selection = new SelectionEntity()
    this.mouse = new MouseFascade()
    this.store = store
  }

  get viewport() {
    return getViewport(this.store.getState())
  }

  get visible() {
    return getVisible(this.store.getState())
  }

  get elements() {
    return getElements(this.store.getState())
  }

  get selected() {
    return getSelected(this.store.getState())
  }

  get resolution() {
    return getResolution(this.store.getState())
  }

  cleanup = () => {
    this.mouse.setEvent(undefined)
  }

  bootstrap = () => {

  }

  mouseDown = (event: MouseEvent) => {
    this.mouse.down(event)

    const pointOfClick = new Point(
      this.mouse.coordinates.x1 / this.viewport.z - this.viewport.x1,
      this.mouse.coordinates.y1 / this.viewport.z - this.viewport.y1,
    )

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
      nextViewPort.x2 = nextViewPort.x1 + (this.resolution.x / nextScale)
      nextViewPort.y1 = (-zoomY * nextScale + e.y) / nextScale
      nextViewPort.y2 = nextViewPort.y1 + (this.resolution.y / nextScale)
      nextViewPort.z = nextScale

      this.store.dispatch(setViewPort(nextViewPort))
      window.dispatchEvent(new Event('canvas-update-composition'));
    }
  }

  mouseUp = (event: MouseEvent) => {
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
        nextViewPort.x2 = nextViewPort.x1 + (this.resolution.x / nextViewPort.z)
        nextViewPort.y1 += yDelta
        nextViewPort.y2 = nextViewPort.y1 + (this.resolution.y / nextViewPort.z)

        this.store.dispatch(setViewPort(nextViewPort))
        window.dispatchEvent(new Event('canvas-update-composition'));
        break
      }

      case MODE_TRANSLATE: {
        const e = this.mouse.normalized(event)
        const xDelta = (e.x - this.mouse.coordinates.x2) / this.viewport.z
        const yDelta = (e.y - this.mouse.coordinates.y2) / this.viewport.z
        this.mouse.move(event)
        this.selected.forEach((element) => {
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
    const nextViewPort = this.viewport.copy()
    nextViewPort.resize(width / nextViewPort.z , height / nextViewPort.z)

    this.store.dispatch(setResolution(new Point(width, height)))
    this.store.dispatch(setViewPort(nextViewPort))
  }

  updateSelected = (selection: Rectangle, clearPrevious: boolean) => {
    this.store.dispatch(updateSelection(selection, clearPrevious))
  }

  addEntity = (entity: any) => {
    this.store.dispatch(addElement(entity))
  }

  removeEntity = (entity: any) => {
    this.store.dispatch(removeElement(entity))
  }

}

export default Engine
