"use client"
import { fetchUserInfo } from '@/app/app_components/initializer_api'
import { UserInfoState } from '@/state/user_info_state'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ProfileClientContent = () => {
    const params=useParams()
    const user=params.user as string
    const [userInfo,setUserInfo]=useState<UserInfoState>()
    const [error,setError]=useState<string>("")
    const fetchUser=async()=>{
       if(!user) return 
       const response=await fetchUserInfo(user)
       if(!response.success && response.err){
          setError(response.err as string)
          return
       }
       if(response.data){
        setUserInfo(response.data)
       }
    }
    useEffect(()=>{
        fetchUser()
    },[userInfo])
  return (
    <div>
      {error&&<span>{error}</span>}
    </div>
  )
}

export default ProfileClientContent