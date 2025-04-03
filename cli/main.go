package main

import (
	"main/commands"
	"main/configs"
)

func main() {
	configs.PathConfigs()
	commands.Init_cmd()
}
