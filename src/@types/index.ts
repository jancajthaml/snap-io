import { Point, Rectangle } from '../atoms'

export interface ICanvasEntityWrapperSchema {
  addNode: (id: string, entity: any) => void;
  removeNode: (id: string) => void;
  connectEntities: () => void;
  entityUpdated: (id: string, newSchema: any) => void;
  entityDeleted: (id: string) => void;
  linkDeleted: (id: string) => void;
  linkUpdated: (id: string, newSchema: any) => void;
  getEntityByID: (id: string) => any;
  setSelected:(element?: any) => void;
  currentMouseCoordinates: {
    original: Rectangle;
    scaled: Rectangle;
  };
}

export interface ICanvasEntitySchema {
  serialize: () => any;
  draw: (layer: number, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, timestamp: number) => void;
  mouseDownCapture?: (point: Point, viewport: Rectangle, gridSize: number) => any;
  isVisible: (gridSize: number, viewport: Rectangle) => boolean;
  getCenter: (viewport: Rectangle, gridSize: number, ids: string[], x: number, y: number, width: number, height: number) => Point;
  onKeyUp?: (event: KeyboardEvent) => boolean;
  onKeyDown?: (event: KeyboardEvent) => boolean;
  onMouseDown?: () => boolean;
  onMouseUp?: () => boolean;
  onMouseMove?: (xDelta: number, yDelta: number) => boolean;
  canBeLinked: () => boolean;
  setState: (nextState: any) => void;
  props: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
