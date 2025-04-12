package configwriters

import (
	"encoding/json"
	"fmt"
	"main/structure"
	"os"
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
