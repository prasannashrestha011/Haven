package configwriters

import (
	"fmt"
	"testing"
)

func TestRef(t *testing.T) {
	isExists, err := IsRefConfigExists()
	if err != nil {
		return
	}
	if isExists {
		fmt.Println("Reference exists")
	}
}
