package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type FileInfo struct {
	Name  string
	Size  int64
	IsDir bool
}

func main() {
	start := time.Now()

	root := flag.String("root", "", "file path")
	sortType := flag.String("sort", "ASC", "type of sort")

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

	*sortType = strings.ToUpper(*sortType)
	if *sortType != "ASC" && *sortType != "DESC" {
		fmt.Fprintln(os.Stderr, "Error: Invalid sort type. Use --sort=ASC or --sort=DESC.")
		flag.Usage()
		os.Exit(1)
	}

	var fileInfos []FileInfo

	err := filepath.Walk(*root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		fileInfo := FileInfo{
			Name:  info.Name(),
			Size:  info.Size(),
			IsDir: info.IsDir(),
		}

		if fileInfo.IsDir {
			fileInfo.Size, err = dirSize(path)
			if err != nil {
				return err
			}
		}

		fileInfos = append(fileInfos, fileInfo)
		return nil
	})

	if err != nil {
		fmt.Fprintln(os.Stderr, "Error walking directory:", err)
	}

	if *sortType == "ASC" {
		sort.Slice(fileInfos, func(i, j int) bool {
			return fileInfos[i].Size < fileInfos[j].Size
		})
	} else {
		sort.Slice(fileInfos, func(i, j int) bool {
			return fileInfos[i].Size > fileInfos[j].Size
		})
	}

	for _, fileInfo := range fileInfos {
		fileType := "File"
		if fileInfo.IsDir {
			fileType = "Dir"
		}
		size := formatSize(fileInfo.Size)
		fmt.Printf("%s -- %s -- %s\n", fileType, fileInfo.Name, size)
	}
	elapsed := time.Since(start)
	fmt.Printf("\nProgram execution time: %s\n", elapsed)
}

// dirSize calculates the total size of all files in a directory.
func dirSize(path string) (int64, error) {
	var size int64

	err := filepath.Walk(path, func(_ string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			size += info.Size()
		}
		return nil
	})
	return size, err
}

// formatSize formats the size in bytes to a human-readable string in megabytes, gigabytes, terabytes, or petabytes.
func formatSize(size int64) string {
	const (
		KB = 1024
		MB = 1024 * KB
		GB = 1024 * MB
		TB = 1024 * GB
	)
	switch {
	case size < KB:
		return fmt.Sprintf("%.2f B", float64(size))
	case size < MB:
		return fmt.Sprintf("%.2f KB", float64(size)/KB)
	case size < GB:
		return fmt.Sprintf("%.2f MB", float64(size)/MB)
	case size < TB:
		return fmt.Sprintf("%.2f GB", float64(size)/GB)
	default:
		return fmt.Sprintf("%.2f TB", float64(size)/TB)
	}
}
