"use client"
import { Input } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useState } from 'react'

const SearchInput = () => {
  const router=useRouter()
  const [search,setSearch]=useState<string>("")
  const [type,setType]=useState<string>("repository")
  const handleSearchChange=(e:ChangeEvent<HTMLInputElement>)=>{
        setSearch(e.target.value)
  }
  const handleSearchSubmission=(e:FormEvent)=>{
    e.preventDefault()
    const url=`/search/?q=${search}&type=${type}`
    router.push(url)
  }
    return (
    <div className='bg-gray-950 py-1 border-b border-gray-800'>
        <form onSubmit={handleSearchSubmission} className='flex justify-center items-center'>
        <Input value={search} onChange={handleSearchChange}
        placeholder='search'
        className='bg-gray-800 p-1 
        px-4
        w-5/12 rounded-md text-slate-50' style={{color:'white'}}/>
        </form>
    </div>
  )
}

export default SearchInput