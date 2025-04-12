package methods

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"main/structure"

	"net/http"
)

func Auth_Method(username string, password string) structure.ResponseBody {
	data, _ := json.Marshal(map[string]string{"username": username, "password": password})
	req, _ := http.NewRequest("POST", "http://127.0.0.1:8000/api/auth/token", bytes.NewBuffer(data))
	req.Header.Set("Content-Type", "application/json")
	res, err := (&http.Client{}).Do(req)
	if err != nil {
		fmt.Println("request failure", err.Error())
		return structure.ResponseBody{Error: err.Error(), StatusCode: 500}
	}
	body, _ := io.ReadAll(res.Body)
	if res.StatusCode != 200 {
		fmt.Println("\033[31mError: Invalid username or password\033[0m")

		return structure.ResponseBody{Error: "Unauthorized request,please siging", StatusCode: 403}
	}

	var authResponseBody structure.AuthResponseStruct
	if err := json.Unmarshal(body, &authResponseBody); err != nil {
		fmt.Println("Error unmarshling the body", err.Error())
		return structure.ResponseBody{Error: err.Error(), StatusCode: 500}
	}
	fmt.Println("\033[32mAuthentication successful\033[0m")

	return structure.ResponseBody{Message: map[string]string{
		"accessToken":  authResponseBody.AccessToken,
		"refreshToken": authResponseBody.RefreshToken,
		"storageID":    authResponseBody.StorageReferenceID,
		"username":     username,
		"password":     password,
	}, StatusCode: 200}

}
