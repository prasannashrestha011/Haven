// src/components/repository/RepositoryHeader.tsx
import React from 'react'
import { Book } from 'lucide-react'
import CreateRepoModal from '@/app/app_components/Models/CreateRepoModel'

interface RepositoryHeaderProps {
    repoCount: number
    username:string 
    queryUsername:string
}

const RepositoryHeader = ({ repoCount,username,queryUsername }: RepositoryHeaderProps) => {
    return (
        <div className="py-3 px-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-medium text-white">Repositories</h2>
                <p className="text-xs text-gray-400">{repoCount} {repoCount === 1 ? 'repository' : 'repositories'}</p>
            </div>
        
              
               {username==queryUsername&& <CreateRepoModal/>}
       
        </div>
    )
}

export default RepositoryHeader