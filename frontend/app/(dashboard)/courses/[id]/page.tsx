'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { coursesApi } from '@lib/api/courses.api'
import { enrollmentsApi } from '@lib/api/enrollments.api'
import { Badge } from '@shared/components/ui/Badge'
import { Table } from '@shared/components/ui/Table'
import { formatDate, formatEnrollmentStatus } from '@shared/utils/format'
import type { Course, Enrollment, EnrollmentStatus } from '@models/api.types'

const statusVariant: Record<EnrollmentStatus, 'success' | 'warning' | 'danger'> = {
  active: 'success',
  inactive: 'warning',
  dropped: 'danger',
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [courseData, enrollmentData] = await Promise.all([
        coursesApi.findOne(Number(id)),
        enrollmentsApi.findByCourse(Number(id)),
      ])
      setCourse(courseData)
      setEnrollments(enrollmentData)
      setLoading(false)
    }
    load()
  }, [id])

  const columns = [
    { key: 'studentId', header: 'Student ID' },
    {
      key: 'enrolledAt',
      header: 'Enrolled At',
      render: (row: Enrollment) => formatDate(row.enrolledAt),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Enrollment) => (
        <Badge variant={statusVariant[row.status]}>{formatEnrollmentStatus(row.status)}</Badge>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{course?.subjectName ?? '...'}</h1>
        <p className="text-sm text-gray-500">
          {course?.academicYear} · Semester {course?.semester}
        </p>
      </div>
      <div>
        <h2 className="mb-3 text-base font-medium text-gray-700">Enrollments</h2>
        <Table
          columns={columns}
          data={enrollments}
          loading={loading}
          emptyText="No enrollments yet"
        />
      </div>
    </div>
  )
}
