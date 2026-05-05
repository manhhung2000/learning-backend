'use client'

import { useEffect } from 'react'
import { coursesApi } from '@lib/api/courses.api'
import { usePagination } from '@shared/hooks/usePagination'
import { useFetchReducer } from '@shared/hooks/useFetch'
import type { Course } from '@models/api.types'

interface CoursePayload {
  subjectName: string
  cognitoId: string
  classId: number
  academicYear: string
  semester: string
  startDate?: string
  endDate?: string
}

export const useCourses = () => {
  const { page, limit, goToPage } = usePagination()
  const [{ data, total, loading }, dispatch] = useFetchReducer<Course>()

  const reload = async () => {
    dispatch({ type: 'loading' })
    const res = await coursesApi.findAll(page, limit)
    dispatch({ type: 'success', data: res.data, total: res.total })
  }

  useEffect(() => {
    reload()
  }, [page, limit])

  const create = async (payload: CoursePayload) => {
    await coursesApi.create(payload)
    await reload()
  }

  const update = async (id: number, payload: Partial<CoursePayload>) => {
    await coursesApi.update(id, payload)
    await reload()
  }

  const remove = async (id: number) => {
    await coursesApi.remove(id)
    await reload()
  }

  return { data, total, page, limit, loading, goToPage, create, update, remove }
}
