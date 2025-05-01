import axios from "axios";

export interface RepoStruct {
  repoID: string;
  repoName: string;
  owner: string;
  repo_path: string;
  des: string;
  created_at: Date;
  updated_at: Date;
}
interface UpdateRepoStruct{
  repoID:string
  newRepoName:string 
  newRepoDes:string 
  
}
export async function GetRepositoryList(
  username: string,
): Promise<RepoStruct[]> {
  try {
    const response = await axios.get<RepoStruct[]>(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/repo/list?username=${username}`,
      { withCredentials: true },
    );
    console.log(response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error fetching repository list:",
        error.response?.data || error.message,
      );
    } else {
      console.error("Unexpected error fetching repository list:", error);
    }
    throw error;
  }
}
export async function SubmitNewRepo(
  repoName: string,
  username: string,
  repoDes: string,
): Promise<{ success: boolean; message: string; newRepo: RepoStruct | null }> {
  try {
    const apiResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/repo/init`,
      {
        username,
        repo_name: repoName,
        repo_des: repoDes,
      },
      {
        withCredentials: true,
      },
    );
    const newRepoDetails: RepoStruct = apiResponse.data.newRepo;
    return {
      success: true,
      message: `${repoName} was successfully created`,
      newRepo: newRepoDetails || null,
    };
  } catch (error: unknown) {
    const isAxiosError = axios.isAxiosError(error);
    const statusCode = isAxiosError ? error.response?.status : null;
    const errorMessage = isAxiosError
      ? error.response?.data?.message || error.message
      : error instanceof Error
        ? error.message
        : "Unknown error";

    console.error(
      `Repository creation error${statusCode ? ` (${statusCode})` : ""}:`,
      errorMessage,
    );

    // Simple status-based messages
    const userMessage =
      statusCode === 409
        ? `Repository "${repoName}" already exists.`
        : statusCode === 401 || statusCode === 403
          ? "Authentication error."
          : `Failed to create repository: ${errorMessage}`;

    return { success: false, message: userMessage, newRepo: null };
  }
}
export async function SubmitRepoDeletion(
  repoPath: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_ROOT_URL}/repo/delete`, {
      params: { repo_path: repoPath },
      withCredentials: true,
    });

    return { success: true, message: "Repository successfully deleted" };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;

      if (statusCode === 404) {
        return { success: false, message: "Repository not found" };
      } else if (statusCode === 403) {
        return {
          success: false,
          message: "You don't have permission to delete this repository",
        };
      } else if (statusCode === 401) {
        return { success: false, message: "Authentication required" };
      }

      // Generic error for other status codes
      console.error(
        `Error deleting repository (${statusCode}):`,
        error.response?.data,
      );
    } else {
      console.error("Unexpected error deleting repository:", error);
    }

    return { success: false, message: "Failed to delete repository" };
  }
}

export async function SubmitRepoUpdate(
  updateData: UpdateRepoStruct,
): Promise<{ success: boolean; message: string; updatedRepo: RepoStruct | null }> {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/repo/update`,
      updateData,
      { withCredentials: true },
    );
    console.log(response.data)
    const updatedRepoDetails: RepoStruct = response.data.message;
    console.log("Result ",updatedRepoDetails)
    return {
      success: true,
      message: "Repository successfully updated",
      updatedRepo: updatedRepoDetails || null,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;

      if (statusCode === 404) {
        return { success: false, message: "Repository not found", updatedRepo: null };
      } else if (statusCode === 403) {
        return {
          success: false,
          message: "You don't have permission to update this repository",
          updatedRepo: null,
        };
      } else if (statusCode === 401) {
        return { success: false, message: "Authentication required", updatedRepo: null };
      }

      // Generic error for other status codes
      console.error(
        `Error updating repository (${statusCode}):`,
        error.response?.data,
      );
    } else {
      console.error("Unexpected error updating repository:", error);
    }

    return { success: false, message: "Failed to update repository", updatedRepo: null };
  }
}
