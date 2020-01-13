import { Rectangle } from '../../atoms'

import { IAction } from './actions'

import * as C from './constants'
import { calculateOptimalViewport, calculateZoomedViewport } from './utils'

import { IEntitySchema as IBoxEntitySchema } from '../../entities/BoxEntity/types'
import { IEntitySchema as IImageEntitySchema } from '../../entities/ImageEntity/types'
import { IEntitySchema as ITextEntitySchema } from '../../entities/TextEntity/types'
import { IEntitySchema as IPortEntitySchema } from '../../entities/PortEntity/types'
import { IEntitySchema as ILinkEntitySchema } from '../../entities/LinkEntity/types'

export type IEntitySchema =
  | IBoxEntitySchema
  | IImageEntitySchema
  | ITextEntitySchema
  | IPortEntitySchema

export type ILinkSchema =
  | ILinkEntitySchema

export interface IDiagramSchema {
  id: string;
  entities: Map<string, IEntitySchema>;
  links: Map<string, ILinkSchema>;
}

export const initialState = {
  engineMode: C.EngineMode.EDIT as C.EngineMode,
  schema: {
    id: '',
    entities: new Map<string, IEntitySchema>(),
    links: new Map<string, ILinkSchema>(),
  } as IDiagramSchema,
  gridSize: 12 as number,
  viewport: new Rectangle() as Rectangle,
  resolution: new Rectangle(0, 0, 1, 1) as Rectangle,
} as const

export type IReduxState = typeof initialState

export default (state: IReduxState = initialState, action: IAction): IReduxState => {
  switch (action.type) {

    case C.SET_ENGINE_MODE: {
      return {
        ...state,
        engineMode: action.payload.engineMode,
      }
    }

    case C.SET_GRID_SIZE: {
      return {
        ...state,
        gridSize: action.payload.gridSize,
      }
    }

    case C.SET_SCHEMA: {
      return {
        ...state,
        schema: action.payload.schema,
      }
    }

    case C.SET_VIEWPORT: {
      return {
        ...state,
        viewport: action.payload.viewport,
      }
    }

    case C.ZOOM_IN: {
      return {
        ...state,
        viewport: calculateZoomedViewport(state.viewport, state.resolution, action.payload.centerX, action.payload.centerY, 1, action.payload.power),
      }
    }

    case C.ZOOM_OUT: {
      return {
        ...state,
        viewport: calculateZoomedViewport(state.viewport, state.resolution, action.payload.centerX, action.payload.centerY, -1, action.payload.power),
      }
    }

    case C.ZOOM_TO_FIT: {
      const viewport = calculateOptimalViewport(state.schema, state.gridSize, state.resolution)
      if (viewport === null) {
        return {
          ...state,
          viewport: new Rectangle(0, 0, state.resolution.x2 - state.resolution.x1, state.resolution.y2 - state.resolution.y1),
        }
      }
      return {
        ...state,
        viewport,
      }
    }

    case C.SET_RESOLUTION: {
      return {
        ...state,
        resolution: action.payload.resolution,
      }
    }

    case C.REMOVE_LINK_FROM_SCHEMA: {
      const links = new Map<string, ILinkSchema>(state.schema.links)
      links.delete(action.payload.id)

      return {
        ...state,
        schema: {
          id: state.schema.id,
          entities: state.schema.entities,
          links,
        },
      }
    }

    case C.REMOVE_ENTITY_FROM_SCHEMA: {
      const entities = new Map<string, IEntitySchema>(state.schema.entities)
      entities.delete(action.payload.id)

      return {
        ...state,
        schema: {
          id: state.schema.id,
          entities,
          links: state.schema.links,
        },
      }
    }

    case C.PATCH_LINK_SCHEMA: {
      const links = new Map<string, ILinkSchema>(state.schema.links)

      for (const [key, value] of Object.entries(action.payload.update)) {
        links.set(key, value)
      }

      return {
        ...state,
        schema: {
          id: state.schema.id,
          entities: state.schema.entities,
          links,
        },
      }
    }

    case C.PATCH_ENTITY_SCHEMA: {
      const entities = new Map<string, IEntitySchema>(state.schema.entities)

      for (const [key, value] of Object.entries(action.payload.update)) {
        entities.set(key, value)
      }

      return {
        ...state,
        schema: {
          id: state.schema.id,
          entities,
          links: state.schema.links,
        },
      }
    }

    default: {
      return state
    }

  }
}
