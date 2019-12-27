import Rectangle from '../../atoms/Rectangle'

export const sortElements = (elements: any[]) => {
  elements.sort(function(x, y) {
    if (x.bounds.z === y.bounds.z) {
      return 0;
    }
    if (x.bounds.z > y.bounds.z) {
      return 1;
    }
    return -1;
  });
  return elements
}

export const calculateVisible = (elements: any[], selected: any[], viewport: Rectangle) => {
  const visible: Set<any> = new Set(selected)
  elements.forEach((element) => {
    const outOfRight = (viewport.x2 - 2 * viewport.x1 - element.bounds.x1) < 0
    const outOfLeft = (viewport.x1 + element.bounds.x2) < 0
    const outOfBottom = (viewport.y2 - 2 * viewport.y1 - element.bounds.y1) < 0
    const outOfUp = (viewport.y1 + element.bounds.y2) < 0
    if (!(outOfRight || outOfLeft || outOfBottom || outOfUp)) {
      visible.add(element)
    }
  })
  return [...visible]
}

export const calculateSelection = (selected: any[], visible: any[], selection: Rectangle, clearPrevious: boolean) => {
  let nextSelected: any[]
  if (clearPrevious) {
    selected.forEach((element) => {
      if (element.bounds.z >= 1000) {
        element.bounds.z -= 1000
      }
    })
    nextSelected = []
  } else{
    nextSelected = [...selected]
  }
  visible.forEach((element) => {
    if (element.bounds.insideRectangle(selection)) {
      nextSelected.push(element)
      element.bounds.z += 1000
    }
  })
  return nextSelected
}

export const calculateOptimalViewport = (elements: any[], resolution: Rectangle): Rectangle | null => {
  const viewport = new Rectangle()

  let x1: number | undefined = undefined
  let y1: number | undefined = undefined
  let x2: number | undefined = undefined
  let y2: number | undefined = undefined

  elements.forEach((element) => {
    if (x1 === undefined || element.bounds.x1 < x1) {
      x1 = element.bounds.x1
    }
    if (x2 === undefined || element.bounds.x2 > x2) {
      x2 = element.bounds.x2
    }
    if (y1 === undefined || element.bounds.y1 < y1) {
      y1 = element.bounds.y1
    }
    if (y2 === undefined || element.bounds.y2 > y2) {
      y2 = element.bounds.y2
    }
  })

  if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
    return null
  }

  const xScale = (resolution.x2 - resolution.x1) / (x2 - x1)
  const yScale = (resolution.y2 - resolution.y1) / (y2 - y1)

  const nextScale = Math.max(Math.min(Math.min(xScale, yScale) / Math.pow(1.03, 2), 8), 0.2)

  const normalizedDiffWidth = (resolution.x2 - resolution.x1) - (x2 - x1) * nextScale
  const normalizedDiffHeight = (resolution.y2 - resolution.y1) - (y2 - y1) * nextScale

  viewport.x1 = -x1 + (normalizedDiffWidth / nextScale) / 2
  viewport.x2 = viewport.x1 + ((resolution.x2 - resolution.x1) / nextScale)
  viewport.y1 = -y1 + (normalizedDiffHeight / nextScale) / 2
  viewport.y2 = viewport.y1 + ((resolution.y2 - resolution.y1) / nextScale)
  viewport.z = nextScale
  return viewport
}
