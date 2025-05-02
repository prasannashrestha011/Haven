// src/components/repository/LoadingState.tsx
import React from 'react'

import { AlertCircle } from 'lucide-react'
import { Book } from 'lucide-react'
//loading state
const LoadingState = () => {
    return (
        <div className="flex justify-center items-center h-48 w-full">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    )
}

export default LoadingState


interface ErrorStateProps {
    error: string
    retry: () => void
}
//Error state
const ErrorState = ({ error, retry }: ErrorStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-48 w-full text-red-400 p-4">
            <AlertCircle className="h-5 w-5 mb-2" />
            <p className="text-sm">{error}</p>
            <button 
                onClick={retry}
                className="mt-2 px-3 py-1 bg-gray-800 text-gray-300 rounded-md text-xs hover:bg-gray-700"
            >
                Try Again
            </button>
        </div>
    )
}

export  {ErrorState}



//Empty state
const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center h-48 w-full text-gray-400 p-4">
            <Book className="h-5 w-5 mb-2" />
            <p className="text-sm">No repositories found</p>
        </div>
    )
}

export  {EmptyState}