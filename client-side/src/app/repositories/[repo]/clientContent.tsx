"use client"
import React from 'react'
import useUserStore from '@/state/user_info_state'
import { useParams } from 'next/navigation'

export const DisplayUserName = () => {
    const {userInfo}=useUserStore()
  return (
    <span>{userInfo?.username}</span>
  )
}
export const DisplayRepoName=()=>{
    const params=useParams()
    const repoName=params.repo 
    return(
        <span>{repoName}</span>
    )
}


