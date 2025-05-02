"use client"
import { Input } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Search } from 'lucide-react'
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
    <div className=' py-1 flex justify-end'>
        <form onSubmit={handleSearchSubmission} className='max-w-64 flex items-center gap-1'>
          <Search className='text-amber-50'/>
        <Input value={search} onChange={handleSearchChange}
        placeholder='search'
        className='bg-gray-800 p-1 
        px-4
       rounded-sm text-slate-50' style={{color:'white'}} sx={{height:'1.8rem'}}/>
        </form>
    </div>
  )
}

export default SearchInput