from server.methods.DropBoxCrud import DropBoxService
from typing import Optional

from server.methods.ZipMethods import fetch_repo_metadata, updated_repo_details
from server.utils.ResponseBody import ResponseBody


def handle_repo_update(
    repoID: str, newRepoName: Optional[str], newRepoDes: Optional[str]
):
    existingRepo = fetch_repo_metadata(repoID=repoID)
    if not existingRepo:
        return ResponseBody.build(
            {"message": {"error": "Repository not found"}}, status=404
        )
    oldRepoName = existingRepo["repoName"]
    repoPath = existingRepo["repo_path"]

    if newRepoName != oldRepoName:
        newRepoPath = update_repo_name(repo_path=repoPath, newRepoName=newRepoName)
    else:
        newRepoPath = repoPath
    updatedRepo = updated_repo_details(
        repoID=repoID,
        newRepoName=newRepoName,
        newRepoDes=newRepoDes,
        newRepoPath=newRepoPath,
    )

    return ResponseBody.build({"message": updatedRepo}, status=200)


def update_repo_name(repo_path: str, newRepoName: str):
    newRepoPath = DropBoxService.Update_Repo_Name(repo_path, newRepoName)
    print("New repoPath ", newRepoPath)
    return newRepoPath
