import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createJSONStorage } from 'zustand/middleware'

type SimpleCounterState = {
  count: number
  increment: () => void
}

type CounterState = {
  totalClicks: number
  name: string
  increment: () => void
  setName: (newName: string) => void
}

export const useCounterStore = create<CounterState>()(
  persist((set) => ({
    totalClicks: 0,
    name: 'Zustand counter',
    increment: () => {
      set((state) => ({ totalClicks: state.totalClicks + 1 }))
    },
    setName: (newName: string) => {
      set({ name: newName })
    }
  }), { 
    name: 'counter-storage',
    version: 1,
    partialize: (state) => ({
      totalClicks: state.totalClicks
    }),
    migrate: (persistedState, oldVersion) => {
      if (oldVersion === 0) {
        const oldState = persistedState as { count: number }
        return { totalClicks: oldState.count }
      }
      return persistedState as { totalClicks: number }
    },
    onRehydrateStorage: (initialState) => {
      console.log('start:', initialState)

      return (state, error) => {
        if (error) {
          console.error(error)
        } else {
          console.log('end:', state)
        }
      }
    },
    storage: createJSONStorage(() => sessionStorage)
    // storage: createJSONStorage(() => ({
    //   getItem: (key) => localStorage.getItem(key),

    //   setItem: (key, value) => {
    //     console.log('save:', key, value)
    //     localStorage.setItem(key, value)
    //   },

    //   removeItem: (key) => localStorage.removeItem(key)
    // }))
  })
)

export const useSimpleCounterStore = create<SimpleCounterState>()((set) => ({
  count: 0,
  increment: () => {
    set((state) => ({ count: state.count + 1 }))
  }
}))


// const persistImpl: PersistImpl = (config, baseOptions) => (set, get, api) => {
//   let options = {
//     storage: createJSONStorage(() => window.localStorage),
//     partialize: (state: S) => state,
//     version: 0,
//     merge: (saved: unknown, current: S) => ({
//       ...current,
//       ...(saved as object)
//     }),
//     ...baseOptions
//   }

//   const storage = options.storage

//   const setItem = () => {
//     const state = options.partialize({ ...get() })

//     return storage?.setItem(options.name, {
//       state,
//       version: options.version
//     })
//   }

//   const savedSetState = api.setState

//   api.setState = (...args) => {
//     savedSetState(...(args as Parameters<typeof savedSetState>))
//     return setItem()
//   }

//   const configResult = config((...args) => {
//       set(...args)
//       return setItem()
//     },
//     get,
//     api,
//   )

//   api.getInitialState = () => configResult

//   let stateFromStorage: S | undefined

//   const hydrate = () => {
//     const saved = storage.getItem(options.name)

//     let restoredState = saved?.state
//     let migrated = false

//     if (
//       typeof saved?.version === 'number' &&
//       saved.version !== options.version
//     ) {
//       if (options.migrate) {
//         restoredState = options.migrate(
//           saved.state,
//           saved.version
//         )
//         migrated = true
//       } else {
//         restoredState = undefined
//       }
//     }

//     stateFromStorage = options.merge(
//       restoredState,
//       get() ?? configResult
//     )

//     set(stateFromStorage, true)

//     if (migrated) setItem()

//     hasHydrated = true
//   }

//   if (!options.skipHydration) {
//     hydrate()
//   }

//   return stateFromStorage || configResult
// }