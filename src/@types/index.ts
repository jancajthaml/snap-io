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
  draw: (layer: number, mode: string, ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, timestamp: number) => void;
  mouseDownCapture?: (point: Point, viewport: Rectangle, gridSize: number) => any[];
  linkCapture?: (point: Point, viewport: Rectangle, gridSize: number) => any;
  selectionCapture?: (selected: boolean) => void;
  onKeyUp?: (event: KeyboardEvent) => boolean;
  onKeyDown?: (event: KeyboardEvent) => boolean;
  onMouseDown?: () => boolean;
  onMouseUp?: () => boolean;
  onMouseDoubleClick?: (viewport: Rectangle, gridSize: number, point: Point) => boolean;
  onMouseMove?: (xDelta: number, yDelta: number) => boolean;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
