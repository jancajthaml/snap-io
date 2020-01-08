import Rectangle from '../atoms/Rectangle'

export interface IParentSchema {
  addEntity: (entity: any) => void;
  removeEntity: (entity: any) => void;
  elementUpdated: (id: string, newSchema: any) => void;
  setSelected:(element?: any) => void;
  viewport: Rectangle;
  gridSize: number;
}

export interface ICanvasEntitySchema {
  serialize: () => any;
  draw: (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, timestamp: number) => void;
  isVisible: (gridSize: number, viewport: Rectangle) => boolean;
  props: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
