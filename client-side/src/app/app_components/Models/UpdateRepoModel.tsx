import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { Edit } from "lucide-react";
import { useRepoListStore } from "@/state/repoListStore";
import useUserStore from "@/state/user_info_state";
import toast from "react-hot-toast";
import { RepoStruct, SubmitRepoUpdate } from "@/app/repositories/api";

export default function UpdateRepoModal({ repo }: { repo: RepoStruct }) {
  const [open, setOpen] = useState(false);
  const [newRepoName, setNewRepoName] = useState(repo?.repoName || "");
  const [newRepoDescription, setNewRepoDescription] = useState(
    repo?.des || "",
  );
  const {repoList,setRepoList}=useRepoListStore()
  const { userInfo } = useUserStore();

  const handleClose = () => {
    setOpen(false);
    setNewRepoName(repo?.repoName || "");
    setNewRepoDescription(repo?.des || "");
  };

  const handleUpdate = async () => {
    console.log(newRepoName)
    if (userInfo?.username) {
      if (
        (newRepoName !== repo.repoName && newRepoName.trim() !== "") ||
        newRepoDescription !== repo.des
      ) {
          var response = await SubmitRepoUpdate({
            repoID: repo.repoID,
            newRepoName: newRepoName,
            newRepoDes: newRepoDescription
          });
          if(response.success && response.updatedRepo){
            const {updatedRepo}=response

            const updatedList = repoList.map(repo =>
              repo.repoID === updatedRepo.repoID ? updatedRepo : repo
            );
      
            setRepoList(updatedList)

            toast.success("Repository successfulyy updated")
          }

        }
   
      handleClose();
    }
  };

  const isUpdateButtonDisabled =
    (newRepoName.trim() === repo.repoName || newRepoName.trim() === "") &&
    newRepoDescription === repo.des;

  return (
    <>
      <Button
  
        color="primary"
        size="small"
        startIcon={<Edit />}
        onClick={() => setOpen(true)}
      >
        <span className="text-sm">Edit</span>
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: 400,
            maxWidth: "90%",
            backgroundColor: "#111827",
            "& .MuiTypography-root": {
              fontFamily: "Lexend-Regular",
              color: "white",
            },
            "& .MuiButton-root": { fontFamily: "Lexend-Regular" },
            "& .MuiInputBase-root": {
              fontFamily: "Lexend-Regular",
              bgcolor: "#111827",
              color: "whitesmoke",
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#2e7d32", fontWeight: 600, mb: 2 }}
            className="Lexend-Bold"
          >
            Update repository
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            Update your repository details. Leave fields unchanged if you don't
            want to modify them.
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Repository name (optional)
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Enter new repository name"
              value={newRepoName}
              onChange={(e) => setNewRepoName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, mt: 2 }}>
              Description (optional)
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Enter new repository description"
              value={newRepoDescription}
              onChange={(e) => setNewRepoDescription(e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
          </Box>

          <Box
            sx={{ my: 3, p: 2, borderRadius: 1, border: "1px solid #a5d6a7" }}
          >
            <Typography variant="body2">
              At least one field must be changed to update the repository.
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ borderColor: "#d0d7de", color: "text.primary" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={isUpdateButtonDisabled}
              onClick={handleUpdate}
              sx={{
                bgcolor: "#2e7d32",
                "&:hover": { bgcolor: "#1b5e20" },
                "&.Mui-disabled": {
                  bgcolor: "#f5f5f5",
                  color: "rgba(0, 0, 0, 0.26)",
                },
              }}
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
