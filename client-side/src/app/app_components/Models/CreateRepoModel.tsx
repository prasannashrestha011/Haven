import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { FolderPlus } from "lucide-react";
import { useRepoListStore } from "@/state/repoListStore";

import useUserStore from "@/state/user_info_state";
import toast from "react-hot-toast";
import { SubmitNewRepo } from "@/app/[user]/repositories/api";

export default function CreateRepoModal() {
  const [open, setOpen] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [repoDescription, setRepoDescription] = useState("");
  const [error, setError] = useState(false);
  const { repoList, setRepoList } = useRepoListStore();
  const { userInfo } = useUserStore();
  const [apiMessage, setApiMessage] = useState<string>("");

  const handleClose = () => {
    setOpen(false);
    setRepoName("");
    setRepoDescription("");
    setError(false);
  };

  const handleCreate = async () => {
    if (repoName.trim() !== "" && userInfo?.username) {
      const result = await SubmitNewRepo(
        repoName.trim(),
        userInfo?.username,
        repoDescription,
      );
      const newRepo = result.newRepo;
      if (result.success && newRepo) {
        toast.success(result.message);
        setRepoList([...repoList, newRepo]);
      } else {
        toast.error(result.message);
      }
      handleClose();
    } else {
      setError(true);
    }
  };

  const isCreateButtonDisabled = repoName.trim() === "";

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<FolderPlus />}
        onClick={() => setOpen(true)}
      >
        <span className="text-sm">New repository</span>
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
            }, // Ensure all Typography components inherit
            "& .MuiButton-root": { fontFamily: "Lexend-Regular" }, // Ensure all Button components inherit
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
            Create new repository
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            A repository contains all your project's files, history, and
            configurations.
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Repository name *
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Enter repository name"
              value={repoName}
              onChange={(e) => {
                setRepoName(e.target.value);
                if (error) setError(false);
              }}
              error={error}
              helperText={error ? "Repository name is required" : ""}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, mt: 2 }}>
              Description (optional)
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Enter repository description"
              value={repoDescription}
              onChange={(e) => setRepoDescription(e.target.value)}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
          </Box>

          <Box
            sx={{ my: 3, p: 2, borderRadius: 1, border: "1px solid #a5d6a7" }}
          >
            <Typography variant="body2">
              Repository will be created with default settings. You can
              configure additional settings after creation.
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
              disabled={isCreateButtonDisabled}
              onClick={handleCreate}
              sx={{
                bgcolor: "#2e7d32",
                "&:hover": { bgcolor: "#1b5e20" },
                "&.Mui-disabled": {
                  bgcolor: "#f5f5f5",
                  color: "rgba(0, 0, 0, 0.26)",
                },
              }}
            >
              Create
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
