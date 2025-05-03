"use client"
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FetchSearchedRepository } from './apis'

import { UserStruct } from '@/state/user_info_state'
import LoadingState from '../ui_components/LoadingState'
import renderSearchRepositoryList from './search_types/RepositoryResults'
import { RepoStruct } from '../[user]/repositories/api'

const SearchContent = () => {
    const searchParams=useSearchParams()
    const q=searchParams.get('q') as string 
    const type=searchParams.get('type') as string 
    const [searchResult,setSearchResult]=useState<UserStruct[]|RepoStruct[]|undefined>()
    const SubmitSearchRequest=async()=>{
        if(type==="repository"){
            const repoList=await FetchSearchedRepository(q )
            setSearchResult(repoList as RepoStruct[])
        }else{
            setSearchResult(undefined)
        }
    }
    const isRepoStructArray=(arr:RepoStruct[]|UserStruct[]): arr is RepoStruct[]=>{
        return arr.length > 0 && (arr[0] as RepoStruct).repoID !== undefined
    }
    const isUserStructArray=(arr:RepoStruct[]|UserStruct[]):arr is UserStruct[]=>{
        return arr.length > 0 && (arr[0] as UserStruct).username !== undefined
    }
  
    
    useEffect(()=>{
        SubmitSearchRequest()
    },[q,type])
    return (
    <div className='bg-[#0D1117] h-screen'>
        {searchResult===undefined?(
            <LoadingState/>
        ):isRepoStructArray(searchResult)?(
            <div className='p-2'>
            {renderSearchRepositoryList(searchResult)}
            </div>
        ):
        (
            <div>No results found</div>
        )}
    </div>
  )
}

export default SearchContent