import { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Stack } from "@mui/material";
import { Trash2 } from "lucide-react";
import { SubmitRepoDeletion } from "@/app/repositories/api";
import useUserStore from "@/state/user_info_state";
import toast from "react-hot-toast";
import { useRepoListStore } from "@/state/repoListStore";

export default function TrashWithModal({repoName,repoPath}:{repoName:string,repoPath:string}) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState(false);
  const {userInfo}=useUserStore() 
  const {repoList,setRepoList}=useRepoListStore()

  const handleClose = () => {
    setOpen(false);
    setConfirmText("");
    setError(false);
  };

  const handleDelete = async() => {
    if (confirmText === repoName&&userInfo?.username) {
      
      const response=await SubmitRepoDeletion(repoPath)
      if(response.success){
        toast.success(response.message)
        setRepoList(repoList.filter(repo=>repo.repoName!=repoName))
      }else{
        toast.error(response.message)
      }
      handleClose();
    } else {
      setError(true);
    }
  };

  const isDeleteButtonDisabled = confirmText !== repoName;

  return (
    <>
      <Trash2 color="red" onClick={() => setOpen(true)} style={{ cursor: "pointer" }} />

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: 400,
          maxWidth: '90%'
        }}>
          <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600, mb: 2 }}>
            Delete repository
          <div>{repoPath}</div>
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            This action cannot be undone. This will permanently delete the 
            <Typography component="span" sx={{ fontWeight: 600 }}> {repoName} </Typography>
            repository, wiki, issues, comments, packages, secrets, workflows, and releases.
          </Typography>
          
          <Box sx={{ my: 3, p: 2, bgcolor: '#ffebe9', borderRadius: 1, border: '1px solid #f0a6a6' }}>
            <Typography variant="body2">
              Please type <Typography component="span" sx={{ fontWeight: 600 }}>{repoName}</Typography> to confirm.
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder={`Type "${repoName}" to confirm`}
            value={confirmText}
            onChange={(e) => {
              setConfirmText(e.target.value);
              if (error) setError(false);
            }}
            error={error}
            helperText={error ? "Repository name doesn't match" : ""}
            sx={{ mb: 3 }}
          />
          
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              variant="outlined" 
              onClick={handleClose}
              sx={{ borderColor: '#d0d7de', color: 'text.primary' }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="error"
              disabled={isDeleteButtonDisabled}
              onClick={handleDelete}
              sx={{ 
                bgcolor: '#d32f2f',
                '&:hover': { bgcolor: '#b71c1c' },
                '&.Mui-disabled': { bgcolor: '#f5f5f5', color: 'rgba(0, 0, 0, 0.26)' }
              }}
            >
             Delete
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}