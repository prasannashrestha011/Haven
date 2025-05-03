// src/components/repository/SortBar.tsx
import React from 'react'
import { ChevronDown, ArrowDownAZ, ArrowUpAZ, Clock } from 'lucide-react'

type SortOption = 'name-asc' | 'name-desc' | 'newest' | 'oldest'

interface SortBarProps {
    sortBy: SortOption
    sortMenuOpen: boolean
    setSortMenuOpen: (isOpen: boolean) => void
    handleSortChange: (option: SortOption) => void
}

const SortBar = ({ sortBy, sortMenuOpen, setSortMenuOpen, handleSortChange }: SortBarProps) => {
    return (
        <div className="border-b border-gray-800 px-4 py-2
            z-10
        bg-gray-900 flex justify-between items-center">
            <div className="relative">
                <button 
                    onClick={() => setSortMenuOpen(!sortMenuOpen)}
                    className="flex items-center bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md text-xs transition-colors"
                >
                    Sort
                    <ChevronDown className="h-3 w-3 ml-1.5" />
                </button>
                
                {sortMenuOpen && (
                    <div className="absolute left-0 top-full mt-1 bg-gray-800 rounded-md shadow-lg z-10 overflow-hidden w-48">
                        <ul className="py-1">
                            <li 
                                className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-700 flex items-center ${sortBy === 'name-asc' ? 'bg-gray-700' : ''}`}
                                onClick={() => handleSortChange('name-asc')}
                            >
                                <ArrowDownAZ className="h-3 w-3 mr-2" />
                                Name (A-Z)
                            </li>
                            <li 
                                className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-700 flex items-center ${sortBy === 'name-desc' ? 'bg-gray-700' : ''}`}
                                onClick={() => handleSortChange('name-desc')}
                            >
                                <ArrowUpAZ className="h-3 w-3 mr-2" />
                                Name (Z-A)
                            </li>
                            <li 
                                className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-700 flex items-center ${sortBy === 'newest' ? 'bg-gray-700' : ''}`}
                                onClick={() => handleSortChange('newest')}
                            >
                                <Clock className="h-3 w-3 mr-2" />
                                Newest
                            </li>
                            <li 
                                className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-700 flex items-center ${sortBy === 'oldest' ? 'bg-gray-700' : ''}`}
                                onClick={() => handleSortChange('oldest')}
                            >
                                <Clock className="h-3 w-3 mr-2" />
                                Oldest
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SortBar