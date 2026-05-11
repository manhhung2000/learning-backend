'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { usersApi, CognitoUser, CreateUserPayload } from '@lib/api/users.api'

export const useUsers = () => {
  const [data, setData] = useState<CognitoUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = async () => {
    setLoading(true)
    try {
      const users = await usersApi.findAll()
      setData(users)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  const extractError = (err: unknown) =>
    axios.isAxiosError(err) ? (err.response?.data?.message ?? err.message) : 'Something went wrong'

  const create = async (payload: CreateUserPayload) => {
    setError(null)
    try {
      await usersApi.create(payload)
      await reload()
    } catch (err) {
      setError(extractError(err))
      throw err
    }
  }

  const update = async (
    username: string,
    payload: { name?: string; role?: string; file?: File | null },
  ) => {
    setError(null)
    try {
      await usersApi.update(username, payload)
      await reload()
    } catch (err) {
      setError(extractError(err))
      throw err
    }
  }

  const remove = async (username: string) => {
    setError(null)
    try {
      await usersApi.remove(username)
      await reload()
    } catch (err) {
      setError(extractError(err))
      throw err
    }
  }

  return { data, loading, error, create, update, remove }
}
