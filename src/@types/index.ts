import { Point, Rectangle } from '../atoms'

export interface ICanvasEntityWrapperSchema {
  addEntity: (id: string, entity: any) => void;
  connectEntities: () => void;
  removeEntity: (id: string) => void;
  elementUpdated: (id: string, newSchema: any) => void;
  getEntityByID: (id: string) => any;
  elementDeleted: (id: string) => void;
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
  createLink?: (other: any) => void;
  acceptLink?: (other: any) => void;
  setState: (nextState: any) => void;
  props: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
