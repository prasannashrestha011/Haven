package commands

import (
	"fmt"
	"main/commands/methods"

	"github.com/spf13/cobra"
)

var root_cmd = &cobra.Command{
	Use:   "cli",
	Short: "file version control",
	Run:   methods.RootCmd,
}
var config_cmd = &cobra.Command{
	Use:   "config",
	Short: "Put your vcr credentials",
	Run:   methods.ConfigCmd,
}
var init_cmd = &cobra.Command{
	Use: "init",
	Run: methods.InitCmd,
}
var remote_cmd = &cobra.Command{
	Use: "remote",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Remote origin")
	},
}
var remote_add_cmd = &cobra.Command{
	Use: "add [origin] [remote_path]",
	Run: methods.RemoteAddCmd,
}

var list_cmd = &cobra.Command{
	Use: "list",
	Run: methods.ListCmd,
}

var add_cmd = &cobra.Command{
	Use: "add",
	Run: methods.AddCmd,
}

func Init_cmd() {
	root_cmd.AddCommand(init_cmd)
	remote_cmd.AddCommand(remote_add_cmd)
	root_cmd.AddCommand(remote_cmd)

	root_cmd.AddCommand(list_cmd)
	root_cmd.AddCommand(add_cmd)
	root_cmd.AddCommand(config_cmd)
	root_cmd.Execute()
}
