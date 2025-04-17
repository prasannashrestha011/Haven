import axios from 'axios';


export interface RepoStruct{
    repoID:string 
    repoName:string 
    owner:string
    created_at:Date
    updated_at:Date
}
export async function GetRepositoryList(username:string): Promise<RepoStruct[]> {
    try {
        const response = await axios.get<RepoStruct[]>(
            `http://127.0.0.1:8000/api/repo/list?username=${username}`,{withCredentials:true}
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error fetching repository list:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error fetching repository list:", error);
        }
        throw error;
    }
}