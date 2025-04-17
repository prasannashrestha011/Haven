"use client";
import useUserStore from '@/state/user_info_state';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {  FetchRepoStructure, Repository } from './api';
import { RepoExplorer } from './FileExplorer';

const Page = () => {
  const params = useParams();
  const [treeData, setTreeData] = useState<Repository>();
  const { userInfo } = useUserStore();

  const InitFileStructure = async () => {
    if (!userInfo || !params.repo) return;
    try {
      const structureData = await FetchRepoStructure(userInfo.username, params.repo as string);
      console.log(structureData);
      if (!structureData) return;
      setTreeData(structureData);
    } catch (error) {
      console.error("Error fetching repo structure:", error);
    }
  };

  useEffect(() => {
    InitFileStructure();
  }, [userInfo]);

  return (
    <div>
      {treeData && (
        <RepoExplorer 
          repo={treeData}
        />
      )}
    </div>
  );
};

export default Page;