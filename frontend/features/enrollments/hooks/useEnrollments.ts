'use client'

import { useEffect } from 'react'
import { enrollmentsApi } from '@lib/api/enrollments.api'
import { usePagination } from '@shared/hooks/usePagination'
import { useFetchReducer } from '@shared/hooks/useFetch'
import type { Enrollment, EnrollmentStatus } from '@models/api.types'

export const useEnrollments = () => {
  const { page, limit, goToPage } = usePagination()
  const [{ data, total, loading }, dispatch] = useFetchReducer<Enrollment>()

  const reload = async () => {
    dispatch({ type: 'loading' })
    const res = await enrollmentsApi.findAll(page, limit)
    dispatch({ type: 'success', data: res.data, total: res.total })
  }

  useEffect(() => {
    reload()
  }, [page, limit])

  const create = async (payload: { studentId: number; courseId: number }) => {
    await enrollmentsApi.create(payload)
    await reload()
  }

  const updateStatus = async (id: number, status: EnrollmentStatus) => {
    await enrollmentsApi.updateStatus(id, status)
    await reload()
  }

  const remove = async (id: number) => {
    await enrollmentsApi.remove(id)
    await reload()
  }

  return { data, total, page, limit, loading, goToPage, create, updateStatus, remove }
}
