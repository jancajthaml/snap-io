import { MOUNT_NODE } from '../global/constants'
import Rectangle from '../atoms/Rectangle'
import { MODE_SELECTION, MODE_TRANSLATE, MODE_SCENE_TRANSLATE } from '../global/constants'

class MouseFascade {

  currentEvent?: string;
  coordinates: Rectangle;

  constructor() {
    this.coordinates = new Rectangle()
  }

  setEvent(event: string | undefined) {
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
    this.currentEvent = event
  }

  normalized(event: MouseEvent) {
    return {
      x: event.clientX - (event.target as HTMLElement).offsetLeft,
      y: event.clientY - (event.target as HTMLElement).offsetTop
    }
  }

  down(event: MouseEvent) {
    this.coordinates.x1 = (event.clientX - (event.target as HTMLElement).offsetLeft)
    this.coordinates.y1 = (event.clientY - (event.target as HTMLElement).offsetTop)
    this.coordinates.x2 = (event.clientX - (event.target as HTMLElement).offsetLeft)
    this.coordinates.y2 = (event.clientY - (event.target as HTMLElement).offsetTop)
  }

  move(event: MouseEvent) {
    this.coordinates.x2 = (event.clientX - (event.target as HTMLElement).offsetLeft)
    this.coordinates.y2 = (event.clientY - (event.target as HTMLElement).offsetTop)
  }

  up() {
    this.setEvent(undefined)
  }

}

export default MouseFascade;
