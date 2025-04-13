package configwriters

import (
	"encoding/json"
	"fmt"
	"main/configs"
	"main/structure"
	"os"
	"strings"
)

func WriteConfig(config *structure.VCR_AuthBody) error {
	configDir := os.Getenv("HOME") + "/.vcr"
	configFile := configDir + "/config.json"
	if _, err := os.Stat(configDir); os.IsNotExist(err) {
		err := os.Mkdir(configDir, 0755)
		if err != nil {
			return err
		}
	}
	file, err := os.Create(configFile)
	if err != nil {
		fmt.Println("Error creating config file:", err)
		return err
	}
	defer file.Close()
	//providing indentation to the json file
	data, err := json.MarshalIndent(config, "", " ")
	if err != nil {
		fmt.Println("Error marshalling config to JSON:", err)
		return err
	}
	err = os.WriteFile(configFile, data, 0644)
	if err != nil {
		fmt.Println("Error writing config to file:", err)
		return err
	}
	fmt.Println("Config file created successfully ")
	return nil
}

func IsRefConfigExists() (bool, error) {
	configs.PathConfigs()
	fmt.Println("Root directory ", configs.VcrDirPath)
	fmt.Println("Ref file path ", configs.VcrDirRef_file_path)
	//reading ref file from local .vcr
	data, err := os.ReadFile(configs.VcrDirRef_file_path)
	if err != nil {
		fmt.Println("Error reading ref file : ", err.Error())
		return false, err
	}
	content := strings.TrimSpace(string(data))
	fmt.Println(content)
	return true, nil
}
func FetchUsernameFromRoot() (string, error) {
	configDir := os.Getenv("HOME") + "/.vcr"
	configFile := configDir + "/config.json"
	data, err := os.ReadFile(configFile)
	if err != nil {
		fmt.Println("Config file error : ", err.Error())
		return "", err
	}
	var configStruct struct {
		Username string `json:"username"`
	}
	if err = json.Unmarshal(data, &configStruct); err != nil {
		fmt.Println("Failed to Unmarshal json: ", err.Error())
		return "", err
	}
	return configStruct.Username, nil
}
