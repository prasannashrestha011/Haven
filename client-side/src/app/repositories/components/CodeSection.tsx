"use client"
import { Box, Popper, ClickAwayListener, Paper, Typography, IconButton, Tooltip, Snackbar, Alert, Button } from '@mui/material'
import { X, Copy } from 'lucide-react'
import React, { useState, MouseEvent } from 'react'
import { Code } from "lucide-react";
import useSelectedRepoStore from '@/state/SelectedRepoState';
interface CodeProp {
  repoPath: string
}

const CodeHandler = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [copySuccess, setCopySuccess] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const {selectedRepo}=useSelectedRepoStore()
  const cloneUrl = selectedRepo?.repo_path
  
  const handleCopyToClipboard = (): void => {
    navigator.clipboard.writeText(cloneUrl??"")
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
    <div>
    <div className='flex'>

      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleClick}
      >
            <Code size={16} className="mr-2" />
        Code
      </Button>
    </div>
      
      <Popper 
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
        ]}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper 
            elevation={3}
            sx={{
              width: 320,
              borderRadius: 2,
              p: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2" fontSize={16}>
                Clone this repository
              </Typography>
              <IconButton onClick={handleClose} size="small" aria-label="close">
                <X size={18} />
              </IconButton>
            </Box>
            
            <Box 
              p={2}
              bgcolor="#f5f5f5"
              borderRadius={1}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="body2"
                fontFamily="monospace"
                sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '90%'
                }}
              >
                {cloneUrl}
              </Typography>
              <Tooltip title="Copy to clipboard">
                <IconButton 
                  onClick={handleCopyToClipboard}
                  size="small"
                  aria-label="copy to clipboard"
                >
                  <Copy size={16} />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary" fontSize={12}>
                Use Git or checkout with SVN using the web URL.
              </Typography>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
      
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          URL copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  )
}

export default CodeHandler