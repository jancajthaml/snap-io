import { Point, Rectangle } from '../atoms'

export interface ICanvasEntityWrapperSchema {
  addEntity: (entity: any) => void;
  removeEntity: (entity: any) => void;
  elementUpdated: (id: string, newSchema: any) => void;
  elementDeleted: (id: string) => void;
  setSelected:(element?: any) => void;
}

export interface ICanvasEntitySchema {
  serialize: () => any;
  draw: (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, timestamp: number) => void;
  mouseDownCapture?: (point: Point, viewport: Rectangle, gridSize: number) => any;
  isVisible: (gridSize: number, viewport: Rectangle) => boolean;
  onKeyUp?: (event: KeyboardEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseMove?: (xDelta: number, yDelta: number) => void;
  setState: (nextState: any) => void;
  props: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
