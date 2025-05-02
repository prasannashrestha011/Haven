import useProfileStore from '@/state/profileStore'
import { Edit, FileText } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

const OverViewDisplay = () => {
    const {profileInfo}=useProfileStore()
    if(!profileInfo){
        return<div>No user found</div>
    }
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Profile Info */}
       
          
          {/* Right Column - README Content */}
          <div className="md:w-3/4">
       
            
            {/* Pinned Section */}
            <div className="mb-8">
              {/**header */}
             
                  <span className="text-base text-gray-400 font-medium " >README</span>
                 
              
              
              {/* README Card */}
              <div className="bg-gray-800 border border-gray-700 rounded-md overflow-hidden">
                <div className="flex items-center justify-between bg-gray-800 p-3 border-b border-gray-700">
                 <section className='flex items-center '>
                 <FileText className="w-4 h-4 mr-2 text-gray-400" />
                 <span className="font-medium text-gray-200">{profileInfo.readme.file_name || 'README.md'}</span>
                 </section>
                  <Link href={`/${profileInfo.user.username}/update`}><Edit/></Link>
                </div>
                
                <div className="p-4 bg-gray-800 prose prose-invert max-w-none prose-headings:text-gray-200 prose-a:text-blue-400">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {profileInfo.readme.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default OverViewDisplay