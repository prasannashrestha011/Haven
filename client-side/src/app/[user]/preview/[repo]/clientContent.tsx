"use client";

import { usePathname,useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import useProfileStore from '@/state/profileStore';
import { FetchRepoStructure } from '../../repositories/[code]/[...params]/api';
import { Repository, RepoExplorer } from '../../repositories/components/FileExplorer';

export const RepoFileExplorer = () => {
  const params=useParams()
  const user=params.user as string
  const repo=params.code||params.repo as string
  const [treeData, setTreeData] = useState<Repository>();
  const {profileInfo}=useProfileStore()

  const InitFileStructure = async () => {
    console.log("Running...")
    console.log(repo)
    if (!repo) return;
    try {
      const structureData = await FetchRepoStructure(user, repo as string);
      console.log(structureData);
      if (!structureData) return;
      setTreeData(structureData);
    } catch (error) {
      console.error("Error fetching repo structure:", error);
    }
  };

  useEffect(() => {
    InitFileStructure();
  }, [user,repo]);

  return (
    <div className=''>
   
      {treeData && (
        <RepoExplorer 
          repo={treeData}
        />
      )}
    </div>
  );
};

export default RepoFileExplorer;