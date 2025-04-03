package commands

import (
	"main/commands/methods"

	"github.com/spf13/cobra"
)

var root_cmd = &cobra.Command{
	Use:   "cli",
	Short: "file version control",
	Run:   methods.RootCmd,
}

var init_cmd = &cobra.Command{
	Use: "init",
	Run: methods.InitCmd,
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
	root_cmd.AddCommand(list_cmd)
	root_cmd.AddCommand(add_cmd)
	root_cmd.Execute()
}
