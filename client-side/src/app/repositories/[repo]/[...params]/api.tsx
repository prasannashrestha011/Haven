import axios from 'axios';

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
export interface FileContentResponse{
    message:{
        file_name:string 
        content:string
    }
}

export const FetchRepoStructure = async (user: string, repo: string): Promise<Repository | null> => {
    try {

        const response = await axios.get(`http://127.0.0.1:8000/api/repo/structure?`, {
            params: { user, repo },
        });
        console.log("Response ",response)
        return response.data as Repository;
    } catch (error) {
        console.error('Error fetching repository structure:', error);
        return null;
    }
};
export async function FetchFileContent(file_path:string):Promise<FileContentResponse|null>{
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_ROOT_URL}/repo/content`, {
            params: { file_path }
        });
        console.log(response)
        return response.data as FileContentResponse;
    } catch (err) {
        console.error('Error fetching file content:', err);
        return null;
    }
}