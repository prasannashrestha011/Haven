package configwriters

import (
	"fmt"
	"testing"
)

func TestRef(t *testing.T) {
	isExists := IsRefConfigExists()

	if isExists {
		fmt.Println("Reference exists")
	}
}
