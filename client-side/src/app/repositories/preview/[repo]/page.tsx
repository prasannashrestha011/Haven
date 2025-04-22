import React from "react";
import RepoFileExplorer from "./clientContent";
import { DisplayRepoDetails } from "../../components/DisplayRepoDetails";
import CodeHandler from "../../components/CodeSection";


const RepoPreViewStructure = () => {
   
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Repo Header */}
        <div className=" rounded-md shadow-sm mb-4 p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-semibold flex items-center text-gray-200">
                <DisplayRepoDetails />
              </h1>
            </div>
            <p className="text-gray-600 text-sm mt-1">
            
            </p>
          </div>

          <div className="flex border-b border-gray-200">
            <div className="flex items-center px-4 py-2 border-b-2 border-orange-500 font-medium text-sm">
        
              <CodeHandler />
            </div>
          </div>
        </div>

        {/* Branch selector and file explorer */}
        <div className=" rounded-md shadow-sm">
          {/* File Explorer Content */}
          <div className="p-0 ">
            <RepoFileExplorer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoPreViewStructure;
