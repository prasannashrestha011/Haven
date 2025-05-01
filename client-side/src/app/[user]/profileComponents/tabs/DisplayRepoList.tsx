
"use client"
import LoadingState, { ErrorState, EmptyState } from '@/app/components/LoadingState'
import { useRepoListStore } from '@/state/repoListStore'
import useUserStore from '@/state/user_info_state'

import React, { useEffect, useState } from 'react'

import {Toaster} from 'react-hot-toast'


import {  useParams, useSearchParams } from 'next/navigation'
import { GetRepositoryList } from '@/app/repositories/api'
import RepositoryHeader from '@/app/repositories/components/RepositoryHeader'
import RepositoryList from '@/app/repositories/components/RepositoryList'
import SortBar from '@/app/repositories/components/SortBar'
import Sidebar from '@/app/repositories/components/Sidebar'

const DisplayUserRepoList = () => {
    const params=useParams()
    const username=params.user as string
    const { userInfo } = useUserStore()
    const {repoList,setRepoList}=useRepoListStore()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sortMenuOpen, setSortMenuOpen] = useState(false)
    const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'newest' | 'oldest'>('newest')
    
    const fetchRepoList = async () => {
        if (!username) return
        
        setIsLoading(true)
        setError(null)
        
        try {
            console.log("Fetching user repo-> ",username)
            const repos = await GetRepositoryList(username)
            
            setRepoList(repos)
        } catch (err) {
            setError("Failed to load repositories")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }
    
    useEffect(() => {
        fetchRepoList()
    }, [userInfo])
    
    // Sort repositories based on the current sort criteria
    const sortedRepos = [...repoList].sort((a, b) => {
        switch (sortBy) {
            case 'name-asc':
                return a.repoName.localeCompare(b.repoName)
            case 'name-desc':
                return b.repoName.localeCompare(a.repoName)
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            case 'oldest':
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            default:
                return 0
        }
    })
    
    const handleSortChange = (option: typeof sortBy) => {
        setSortBy(option)
        setSortMenuOpen(false)
    }
    
    const renderContent = () => {
        if (isLoading) return <LoadingState />
        if (error) return <ErrorState error={error} retry={fetchRepoList} />
        if (repoList.length === 0) return <EmptyState />
        
        return <RepositoryList repositories={sortedRepos} queryUsername={username}/>
    }
    
    return (
        <div className="w-full h-screen bg-gray-900 text-gray-100 flex">
            <Toaster position='top-center'/>
           
            
            <div className="flex-1 overflow-hidden flex flex-col">
                <RepositoryHeader repoCount={repoList.length} queryUsername={username} username={userInfo?.username as string} />
                <SortBar 
                    sortBy={sortBy} 
                    sortMenuOpen={sortMenuOpen}
                    setSortMenuOpen={setSortMenuOpen}
                    handleSortChange={handleSortChange}
                />
                
                {renderContent()}
                
                {sortMenuOpen && (
                    <div 
                        className="fixed inset-0 z-0" 
                        onClick={() => setSortMenuOpen(false)}
                    ></div>
                )}
            </div>
        </div>
    )
}

export default DisplayUserRepoList