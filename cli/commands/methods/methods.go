package methods

import (
	"fmt"
	"io/fs"
	"log"
	"strings"

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
	fmt.Println("working....")
	isRemoteExists := configwriters.IsRefConfigExists()
	if isRemoteExists {
		return
	}
	//find the parent folder containing .vcr dir and refresh the path variables
	configs.LoadParentFolder()
	username, err := configwriters.FetchUsernameFromRoot()
	if err != nil {
		return
	}
	if !strings.HasPrefix(remote_path, "http://") {
		fmt.Println("Invalid remote origin")
		return
	}
	content := fmt.Sprintf("[remote \"%s\"]\n [username=%s]\n  url=%s\n", origin, username, remote_path)
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
