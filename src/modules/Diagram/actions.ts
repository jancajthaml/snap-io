
export const foo = () => ({
  type: 'foo',
  payload: {},
}) as const

export type IAction =
  | ReturnType<typeof foo>
