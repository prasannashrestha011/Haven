"use client"
import usePathStore from '@/state/path_state'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FetchFileContent, FileContentResponse } from './api'
import useUserStore from '@/state/user_info_state'
import LoadingState from '@/app/components/LoadingState'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Post() {
    const pathName = usePathname()
    const filePath = pathName.split('/').slice(2).join('/')
    
    const { userInfo } = useUserStore()
    const [fileRender, setFileRenderer] = useState<FileContentResponse>()
    
    useEffect(() => {
        const RenderFileContent = async () => {
            // Only proceed if storageID exists
            if (!userInfo?.storageID) {
                console.log("StorageID not loaded yet, waiting...")
                return
            }
            
            console.log("User storage id ", userInfo.storageID)
            
            const file_path = `/users/${userInfo.storageID}/${filePath}`
            
            const contentBody = await FetchFileContent(file_path)
            
            if (!contentBody) {
                console.log("No file content")
                return
            }
            
            setFileRenderer(contentBody)
        }
        
        console.log("Running effect check...")
        RenderFileContent()
    }, [userInfo, filePath]) // Include both userInfo and filePath in dependencies
    
    return (
        <div className="w-full h-screen overflow-y-scroll">
            {fileRender ? (
                <div className="h-full w-full">
                    <SyntaxHighlighter
                        language="go"
                        style={vscDarkPlus}
                        wrapLongLines
                        customStyle={{
                            height: '100%',
                            width: '100%',
                            margin: 0,
                        }}
                    >
                        {fileRender.message.content}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <div className="w-full h-screen border border-blue-900 -z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <LoadingState />
                </div>
            )}
        </div>
    );
}