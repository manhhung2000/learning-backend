'use client'

import { useEffect } from 'react'
import { classesApi } from '@lib/api/classes.api'
import { usePagination } from '@shared/hooks/usePagination'
import { useFetchReducer } from '@shared/hooks/useFetch'
import type { Class } from '@models/api.types'

interface ClassPayload {
  name: string
  description: string
}

export const useClasses = () => {
  const { page, limit, goToPage } = usePagination()
  const [{ data, total, loading }, dispatch] = useFetchReducer<Class>()

  const reload = async () => {
    dispatch({ type: 'loading' })
    const res = await classesApi.findAll(page, limit)
    dispatch({ type: 'success', data: res.data, total: res.total })
  }

  useEffect(() => {
    reload()
  }, [page, limit])

  const create = async (payload: ClassPayload) => {
    await classesApi.create(payload)
    await reload()
  }

  const update = async (id: number, payload: Partial<ClassPayload>) => {
    await classesApi.update(id, payload)
    await reload()
  }

  const remove = async (id: number) => {
    await classesApi.remove(id)
    await reload()
  }

  return { data, total, page, limit, loading, goToPage, create, update, remove }
}
