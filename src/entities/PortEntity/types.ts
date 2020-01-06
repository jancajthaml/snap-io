
export interface IPortSchema {
  id: string;
  x: number;
  y: number;
  in: string[];
  out: string[];
}

export interface IEntitySchema {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  ports: IPortSchema[];
}
