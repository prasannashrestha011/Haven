import { RepoStruct } from "@/app/repositories/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

 interface RepoListState{
    repoList:RepoStruct[]
    setRepoList:(repoList:RepoStruct[])=>void
 }

export const useRepoListStore=create<RepoListState>()(
    persist(
        (set)=>({
            repoList:[],
            setRepoList:(repoList:RepoStruct[])=>set({repoList})
        }),
        {
            name:"repo-store"
        }
    )
)