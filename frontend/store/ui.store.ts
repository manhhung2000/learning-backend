'use client'

import { useSyncExternalStore } from 'react'

interface UIState {
  sidebarOpen: boolean
}

let state: UIState = { sidebarOpen: true }

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((fn) => fn())

const SERVER_SNAPSHOT: UIState = { sidebarOpen: true }

export const uiStore = {
  subscribe: (fn: () => void) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  getSnapshot: () => state,
  getServerSnapshot: (): UIState => SERVER_SNAPSHOT,

  toggleSidebar: () => {
    state = { ...state, sidebarOpen: !state.sidebarOpen }
    notify()
  },
}

export const useUIStore = () =>
  useSyncExternalStore(uiStore.subscribe, uiStore.getSnapshot, uiStore.getServerSnapshot)
