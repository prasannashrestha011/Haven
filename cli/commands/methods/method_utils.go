package methods

import (
	"archive/zip"
	"fmt"
	"io"
	"main/configs"
	"os"
	"path/filepath"
	"strings"
)

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

// main function for listing the dir in index file
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
	// creating a zip folder that will be stored on .vcr/zip
	Init_Repo_Zip(list)
}
func Init_Repo_Zip(tracked_list []string) {

	//fetching the parent directory containing .vcr folder
	configs.LoadParentFolder()
	//correctly mapping path variables to the .vcr path
	configs.PathConfigs()
	vcr_dir_path := configs.VcrRepoZip_dir_path

	outputZipPath := filepath.Join(vcr_dir_path, "repo_zip.zip")

	configs.VcrRepoZip_file_path = outputZipPath
	CreateRepoZip(tracked_list, outputZipPath)

}
func CreateRepoZip(tracked_list []string, zipPath string) error {
	zipFile, err := os.Create(zipPath)
	if err != nil {
		fmt.Println("Failed to create the zip file ", err.Error())
		return err
	}
	zipWriter := zip.NewWriter(zipFile)

	defer zipFile.Close()
	defer zipWriter.Close()

	for _, itemPath := range tracked_list {
		info, err := os.Stat(itemPath)
		if err != nil {
			fmt.Println("Failed to state the file ", err.Error())
			return nil
		}
		if info.IsDir() {
			header := &zip.FileHeader{
				Name:   itemPath + "/",
				Method: zip.Deflate,
			}
			header.SetMode(info.Mode())
			_, err = zipWriter.CreateHeader(header)
			if err != nil {
				fmt.Println("Failed to create zip header: ", err.Error())
				return err
			}
			continue
		}
		file, err := os.Open(itemPath)
		if err != nil {
			fmt.Println("Error opening the file ", err.Error())
			return err
		}
		defer file.Close()
		relPath := filepath.ToSlash(itemPath)
		header, err := zip.FileInfoHeader(info)
		if err != nil {
			fmt.Println("Failed to get file info header ", err.Error())
		}
		header.Name = relPath
		header.Method = zip.Deflate
		header.SetMode(info.Mode())
		writer, err := zipWriter.CreateHeader(header)
		if err != nil {
			fmt.Println("Failed to create zip header ", err.Error())
			return err
		}
		_, err = io.Copy(writer, file)
		if err != nil {
			fmt.Println("Failed to copy file to zip ", err.Error())
		}

	}

	return nil
}
