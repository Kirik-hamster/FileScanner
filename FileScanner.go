package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
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
	var wg sync.WaitGroup
	var mu sync.Mutex

	err := filepath.Walk(*root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// lenRoot := strings.Split(*root, "/")
		// if lenRoot[len(lenRoot)-1] == "" {
		// 	lenRoot = lenRoot[:len(lenRoot)-1]
		// }

		// depth := len(strings.Split(path, "/")) - len(lenRoot)
		// if depth > 1 {
		// 	return filepath.SkipDir
		// }

		relPath, err := filepath.Rel(*root, path)
		if err != nil {
			return err
		}

		currentDepth := strings.Count(relPath, string(os.PathSeparator))

		if currentDepth > 0 {
			return filepath.SkipDir
		}

		if info.IsDir() {
			wg.Add(1)
			go func(dirPath string) {
				defer wg.Done()
				size, err := dirSize(dirPath)
				if err != nil {
					fmt.Fprintln(os.Stderr, "Error calculating directory size:", err)
					return
				}
				mu.Lock()
				fileInfos = append(fileInfos, FileInfo{
					Name:  info.Name(),
					Size:  size,
					IsDir: true,
				})
				mu.Unlock()

			}(path)

		} else {
			mu.Lock()
			fileInfos = append(fileInfos, FileInfo{
				Name:  info.Name(),
				Size:  info.Size(),
				IsDir: info.IsDir(),
			})
			mu.Unlock()
		}

		return nil
	})

	if err != nil {
		fmt.Fprintln(os.Stderr, "Error walking directory:", err)
	}

	wg.Wait()

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

// formatSize formats the size in bytes to a human-readable string in megabytes, gigabytes, or terabytes.
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
