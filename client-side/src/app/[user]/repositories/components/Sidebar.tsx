// src/components/repository/Sidebar.tsx
import React from 'react'
import { User } from 'lucide-react'

interface SidebarProps {
    username: string
}

const Sidebar = ({ username }: SidebarProps) => {
    return (
        <div className="w-64 border-r border-gray-800 bg-gray-950 p-4">
            <div className="flex items-center mb-6">
                <div className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    <User className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-white font-medium">{username}</span>
            </div>
            
            <div className="text-sm text-gray-400 font-medium">Repositories</div>
        </div>
    )
}

export default Sidebar