import React from 'react'
import SearchInput from '../search/searchInput'
import { ProfileTabs } from './Tabs'

const Nav = () => {
  return (
    <div className="bg-gray-950">
    <SearchInput/>
    <ProfileTabs/>
    </div>
  )
}

export default Nav