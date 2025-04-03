package methods

import (
	"fmt"
	"io/fs"
	"log"
	"main/configs"
	"os"
	"path/filepath"
	"strings"
)

func ListFilesAndDirs() []string {
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
func GetFilesAndDirs() []string {
	ignored_patterns := Ignore_Files_n_Dirs()
	fileAndDirList := ListFilesAndDirs()

	targeted_List := []string{}

	for _, path := range fileAndDirList {
		isIgnored := IsIgnored(path, ignored_patterns)

		if !isIgnored {
			targeted_List = append(targeted_List, path)

		}
	}
	for _, file := range targeted_List {
		fmt.Println(file)
	}
	return targeted_List
}

func IsIgnored(filePath string, ignoredPatterns []string) bool {
	// checks file pattern
	for _, pattern := range ignoredPatterns {
		matched, _ := filepath.Match(pattern, filePath)
		if matched {
			return true
		}
	}

	// Check all parent directories of the filePath
	currentDir := filepath.Dir(filePath)
	for {
		for _, pattern := range ignoredPatterns {
			matched, _ := filepath.Match(pattern, currentDir)
			if matched {
				return true
			}
		}

		parentDir := filepath.Dir(currentDir)
		if parentDir == currentDir {
			break //exit if reached to root dir
		}
		currentDir = parentDir

	}

	return false
}
func Ignore_Files_n_Dirs() []string {
	ignore_file_path := ".vcr.ignore"

	if _, err := os.Stat(ignore_file_path); os.IsNotExist(err) {
		fmt.Println("ignore file doesnot exits")
		return nil
	}
	content, err := os.ReadFile(".vcr.ignore")
	if err != nil {
		fmt.Println(err.Error())
		return nil
	}
	ignore_list := strings.Split(string(content), "\n")

	for i := range ignore_list {
		ignore_list[i] = strings.TrimSpace(ignore_list[i])
	}
	return ignore_list
}

func Add_Dir_n_files() {
	list := GetFilesAndDirs()
	file_path := configs.VcrDirPath + "/index"
	file, err := os.OpenFile(file_path, os.O_RDWR|os.O_TRUNC, 0644)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer file.Close()
	for _, target_pattern := range list {
		file.WriteString(target_pattern + "\n")
	}
}
