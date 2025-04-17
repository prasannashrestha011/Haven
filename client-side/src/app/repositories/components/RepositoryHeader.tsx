// src/components/repository/RepositoryHeader.tsx
import React from 'react'
import { Book } from 'lucide-react'

interface RepositoryHeaderProps {
    repoCount: number
}

const RepositoryHeader = ({ repoCount }: RepositoryHeaderProps) => {
    return (
        <div className="py-3 px-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
            <div>
                <h2 className="text-lg font-medium text-white">Repositories</h2>
                <p className="text-xs text-gray-400">{repoCount} {repoCount === 1 ? 'repository' : 'repositories'}</p>
            </div>
            <button className="bg-blue-700 hover:bg-green-800 text-white px-3 py-1 rounded-md text-sm flex items-center font-medium transition-colors">
                <Book className="h-4 w-4 mr-1" />
                New
            </button>
        </div>
    )
}

export default RepositoryHeader