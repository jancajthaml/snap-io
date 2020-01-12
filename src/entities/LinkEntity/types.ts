
import { Point } from '../../atoms'

export interface IEntitySchema {
  id: string;
  type: string;
  from: string[];
  to: string[];
  breaks: Point[];
}
