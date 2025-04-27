import { RepoStruct } from "../repositories/api";
import axios from "axios";

interface repoSearchResult {
    list: RepoStruct[];
}

export async function FetchSearchedRepository(repo_name: string): Promise<RepoStruct[]> {
    try {
        const response = await axios.get<repoSearchResult>(`http://127.0.0.1:8000/api/search/repo`, {
            params: { repo_name }
        });

        return response.data.list;
    } catch (error) {
        console.error("Error fetching repositories:", error);
        return [];
    }
}
