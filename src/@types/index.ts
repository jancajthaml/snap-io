import Rectangle from '../atoms/Rectangle'

export interface IParentSchema {
  addEntity: (entity: any) => void;
  removeEntity: (entity: any) => void;
  elementUpdated: (id: string, newSchema: any) => void;
  setSelected:(element?: any) => void;
  viewport: Rectangle;
  gridSize: number;
}

export interface IChildSchema {
  serialize: () => any;
  proxyDraw: (ctx: CanvasRenderingContext2D, viewport: Rectangle, gridSize: number, x: number, y: number, width: number, height: number, _: number) => void;
  isVisible: (gridSize: number, viewport: Rectangle) => boolean;
  props: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
