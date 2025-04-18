"use client"
import useUserStore from '@/state/user_info_state'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FetchFileContent, FileContentResponse } from './api'


const FilePage = () => {
  const params=useParams()
  const file=params.file as string
  const {userInfo}=useUserStore()
  const [fileRender,setFileRenderer]=useState<FileContentResponse>()
  const file_path=`/users/${userInfo?.storageID}/${file}`
  const RenderFileContent=async()=>{
     
     const contentBody=await FetchFileContent(file_path)
     if(!contentBody){
       console.log("No file content")
       return
     }
     setFileRenderer(contentBody)
  }
  if(!file){
    return(
      <div>No file path provided</div>
    )
  }
  useEffect(()=>{RenderFileContent()},[userInfo])
    return (
    <div>
    {file}
    <div>
      {fileRender?.message && (
        <div>
          <p>File Name: {fileRender.message.file_name}</p>
          <p>Content: {fileRender.message.content}</p>
        </div>
      )}
      </div>

    </div>
  )
}

export default FilePage