package api

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"io/fs"
	"main/configs"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func Init_Repo_Zip() {
	configs.LoadParentFolder()
	rootDir := configs.VcrRepoZip_file_path
	outputZipPath := filepath.Join(rootDir, "repo_zip.zip")
	configs.VcrRepoZip_file_path = outputZipPath
	CreateRepoZip(rootDir, outputZipPath)

}
func CreateRepoZip(sourceDir string, zipPath string) error {
	zipFile, err := os.Create(zipPath)
	if err != nil {
		fmt.Println("Error while creating zip: ", err.Error())
		return err
	}
	defer zipFile.Close()

	archive := zip.NewWriter(zipFile)
	defer archive.Close()
	err = filepath.Walk(sourceDir, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			fmt.Println("Os walk error", err.Error())
			return err
		}
		if path == zipPath {
			return nil
		}
		relPath := strings.TrimPrefix(path, sourceDir)
		relPath = strings.TrimPrefix(relPath, string(filepath.Separator))

		if info.IsDir() {
			return nil
		}
		//opening file to copy the content to zip entry
		file, err := os.Open(path)
		if err != nil {
			fmt.Println("Error opening file line 45->", err.Error())
			return err
		}
		defer file.Close()
		writer, err := archive.Create(relPath)
		if err != nil {
			fmt.Println("Error creating archive entry in the zip file-> ", err.Error())
			return err
		}
		_, err = io.Copy(writer, file)
		if err != nil {
			fmt.Println("Error copying file content into zip entry->", err.Error())
			return err
		}
		fmt.Println("Successfully created the zip folder for the repo")
		return nil
	})
	if err != nil {
		return err
	}
	return nil
}
func SendZipToServer(zipPath string) {
	file, err := os.Open(zipPath)
	if err != nil {
		fmt.Println("Error opening the file path", err.Error())
		return
	}
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)
	part, err := writer.CreateFormFile("repo_zip", filepath.Base(zipPath))
	if err != nil {
		fmt.Println("Error creating multipart field ", err.Error())
		return
	}
	_, err = io.Copy(part, file)
	if err != nil {
		fmt.Println("Error copying the zip file", err.Error())
		return
	}
	err = writer.Close()
	if err != nil {
		fmt.Println("Error finalizing the form field", err.Error())
		return
	}
	resp, err := http.Post("http://127.0.0.1:8000/api/repo/insert?repo_path=/users/k-8lmpojslicbrvngltzsw/go_test",
		writer.FormDataContentType(), &body)
	if err != nil {
		fmt.Println("Request failure while insertion of repo", err.Error())
		return
	}
	if resp.StatusCode != 200 {
		fmt.Println("Error while sending the insertion requestion")
	}
	fmt.Println("Repo inserted to the remote serever")

}
