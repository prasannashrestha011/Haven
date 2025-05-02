import React, { useState } from 'react';
import { Settings, Delete, Edit } from 'lucide-react';

import UpdateRepoModal from './UpdateRepoModel';
import TrashWithModal from './DeleteRepoModel';
import { RepoStruct } from '@/app/[user]/repositories/api';

export default function SettingsMenu({ repo }: { repo: RepoStruct }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative Lexend-Bold ">
      <button
        onClick={handleToggleMenu}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Settings"
      >
        <Settings size={20} className="text-gray-600" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-gray-800 text-gray-300 ring-1 ring-black ring-opacity-5 py-1 z-10 divide-y divide-gray-100">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Repository Options
          </div>
          
          <div className="py-1 flex flex-col justify-center">
            <UpdateRepoModal repo={repo} />
            <TrashWithModal repoName={repo.repoName} repoPath={repo.repo_path} />
          </div>
        </div>
      )}

      {menuOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}