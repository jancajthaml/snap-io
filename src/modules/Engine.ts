import GridLayer from './GridLayer'
import ElementsLayer from './ElementsLayer'
import OverlayLayer from './OverlayLayer'
import SelectionEntity from './SelectionEntity'
import Rectangle from '../atoms/Rectangle'
import Point from '../atoms/Point'
import MouseFascade from '../components/MouseFascade'
import ElementsFascade from '../components/ElementsFascade'
import { MOUNT_NODE } from '../global/constants'

class Engine {
  grid_layer: GridLayer
  elements_layer: ElementsLayer
  overlay_layer: OverlayLayer
  viewport: Rectangle;
  dimension: Point;
  selection: SelectionEntity;
  scale: number;
  update_visible: boolean;
  mouse: MouseFascade;
  elements: ElementsFascade;

  constructor() {
    this.grid_layer = new GridLayer(document.getElementById('canvas_layer_0') as HTMLCanvasElement, '2d', true)
    this.elements_layer = new ElementsLayer(document.getElementById('canvas_layer_1') as HTMLCanvasElement, '2d', false)
    this.overlay_layer = new OverlayLayer(document.getElementById('canvas_layer_2') as HTMLCanvasElement, '2d', false)
    this.viewport = new Rectangle(0, 0, 1, 1)
    this.dimension = new Point(1, 1)
    this.selection = new SelectionEntity()
    this.scale = 1
    this.update_visible = false
    this.mouse = new MouseFascade()
    this.elements = new ElementsFascade()
  }

  registerListeners = () => {
    document.addEventListener('contextmenu', this.contextMenu)
    document.addEventListener('mousedown', this.mouseDown)
    document.addEventListener('mouseup', this.mouseUp)
    document.addEventListener('mousemove', this.mouseMove)
    document.addEventListener('wheel', this.mouseWheel, { passive: false })
    window.addEventListener('resize', this.resize)

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
    const pointOfClick = new Point(this.mouse.coordinates.x1 / this.scale - this.viewport.x1, this.mouse.coordinates.y1 / this.scale - this.viewport.y1)

    if (event.shiftKey) {
      this.mouse.setEvent('selection')
      this.selection.mouseDown(this)
    } else if (this.selection.selectionCapture(pointOfClick)) {
      this.mouse.setEvent('element-drag')
    } else if (this.selection.resizerCapture(pointOfClick)) {
      this.mouse.setEvent('element-resize')
    } else {
      this.mouse.setEvent('canvas-drag')
    }
    const rootElement = (document.getElementById(MOUNT_NODE) as HTMLElement)
    rootElement.focus()

    this.elements_layer.dirty = true
    this.overlay_layer.dirty = true
  }

  mouseWheel = (event: WheelEvent) => {
    event.preventDefault()
    const prevScale = this.scale
    if (event.deltaY > 0) {
      this.scale = Math.max(this.scale / 1.03, 0.2)
    } else {
      this.scale = Math.min(this.scale * 1.03, 8)
    }
    if (prevScale != this.scale) {
      const zoomX = (event.clientX - this.viewport.x1 * prevScale) / prevScale
      const zoomY = (event.clientY - this.viewport.y1 * prevScale) / prevScale
      this.viewport.x1 = (-zoomX * this.scale + event.clientX) / this.scale
      this.viewport.x2 = this.viewport.x1 + (this.dimension.x / this.scale)
      this.viewport.y1 = (-zoomY * this.scale + event.clientY) / this.scale
      this.viewport.y2 = this.viewport.y1 + (this.dimension.y / this.scale)
      this.update_visible = true
      this.grid_layer.dirty = true
      this.elements_layer.dirty = true
    }
  }

  mouseUp = (event: MouseEvent | FocusEvent) => {
    if (this.mouse.currentEvent === null) {
      return
    }
    if (this.mouse.currentEvent === 'element-resize') {
      this.selection.mouseUp()
    } else if (this.mouse.coordinates.x1 === this.mouse.coordinates.x2 && this.mouse.coordinates.y1 === this.mouse.coordinates.y2) {
      this.selection.updateSelected(this, !((event as MouseEvent).metaKey || (event as MouseEvent).ctrlKey))
      this.selection.compressSelected(this)
      this.selection.updateResizers()
    } else if (this.mouse.currentEvent === 'selection') {
      this.selection.compressSelected(this)
      this.selection.updateResizers()
    }
    this.mouse.up()
    this.elements_layer.dirty = true
    this.overlay_layer.dirty = true
  }

  mouseMove = (event: MouseEvent) => {
    switch (this.mouse.currentEvent) {

      case 'canvas-drag': {
        const xDelta = (event.clientX - this.mouse.coordinates.x2) / this.scale
        const yDelta = (event.clientY - this.mouse.coordinates.y2) / this.scale
        this.mouse.move(event)
        this.viewport.x1 += xDelta
        this.viewport.x2 = this.viewport.x1 + (this.dimension.x / this.scale)
        this.viewport.y1 += yDelta
        this.viewport.y2 = this.viewport.y1 + (this.dimension.y / this.scale)
        this.update_visible = true
        this.grid_layer.dirty = true
        this.elements_layer.dirty = true
        break
      }

      case 'element-drag': {
        const xDelta = (event.clientX - this.mouse.coordinates.x2) / this.scale
        const yDelta = (event.clientY - this.mouse.coordinates.y2) / this.scale
        this.mouse.move(event)
        this.elements.forEachSelected((element) => {
          element.translate(xDelta, yDelta)
        })
        this.selection.translate(xDelta, yDelta)
        this.update_visible = true
        this.elements_layer.dirty = true
        break
      }

      case 'element-resize': {
        const xDelta = (event.clientX - this.mouse.coordinates.x2) / this.scale
        const yDelta = (event.clientY - this.mouse.coordinates.y2) / this.scale
        this.mouse.move(event)
        this.selection.mouseMove(this, xDelta, yDelta)
        this.elements_layer.dirty = true
        break
      }

      case 'selection': {
        this.mouse.move(event)
        this.selection.mouseMove(this, 0, 0)
        this.elements_layer.dirty = true
        this.overlay_layer.dirty = true
        break
      }

      default: {
        break
      }
    }
  }

  update = () => {
    if (!this.update_visible) {
      return
    }
    this.elements.updateVisible(this)
    this.update_visible = false
  }

  resize = () => {
    this.dimension.x = window.innerWidth
    this.dimension.y = window.innerHeight
    this.viewport.resize(this.dimension.x / this.scale, this.dimension.y / this.scale)
    this.grid_layer.resize(this.dimension.x, this.dimension.y)
    this.elements_layer.resize(this.dimension.x, this.dimension.y)
    this.overlay_layer.resize(this.dimension.x, this.dimension.y)

    this.update_visible = true
  }

  draw = () => {
    this.grid_layer.draw(this)
    this.elements_layer.draw(this)
    this.overlay_layer.draw(this)
  }
}

export default Engine
