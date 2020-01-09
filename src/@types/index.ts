import Rectangle from '../atoms/Rectangle'

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
  isVisible: (gridSize: number, viewport: Rectangle) => boolean;
  props: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
