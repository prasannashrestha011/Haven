import { RepoStruct } from "@/app/repositories/api";
import React from 'react';
import moment from 'moment';
import { Calendar, Clock, BookOpen } from "lucide-react";

export default function renderSearchRepositoryList(repoList: RepoStruct[]) {
  return (
    <div className="space-y-4 bg-inherit">
      {repoList.map((repo, idx) => (
        <div key={repo.repoID || idx} className="repo-item border border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex h-20 justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                <a href={`/repositories/preview/${repo.repoName}`} className="flex items-center gap-2">
                  <BookOpen size={18} className="text-blue-500" />
              
                  {repo.owner}/{repo.repoName}
                </a>
              </h3>
              
              <p className="text-sm text-slate-200 mt-2">
                {repo.des || "No description provided"}
              </p>
              
              <div className="flex flex-wrap items-center mt-3 gap-4  text-slate-200">
                <div className="flex items-center text-sm   ">
                  <Calendar size={16} className="mr-1" />
                  <span>Created {moment(repo.created_at).fromNow()}</span>
                </div>
                
                <div className="flex items-center text-sm ">
                  <Clock size={16} className="mr-1" />
                  <span>Updated {moment(repo.updated_at).fromNow()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}