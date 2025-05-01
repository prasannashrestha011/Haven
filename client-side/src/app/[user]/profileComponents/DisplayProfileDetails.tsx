"use client"
import { fetchProfileInfo } from '@/app/app_components/initializer_api'
import useProfileStore from '@/state/profileStore'
import { User, Calendar, Clock, Folder, FileText } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const DisplayProfileDetails = () => {
    const params=useParams()
    const user=params.user as string
    const repo=params.repo as string 
    const {profileInfo,setProfileInfo}=useProfileStore()
      const fetchUser = async () => {
      
          const response = await fetchProfileInfo(user)
      
          if (response.data &&response.success) {
            console.log("Your fetched user ffff", response.data)
            setProfileInfo(response.data)
          }
        
      }
      useEffect(()=>{
        fetchUser()
      },[])
      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      }
      if (!profileInfo) {
        return null
      }
    if (repo!=null){
      return(<div></div>)
    }
    
     
  return (
    <div className="md:w-1/4 bg-inherit">
    {/* Avatar */}
    <div className="mb-4">
      <div className="w-full max-w-[296px] aspect-square bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <User size={80} className="text-gray-400" />
      </div>
      
      <h1 className="text-2xl font-bold mb-1">{profileInfo.user.username}</h1>
      <p className="text-gray-400 text-lg mb-4">@{profileInfo.user.userID}</p>
    </div>
    
    {/* Bio Section */}
    <div className="mb-6">
      <p className="text-gray-300 mb-4">Developer profile</p>
      
      <button className="w-full py-1 px-3 bg-gray-800 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition">
        Edit profile
      </button>
    </div>
    
    {/* Profile Metadata */}
    <div className="space-y-2 text-sm">
      <div className="flex items-center text-gray-400">
        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
        <span>Joined {formatDate(profileInfo.user.created_at)}</span>
      </div>
      <div className="flex items-center text-gray-400">
        <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
        <span>Updated {formatDate(profileInfo.user.updated_at)}</span>
      </div>
      <div className="flex items-center text-gray-400">
        <Folder className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="truncate" title={profileInfo.user.folder_ref}>Folder: {profileInfo.user.folder_ref}</span>
      </div>
      <div className="flex items-center text-gray-400">
        <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="truncate" title={profileInfo.user.readme_ref}>Readme: {profileInfo.user.readme_ref}</span>
      </div>
    </div>
  </div>
  )
}

export default DisplayProfileDetails