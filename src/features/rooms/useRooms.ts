import { useCallback, useEffect, useState } from 'react'
import { getRooms } from '../../lib/api'
import type { Room } from '../../types'

type RoomsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; rooms: Room[] }

export function useRooms() {
  const [state, setState] = useState<RoomsState>({ status: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => {
    setReloadKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      // LAB 3: set loading, call getRooms(), then set success or error.
      // Keep the cancelled check so a slow response cannot overwrite a newer one.
      setState({ status: 'loading' })
      try {
        const rooms = await getRooms()
        if (!cancelled) {
          void rooms,
          setState({status:'success',rooms})
          if(cancelled) {throw new Error('Lab 3: implement useRooms — call getRooms() and set state.')}
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to load rooms.',
          })
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  return { state, reload }
}
