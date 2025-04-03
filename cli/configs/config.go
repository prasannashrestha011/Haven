package configs

import (
	"log"
	"os"
	"path/filepath"
)

var CurrentDirPath string
var VcrDirPath string

func PathConfigs() {
	var err error
	CurrentDirPath, err = os.Getwd()
	if err != nil {
		log.Panic("Failed to get current dir")
	}
	VcrDirPath = filepath.Join(CurrentDirPath, ".vcr")

}
