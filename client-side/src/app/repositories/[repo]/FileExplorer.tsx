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
        <div className="repo-explorer">
            <div className="repo-header">
                <h2>{repo.repoName}</h2>
                <p className="owner">Owner: {repo.owner}</p>
            </div>
            
            {/* Render root files */}
            {repo.structure.rootFiles.map(file => (
                <FileItem key={file.fileID} file={file} level={0} />
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
}: {
  directory: Directory;
  level: number;
  expandedDirs: Set<string>;
  toggleDirectory: (dirID: string) => void;
}) => {
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
            />
          ))}
          {directory.files.map((file) => (
            <FileItem key={file.fileID} file={file} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileItem = ({ file, level }: { file: File; level: number }) => {
  return (
    <div className="file" style={{ paddingLeft: `${level * 16}px` }}>
      <span className="icon">📄</span>
      {file.fileName}
      {file.filePath && <span className="file-path">{file.filePath}</span>}
    </div>
  );
};



