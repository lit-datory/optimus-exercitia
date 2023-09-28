import { atom, Getter } from "jotai"

export declare type Fn<Value> = (
  get: Getter,
  options: {
    signal: AbortSignal
  },
) => Value

export const refetchableAtom = <Value>(fn: Fn<Promise<Value>>) => {
  const refetchAtom = atom(true)

  return atom(
    async (get, options): Promise<Value> => {
      get(refetchAtom)
      return await fn(get, options)
    },

    (get, set) => {
      set(refetchAtom, !get(refetchAtom))
    },
  )
}
