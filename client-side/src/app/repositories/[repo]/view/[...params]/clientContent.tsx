"use client";
import useUserStore from '@/state/user_info_state';
import { usePathname,useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {  FetchRepoStructure, Repository } from './api';
import { RepoExplorer } from '../../FileExplorer';

export const RepoFileExplorer = () => {
  const params=useParams()
  const repo=params.repo
  const [treeData, setTreeData] = useState<Repository>();
  const { userInfo } = useUserStore();

  const InitFileStructure = async () => {
   
    if (!userInfo || !repo) return;
    try {
      const structureData = await FetchRepoStructure(userInfo.username, repo as string);
      console.log(structureData);
      if (!structureData) return;
      setTreeData(structureData);
    } catch (error) {
      console.error("Error fetching repo structure:", error);
    }
  };

  useEffect(() => {
    InitFileStructure();
  }, [userInfo,repo]);

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