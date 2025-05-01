"use client"
import React, { useState, MouseEvent } from 'react'
import useUserStore from '@/state/user_info_state'
import { useParams } from 'next/navigation'
import useSelectedRepoStore from "@/state/SelectedRepoState"
import { 
  Box, 
  Button, 
  Typography, 
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Popper,
  Paper,
  ClickAwayListener,
  PopperPlacementType
} from '@mui/material'
import { Copy, X } from 'lucide-react'

// Define interfaces for your component props and state if needed
interface UserInfo {
  username?: string;
  // Add other properties as needed
}

interface SelectedRepo {
  repoName?: string;
  des?: string;
  // Add other properties as needed
}

interface Params {
  repo?: string;
  // Add other URL params as needed
}

export const DisplayRepoDetails: React.FC = () => {

  const { selectedRepo } = useSelectedRepoStore() as { selectedRepo: SelectedRepo }
  const params = useParams()
  const username=params.user as string
  const repoName = params.repo || selectedRepo?.repoName
  
  const [open, setOpen] = useState<boolean>(false)
  const [copySuccess, setCopySuccess] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  
  
  
  const handleCopyToClipboard = (): void => {
    navigator.clipboard.writeText("htt")
    setCopySuccess(true)
  }
  
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
  }
  
  const handleClose = (): void => {
    setOpen(false)
  }
  
  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
          <span className="text-blue-600 hover:underline cursor-pointer">
            {username}
          </span>
          <span className="text-gray-500">/</span>
          <span className="text-black">
            {repoName || 'Repository'}
          </span>
        </div>
   
      </div>
      
      {selectedRepo?.des && (
        <p className="mt-1 text-sm text-gray-600">
          {selectedRepo.des}
        </p>
      )}
   
      
    </div>
  )
}