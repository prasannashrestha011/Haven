package configs

import (
	"fmt"
	"log"

	"os"
	"path/filepath"
)

var CurrentDirPath string
var VcrDirPath string
var VcrIndex_file_path string
var VcrDirRef_file_path string

func PathConfigs() {
	rootPathConfig()
}
func rootPathConfig() {
	var err error
	CurrentDirPath, err = os.Getwd()
	if err != nil {
		log.Panic("Failed to get current dir")
	}
	VcrDirPath = filepath.Join(CurrentDirPath, ".vcr")
	refPathConfig(VcrDirPath)
}
func refPathConfig(parent_dir string) {
	ref_dir_path := parent_dir + "/ref"
	VcrDirRef_file_path = filepath.Join(ref_dir_path, "ref")
}

func createRootDir() {
	//for creating .vcr folder
	os.Mkdir(VcrDirPath, os.ModePerm)
	//adding index & ref file inside .vcr and /ref respectively
	VcrIndex_file_path = filepath.Join(VcrDirPath, "index")
	os.Create(VcrIndex_file_path)
}

func createRefDir() {
	ref_dir_path := VcrDirPath + "/ref"
	os.Mkdir(ref_dir_path, os.ModePerm)
	os.Create(VcrDirRef_file_path)
}

func Create_Config_Dirs_Files() {

	createRootDir()
	createRefDir()
	fmt.Println("\033[32m✅ .vcr initialized in the current directory\033[0m")
}
