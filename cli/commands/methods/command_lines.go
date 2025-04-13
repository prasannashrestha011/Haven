package methods

import (
	"fmt"

	configwriters "main/config_writers"
	"main/structure"

	"github.com/spf13/cobra"
)

func RootCmd(cmd *cobra.Command, args []string) {
	fmt.Println("Version control")
	fmt.Println("Version 0.0.1")
}

func ConfigCmd(cmd *cobra.Command, args []string) {
	if len(args) < 2 {
		fmt.Println("Usage:<username> <password>")
		return
	}
	username := args[0]
	password := args[1]
	response := Auth_Method(username, password)
	if response.StatusCode == 200 {
		contentMap, _ := response.Message.(map[string]string)

		config_body := &structure.VCR_AuthBody{
			Username:           contentMap["username"],
			Password:           contentMap["password"],
			AccessToken:        contentMap["accessToken"],
			RefreshToken:       contentMap["refreshToken"],
			StorageReferenceID: contentMap["storageID"],
		}
		configwriters.WriteConfig(config_body)
	}
}
func InitCmd(cmd *cobra.Command, args []string) {
	InitVcrDir()
}
func ListCmd(cmd *cobra.Command, args []string) {
	GetFilesAndDirs()
}

func AddCmd(cmd *cobra.Command, args []string) {
	Add_Dir_n_files()
}

func RemoteAddCmd(cmd *cobra.Command, args []string) {
	if len(args) < 1 {
		fmt.Println("\033[31mNot enough argument for remote connection\033[0m")
	}
	origin := args[0]
	remote_path := args[1]
	Add_Remote_Connection_Path(origin, remote_path)
}
