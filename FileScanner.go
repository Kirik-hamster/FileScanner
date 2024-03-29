package main

import (
	"flag"
	"fmt"
	"os"
	"strings"
)

func main() {
	root := flag.String("root", "", "file path")
	sort := flag.String("sort", "ASC", "type of sort")

	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Error: \n")
		flag.PrintDefaults()
		os.Exit(1)
	}

	flag.Parse()

	if *root == "" {
		flag.Usage()
		os.Exit(1)
	}

	*sort = strings.ToUpper(*sort)
	if *sort != "ASC" && *sort != "DESC" {
		fmt.Fprintln(os.Stderr, "Error: Invalid sort type. Use --sort=ASC or --sort=DESC.")
		flag.Usage()
		os.Exit(1)
	}

	fmt.Printf("root: %v, sort: %v\n", *root, *sort)
}
