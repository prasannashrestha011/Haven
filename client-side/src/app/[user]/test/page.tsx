"use client"
import { useSearchParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const query=useSearchParams()
    const tab=query.get('tab')
    if(tab)
  return (
    <div>page</div>
  )
}

export default page