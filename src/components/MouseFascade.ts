import { MOUNT_NODE } from '../global/constants'
import Rectangle from '../atoms/Rectangle'
import { MODE_SELECTION, MODE_TRANSLATE, MODE_SCENE_TRANSLATE } from '../global/constants'

class MouseFascade {

  currentEvent?: string;
  coordinates: Rectangle;

  constructor() {
    this.coordinates = new Rectangle()
  }

  setEvent = (event: string | undefined) => {
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
    // FIXME
    return {
      x: event.clientX - 200,
      y: event.clientY,
    }
  }

  down = (event: MouseEvent) => {
    const e = this.normalized(event)
    this.coordinates.x1 = e.x
    this.coordinates.y1 = e.y
    this.coordinates.x2 = e.x
    this.coordinates.y2 = e.y
  }

  move = (event: MouseEvent) => {
    const e = this.normalized(event)
    this.coordinates.x2 = e.x
    this.coordinates.y2 = e.y
  }

  up = () => {
    this.setEvent(undefined)
  }

}

export default MouseFascade;
