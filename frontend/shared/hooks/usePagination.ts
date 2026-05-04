'use client'

import { useState } from 'react'

export const usePagination = (initialLimit = 10) => {
  const [page, setPage] = useState(1)
  const [limit] = useState(initialLimit)

  const goToPage = (p: number) => setPage(p)
  const nextPage = () => setPage((p) => p + 1)
  const prevPage = () => setPage((p) => Math.max(1, p - 1))

  return { page, limit, goToPage, nextPage, prevPage }
}
