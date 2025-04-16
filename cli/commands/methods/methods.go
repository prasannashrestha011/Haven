//							### Docs###
// InitVcrDir checks if the .vcr directory already exists in the current directory.
// If it exists, it prints an error message and exits. Otherwise, it creates the
// necessary configuration directories and files for the .vcr setup.

// DisplayRemotePath retrieves and displays the remote repository path from the
// configuration. If an error occurs while fetching the path, it prints an error message.

// ListFilesAndDirs lists all files and directories in the current directory and its
// subdirectories relative to the current directory path. It returns a slice of strings
// containing the relative paths of the files and directories. If an error occurs during
// directory traversal, it logs the error and returns an empty slice.

// Add_Remote_Connection_Path adds a remote repository connection by writing the
// remote origin, username, and URL to the configuration file. It validates the remote
// path to ensure it starts with "http://". If the remote configuration already exists
// or if an error occurs during the process, it exits without making changes. On success,
// it prints a success message indicating the remote repository is connected.

// Commit_Dirs_Files prepares the necessary paths and sends a zipped version of the
// repository to the server using the API. It ensures the parent folder and path
// configurations are loaded before performing the operation.
package methods

import (
	"fmt"
	"io/fs"
	"log"

	"main/commands/methods/api"
	configwriters "main/config_writers"
	"main/configs"
	"os"
	"path/filepath"
)

func InitVcrDir() {
	//checking for existings folders
	if _, err := os.Stat(configs.VcrDirPath); err == nil {
		fmt.Println("\033[31m ❌ .vcr folder already exists in current directory\033[0m")
		return
	}
	configs.Create_Config_Dirs_Files()
}
func DisplayRemotePath() {
	remoteRefPath, err := configwriters.GetRefPath()
	if err != nil {
		fmt.Println("Remote ref path error ", err.Error())
		return
	}
	fmt.Println("Remote repo path: ", remoteRefPath)

}
func ListFilesAndDirs() []string {
	configs.LoadParentFolder()
	dirList := []string{}
	currentDir := configs.CurrentDirPath

	err := filepath.WalkDir(currentDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		relative_path, err := filepath.Rel(currentDir, path)
		if err != nil {
			return err
		}
		if d.IsDir() {
			relative_path += "/"
		}
		dirList = append(dirList, relative_path)
		return nil
	})
	if err != nil {
		log.Println("Error while reading the dir : ", err.Error())
		return []string{}
	}
	return dirList
}

func Add_Remote_Connection_Path(origin string, remote_path string) {

	isRemoteExists := configwriters.IsRefConfigExists()
	if isRemoteExists {
		fmt.Println("Remove current remote origin")
		return
	}
	//find the parent folder containing .vcr dir and refresh the path variables
	configs.LoadParentFolder()
	username, err := configwriters.FetchUsernameFromRoot()
	if err != nil {
		return
	}

	content := fmt.Sprintf("[remote \"%s\"]\n [username=%s]\n  path=%s\n", origin, username, remote_path)
	err = os.WriteFile(configs.VcrDirRef_file_path, []byte(content), 0644)
	if err != nil {
		fmt.Println("Failed to insert the remote path", err.Error())
		return
	}
	fmt.Println("🔗 Remote repository successfully connected!")

}

func Commit_Dirs_Files() {
	configs.PathConfigs()
	configs.LoadParentFolder()
	api.SendZipToServer(configs.VcrRepoZip_file_path)
}
