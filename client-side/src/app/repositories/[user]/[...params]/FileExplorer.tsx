"use client";
import useUserStore from '@/state/user_info_state';
import { usePathname,useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {  FetchRepoStructure, Repository } from '../../../repositories/[user]/[...params]/api';
import { RepoExplorer } from '../../../repositories/components/FileExplorer';
import useProfileStore from '@/state/profileStore';

export const RepoFileExplorer = () => {
  const params=useParams()
  const user=params.user as string
  const repo= params.repo || params.code || "";
  const [treeData, setTreeData] = useState<Repository>();
  const {profileInfo}=useProfileStore()

  const InitFileStructure = async () => {

    if (  !repo) return;
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