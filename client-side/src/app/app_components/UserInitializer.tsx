// components/UserInitializer.tsx
"use client"

import useUserStore from '@/state/user_info_state'
import { useEffect } from 'react'
import { fetchUserInfo } from './initializer_api'
import { useRouter } from 'next/navigation'


const UserInitializer = () => {
  const {userInfo, setUserInfo } = useUserStore()
  const router=useRouter()
  const InitInfo=async()=>{
    var username=window.localStorage.getItem("username")
   
    if(!username){
      console.log("username and storageReference ID not found, SignIn require")
      return
    }
    const fetchedUser=await fetchUserInfo(username)
    if(!fetchedUser){
      console.log("No user details...")
      router.push("/accounts/signIn")
      return
    }
    setUserInfo(fetchedUser)
  }
  useEffect(() => {
    InitInfo()
   
  }, [])

  return null // doesn’t render anything
}

export default UserInitializer
