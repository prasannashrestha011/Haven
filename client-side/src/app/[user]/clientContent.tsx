"use client"
import { useParams, useSearchParams } from 'next/navigation'
import React from 'react'

import LoadingState from '@/app/ui_components/LoadingState'

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
    <div className="w-full bg-gray-900 min-h-screen text-slate-50 flex p-5">
        <DisplayProfileDetails/>
      <div className='flex-1'>
      {tab==null&&<OverViewDisplay/>}
      {tab=="repo"&&<DisplayUserRepoList/>}
      </div>
    </div>
  )
}

export default ProfileClientContent