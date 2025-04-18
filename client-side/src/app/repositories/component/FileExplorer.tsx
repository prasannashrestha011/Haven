import Link from 'next/link';
import React from 'react';
import { useState } from 'react';

export type File = {
    fileID: string;
    fileName: string;
    filePath: string | null;
};

export type Directory = {
    dirID: string;
    dirName: string;
    files: File[];
    subdirectories: Directory[];
};

export type RepoStructure = {
    rootFiles: File[];
    directories: Directory[];
};

export type Repository = {
    repoID: string;
    repoName: string;
    owner: string;
    structure: RepoStructure;
    status: number;
};

export const RepoExplorer = ({ repo }: { repo: Repository }) => {
    const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

    const toggleDirectory = (dirID: string) => {
        const newExpanded = new Set(expandedDirs);
        newExpanded.has(dirID) ? newExpanded.delete(dirID) : newExpanded.add(dirID);
        setExpandedDirs(newExpanded);
    };

    return (
        <div className="repo-explorer p-3 border border-black w-80 h-screen overflow-y-scroll">
            
            
            {/* Render root files */}
            {repo.structure.rootFiles.map(file => (
                <FileItem key={file.fileID} dir={''} file={file} level={0} />
            ))}
            
            {/* Render directories */}
            {repo.structure.directories.map(directory => (
                <DirectoryItem
                    key={directory.dirID}
                    directory={directory}
                    level={0}
                    expandedDirs={expandedDirs}
                    toggleDirectory={toggleDirectory}
                />
            ))}
        </div>
    );
};

const DirectoryItem = ({
  directory,
  level,
  expandedDirs,
  toggleDirectory,
  parentPath=''
}: {
  directory: Directory;
  level: number;
  expandedDirs: Set<string>;
  toggleDirectory: (dirID: string) => void;
  parentPath?:string
}) => {
  const currentPath=`${parentPath}/${directory.dirName}`
  const isExpanded = expandedDirs.has(directory.dirID);

  return (
    <div className="directory" style={{ paddingLeft: `${level * 16}px` }}>
      <div
        className="directory-header"
        onClick={() => toggleDirectory(directory.dirID)}
      >
        <span className="icon">
          {isExpanded ? '📂' : '📁'}
        </span>
        {directory.dirName}
      </div>
      
      {isExpanded && (
        <div className="directory-contents">
          {directory.subdirectories.map((subdir) => (
            <DirectoryItem
              key={subdir.dirID}
              directory={subdir}
              level={level + 1}
              expandedDirs={expandedDirs}
              toggleDirectory={toggleDirectory}
              parentPath={currentPath}
            />
          ))}
          {directory.files.map((file) => (
            
            <FileItem key={file.fileID} file={file} level={level + 1} dir={currentPath} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileItem = ({ file, level,dir }: { file: File; level: number,dir:string }) => {
  const basePath = '/repositories'; // default base path
  const fullPath = `${basePath}${dir ? dir : ''}/${file.fileName}`;
  return (
   <Link href={fullPath}>
     <div className="file" style={{ paddingLeft: `${level * 16}px` }} onClick={()=>console.log(`${fullPath}`)}>
      <span className="icon">📄</span>
      {file.fileName}
      {file.filePath && <span className="file-path">{file.filePath}</span>}
    </div>
   </Link>
  );
};



