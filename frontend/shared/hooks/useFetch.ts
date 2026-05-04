'use client'

import { useReducer } from 'react'

type FetchState<T> = { data: T[]; total: number; loading: boolean }
type FetchAction<T> = { type: 'loading' } | { type: 'success'; data: T[]; total: number }

function fetchReducer<T>(state: FetchState<T>, action: FetchAction<T>): FetchState<T> {
  if (action.type === 'loading') return { ...state, loading: true }
  return { data: action.data, total: action.total, loading: false }
}

export const useFetchReducer = <T>() =>
  useReducer(fetchReducer<T>, { data: [], total: 0, loading: false })
