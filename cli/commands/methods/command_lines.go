package methods

import (
	"fmt"
	"main/configs"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

func RootCmd(cmd *cobra.Command, args []string) {
	fmt.Println("Version control")
	fmt.Println("Version 0.0.1")
}

func InitCmd(cmd *cobra.Command, args []string) {

	os.Mkdir(configs.VcrDirPath, os.ModePerm)
	//adding index file inside .vcr
	indexFilePath := filepath.Join(configs.VcrDirPath, "index")
	os.Create(indexFilePath)
}
func ListCmd(cmd *cobra.Command, args []string) {
	GetFilesAndDirs()
}

func AddCmd(cmd *cobra.Command, args []string) {
	Add_Dir_n_files()
}
