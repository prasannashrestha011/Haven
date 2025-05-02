"use client"
import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import useProfileStore from '@/state/profileStore'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { UpdateReadMeFile } from './api'
import { useRouter } from 'next/navigation'
export default function UpdateReadme() {
  const { profileInfo } = useProfileStore()
  const [content, setContent] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const router=useRouter()
  // Initialize content from profileInfo when component mounts
  useEffect(() => {
    if (profileInfo?.readme?.content) {
      setContent(profileInfo.readme.content)
    }
  }, [profileInfo?.readme?.content])

  const handleContentChange = (e:ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handleTabChange = (preview:boolean) => {
    setIsPreview(preview)
  }

  const handleSubmit = async(e:FormEvent) => {
    if(!profileInfo?.user.readme_ref){
        console.log("not found")
        return
    }
    e.preventDefault()
    const updatedContent=await UpdateReadMeFile(profileInfo.user.readme_ref,profileInfo.readme.file_name,content)
    setContent(updatedContent as string )
    router.push(`/${profileInfo.user.username}`)
  }

  return (
    <form>
            <div className="w-full bg-inherit h-screen
            mx-auto  rounded-md overflow-hidden ">
      {/* Header with tabs */}
      <div className=" ">
        <div className="flex ">
          <button
            type='button'
            className={`px-4 py-2 text-sm font-medium ${!isPreview ? 'border-b-2 border-orange-500 text-gray-400' : 'text-gray-200 hover:text-gray-200'}`}
            onClick={() => handleTabChange(false)}
          >
            Edit
          </button>
          <button
          type='button'
            className={`px-4 py-2 text-sm font-medium ${isPreview ? 'border-b-2 border-orange-500 text-gray-200' : 'text-gray-600 hover:text-gray-500'}`}
            onClick={() => handleTabChange(true)}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="p-4">
        {!isPreview ? (
          <textarea
            className="w-full h-64 p-3 text-slate-200 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
            value={content}
            onChange={handleContentChange}
            placeholder="# Hello World
            
This is your README. You can use markdown here."
          />
        ) : (
          <div className="w-full h-64 p-3 text-slate-200 rounded-md overflow-auto  prose prose-sm max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}> 
            {content}
          </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Footer with action buttons */}
      <div className=" p-4 flex justify-end ">
        <button
          type="button"
          className="mr-2 px-4 py-2 text-sm font-medium text-gray-700  rounded-md "
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Update README
        </button>
      </div>
    </div>
    </form>
  )
}