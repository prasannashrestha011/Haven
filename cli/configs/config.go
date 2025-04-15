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
var VcrDirRef_file_path string // for /ref/ref file

var VcrRepoZip_dir_path string
var VcrRepoZip_file_path string //for zipfile

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
	zipContainerPathConfig(VcrDirPath)
}
func zipContainerPathConfig(parent_dir string) {
	VcrRepoZip_dir_path = parent_dir + "/zip"
	VcrRepoZip_file_path = VcrRepoZip_dir_path + "/repo_zip.zip"
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
func createZipDir() {
	VcrRepoZip_dir_path = filepath.Join(VcrDirPath, "/zip") //folder
	os.Mkdir(VcrRepoZip_dir_path, os.ModePerm)

}
func createRefDir() {
	ref_dir_path := VcrDirPath + "/ref"
	os.Mkdir(ref_dir_path, os.ModePerm)
	os.Create(VcrDirRef_file_path)
}

func Create_Config_Dirs_Files() {
	createRootDir()
	createRefDir()
	createZipDir()
	fmt.Println("\033[32m✅ .vcr initialized in the current directory\033[0m")
}
func LoadParentFolder() {
	dir, err := os.Getwd()
	if err != nil {
		log.Panic("Failed to get current dir:", err)
	}

	for {
		vcrDir := filepath.Join(dir, ".vcr")
		info, err := os.Stat(vcrDir)

		if err == nil && info.IsDir() {
			// treat as root dir if vcr folder is found
			CurrentDirPath = dir
			VcrDirPath = vcrDir
			refPathConfig(VcrDirPath)
			return
		}

		//  Go up one directory level
		parent := filepath.Dir(dir)
		if parent == dir {
			log.Panic(".vcr directory not found in any parent directory")
		}
		dir = parent
	}
}
