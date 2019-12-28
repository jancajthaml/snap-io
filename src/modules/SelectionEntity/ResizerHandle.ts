
import Rectangle from '../../atoms/Rectangle'


class ResizerHandle extends Rectangle {
  name: string;

  constructor(name: string) {
    super()
    this.name = name
  }
}

export default ResizerHandle
