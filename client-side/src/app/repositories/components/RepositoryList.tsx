// src/components/repository/RepositoryList.tsx
import React from "react";
import { Book } from "lucide-react";
import moment from "moment";
import { RepoStruct } from "../api";
import Link from "next/link";

interface RepositoryListProps {
  repositories: RepoStruct[];
}
import { Trash2 } from "lucide-react";
import DeleteModal from "@/app/app_components/Models/CreateRepoModel";
import TrashWithModal from "@/app/app_components/Models/CreateRepoModel";
const RepositoryList = ({ repositories }: RepositoryListProps) => {
  return (
    <div className="overflow-auto flex-1">
      <ul className="divide-y divide-gray-800">
        {repositories.map((repo, idx) => (
          <li
            key={idx}
            className="px-4 py-3 flex justify-between items-center hover:bg-gray-800 transition-colors"
          >
            <Link href={`/repositories/${repo.repoName}`}>
              <div className="flex items-center mb-1.5">
                <Book className="h-4 w-4 mr-2 text-gray-500" />
                <h3 className="text-blue-400 font-medium text-sm hover:underline cursor-pointer">
                  {repo.repoName}
                </h3>
              </div>
              <div className="ml-6 text-gray-400 text-xs">
                {moment(repo.created_at).fromNow()}
              </div>
            </Link>
            <TrashWithModal repoName={repo.repoName} key={idx} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepositoryList;
