package api

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

func SendZipToServer(zipPath string) {
	fmt.Println("Zip path ", zipPath)
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
	resp, err := http.Post("http://127.0.0.1:8000/api/repo/insert?repo_path=/users/k-8lmpojslicbrvngltzsw/js",
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
