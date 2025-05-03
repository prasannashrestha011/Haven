
import React from "react";
import { Book } from "lucide-react";
import moment from "moment";
import { RepoStruct } from "../api";
import Link from "next/link";

interface RepositoryListProps {
  repositories: RepoStruct[];
  queryUsername:string
}

import SettingsMenu from "@/app/app_components/Models/SettingModel";

import useSelectedRepoStore from "@/state/SelectedRepoState";
import useUserStore from "@/state/user_info_state";
import { useParams } from "next/navigation";
import useProfileStore from "@/state/profileStore";
const RepositoryList = ({ repositories ,queryUsername}: RepositoryListProps) => {
  const params=useParams()
  const user=params.user
  const {setSelectedRepo}=useSelectedRepoStore()
  const {profileInfo}=useProfileStore()
  return (
    <div className="overflow-auto flex-1">
      <ul className="divide-y divide-gray-800">
        {repositories.map((repo, idx) => (
          <li
            key={idx}
            className="px-4 py-3 flex justify-between items-center hover:bg-gray-800 transition-colors"
          >
            <Link href={`/${user}/preview/${repo.repoName}`} className="w-full" onClick={()=>setSelectedRepo(repo)}>
              <div className="flex flex-col items-start mb-1.5">
                <div className="flex items-center ">
                  <Book className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="z-10 text-blue-400  text-xl font-bold hover:underline cursor-pointer">
                    {repo.repoName}
                  </span>
                </div>
                <span className="text-sm ml-6 my-auto text-gray-500">
                  {repo.des}
                </span>
              </div>
              <div className="ml-6 text-gray-400 text-xs">
                {moment(repo.created_at).fromNow()}
              </div>
            </Link>
            {profileInfo?.user?.username==queryUsername&&
            <div className="z-10">
            <SettingsMenu  repo={repo}/>
            </div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepositoryList;
