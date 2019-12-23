import {
  INSTALL_EVENT,
  UNINSTALL_EVENT,
} from './constants'

export const installEvent = () => ({
  type: INSTALL_EVENT,
  payload: {},
}) as const

export const uninstallEvent = () => ({
  type: UNINSTALL_EVENT,
  payload: {},
}) as const

