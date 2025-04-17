// components/UserInitializer.tsx
"use client"

import useUserStore from '@/state/user_info_state'
import { useEffect } from 'react'


const UserInitializer = () => {
  const {userInfo, setUserInfo } = useUserStore()

  const InitInfo=()=>{
    var username=window.localStorage.getItem("username")
    var storageID=window.localStorage.getItem("storageID")
    if(!username || !storageID){
      console.log("username and storageReference ID not found, SignIn require")
      return
    }
   
    setUserInfo({username,storageID})
  }
  useEffect(() => {
    InitInfo()
   
  }, [])

  return null // doesn’t render anything
}

export default UserInitializer
