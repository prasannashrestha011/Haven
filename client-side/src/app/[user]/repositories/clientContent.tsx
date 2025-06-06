// src/components/repository/RepoclientContent.tsx
"use client"
import React, { useEffect, useState } from 'react'
import { GetRepositoryList, RepoStruct } from './api'
import useUserStore from '@/state/user_info_state'

import RepositoryHeader from './components/RepositoryHeader'

import LoadingState, { EmptyState, ErrorState } from '../components/LoadingState'


import RepositoryList from './components/RepositoryList'
import Sidebar from './components/Sidebar'
import SortBar from './components/SortBar'
import { useRepoListStore } from '../../state/repoListStore'
import {Toaster} from 'react-hot-toast'
const RepoclientContent = () => {
    const { userInfo } = useUserStore()
 
    const {repoList,setRepoList}=useRepoListStore()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sortMenuOpen, setSortMenuOpen] = useState(false)
    const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'newest' | 'oldest'>('newest')
    
    const fetchRepoList = async () => {
        if (!userInfo?.username) return
        
        setIsLoading(true)
        setError(null)
        
        try {
            console.log("Fetching user repo-> ", userInfo.username)
            const repos = await GetRepositoryList(userInfo.username)
            
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
        
        return <RepositoryList repositories={sortedRepos} />
    }
    
    return (
        <div className="w-full h-screen bg-gray-900 text-gray-100 flex">
            <Toaster position='top-center'/>
            <Sidebar username={userInfo?.username || 'User'} />
            
            <div className="flex-1 overflow-hidden flex flex-col">
                <RepositoryHeader repoCount={repoList.length} />
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

export default RepoclientContent