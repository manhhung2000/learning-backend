'use client'

import { useSyncExternalStore, useEffect } from 'react'
import { fetchAuthSession, signOut as amplifySignOut } from 'aws-amplify/auth'

interface AuthUser {
  email: string
  name: string
  role: string | null
}

interface AuthState {
  user: AuthUser | null
  idToken: string | null
}

interface AuthState {
  user: AuthUser | null
  idToken: string | null
  initialized: boolean
}

const NULL_STATE: AuthState = { user: null, idToken: null, initialized: false }
let state: AuthState = NULL_STATE

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((fn) => fn())

export const authStore = {
  subscribe: (fn: () => void) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  getSnapshot: () => state,
  getServerSnapshot: () => NULL_STATE,

  init: async () => {
    try {
      const session = await fetchAuthSession()
      const idToken = session.tokens?.idToken
      if (!idToken) {
        state = { ...NULL_STATE, initialized: true }
        notify()
        return
      }

      const payload = idToken.payload
      const groups = (payload['cognito:groups'] as string[]) ?? []
      const email = payload.email as string

      state = {
        user: {
          email,
          name: (payload['name'] as string) ?? email,
          role: groups[0] ?? null,
        },
        idToken: idToken.toString(),
        initialized: true,
      }
    } catch {
      state = { ...NULL_STATE, initialized: true }
    }
    notify()
  },

  signOut: async () => {
    await amplifySignOut()
    state = NULL_STATE
    notify()
  },

  getIdToken: async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession()
      return session.tokens?.idToken?.toString() ?? null
    } catch {
      return null
    }
  },
}

export const useAuthStore = () => {
  const snap = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot,
  )
  useEffect(() => {
    authStore.init()
  }, [])
  return snap
}
