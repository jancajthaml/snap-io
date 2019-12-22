import { MOUNT_NODE } from '../global/constants'
import Rectangle from '../atoms/Rectangle'

class MouseFascade {

  currentEvent?: string;
  coordinates: Rectangle;

  constructor() {
    this.coordinates = new Rectangle()
  }

  setEvent(event: string | undefined) {
    switch (event) {
      case 'selection': {
        (document.getElementById(MOUNT_NODE) as HTMLElement).style.cursor = "default"
        break
      }
      case 'canvas-drag':
      case 'element-drag': {
        (document.getElementById(MOUNT_NODE) as HTMLElement).style.cursor = "move"
        break
      }
      default: {
        (document.getElementById(MOUNT_NODE) as HTMLElement).style.cursor = "default"
        break
      }
    }
    this.currentEvent = event
  }

  down(event: MouseEvent) {
    this.coordinates.x1 = event.clientX
    this.coordinates.y1 = event.clientY
    this.coordinates.x2 = event.clientX
    this.coordinates.y2 = event.clientY
  }

  move(event: MouseEvent) {
    this.coordinates.x2 = event.clientX
    this.coordinates.y2 = event.clientY
  }

  up() {
    this.setEvent(undefined)
  }

}

export default MouseFascade;
