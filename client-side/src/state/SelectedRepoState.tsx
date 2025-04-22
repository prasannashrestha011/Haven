import { RepoStruct } from "@/app/repositories/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectedRepoState{
    selectedRepo:RepoStruct | null
    setSelectedRepo:(selectedRepo:RepoStruct)=>void
}

const useSelectedRepoStore=create<SelectedRepoState>()(
    persist((set)=>({
        selectedRepo:null,
        setSelectedRepo:(selectedRepo:RepoStruct)=>set({selectedRepo})
    }),
    {
        name:"selected Repo"
    }
)
)
export default useSelectedRepoStore