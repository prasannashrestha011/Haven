"use client"
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const params=useParams()
  return (
    <div>xxx{params.repo}</div>
  )
}

export default page