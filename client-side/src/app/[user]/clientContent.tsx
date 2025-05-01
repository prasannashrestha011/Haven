"use client"
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import {  FileText, Link as LinkIcon } from 'lucide-react'
import LoadingState from '@/app/components/LoadingState'

import useProfileStore from '@/state/profileStore'
import OverViewDisplay from './profileComponents/tabs/OverViewDisplay'
import DisplayProfileDetails from './profileComponents/DisplayProfileDetails'
import DisplayUserRepoList from './profileComponents/tabs/DisplayRepoList'

const ProfileClientContent = () => {
  const params = useParams()
  const user = params.user as string
  const query=useSearchParams()
  const tab=query.get('tab')
  const {profileInfo}=useProfileStore()
 

 

  if (!profileInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <LoadingState />
      </div>
    )
  }

 
 

  return (
    <div className="w-full bg-gray-900 min-h-screen text-slate-50">
      {tab==null&&<OverViewDisplay/>}
      {tab=="repo"&&<DisplayUserRepoList/>}
    </div>
  )
}

export default ProfileClientContent