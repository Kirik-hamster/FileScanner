package scanner

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

// хранит инвормацию о ткущем файле или директории
type FileInfo struct {
	Name      string //имя файла или директории
	Size      string //размер файла или директороии
	SizeInt64 int64
	IsDir     string //директория или нет
	IsRoot    bool   //явлеется ли корневой папкой
}

// fileScanner сканирует переданный путь root и выводит содржимое сортируя
// по переданнаму параметру sortType который может быть равет DESC либо ASC
func FileScanner(root string, sortType string) ([]FileInfo, error) {
	start := time.Now()
	sortType = strings.ToUpper(sortType)
	var fileInfos []FileInfo
	var wg sync.WaitGroup
	var mu sync.Mutex

	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		relPath, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}

		currentDepth := strings.Count(relPath, string(os.PathSeparator))
		if currentDepth > 0 {
			return filepath.SkipDir
		}

		wg.Add(1)
		go func(dirPath string) {
			defer wg.Done()
			size, err := dirSize(dirPath)
			if err != nil {
				fmt.Fprintln(os.Stderr, "Error calculating directory size:", err)
				return
			}
			mu.Lock()
			defer mu.Unlock()
			fileInfos = append(fileInfos, FileInfo{
				Name:      info.Name(),
				Size:      strconv.FormatInt(size, 10),
				SizeInt64: size,
				IsDir:     strconv.FormatBool(info.IsDir()),
				IsRoot:    path == root,
			})

		}(path)

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf(fmt.Sprintf("Error walking directory: %v", err))
	}

	wg.Wait()
	if sortType == "ASC" {
		sort.Slice(fileInfos, func(i, j int) bool {
			return fileInfos[i].SizeInt64 < fileInfos[j].SizeInt64
		})
	} else {
		sort.Slice(fileInfos, func(i, j int) bool {
			return fileInfos[i].SizeInt64 > fileInfos[j].SizeInt64
		})
	}

	for i, fileInfo := range fileInfos {
		fileType := "File"
		if fileInfo.IsDir == "true" {
			fileType = "Dir "
		}

		sizeInfo := fileInfo.Size
		sizeInfoInt64, err := strconv.ParseInt(sizeInfo, 10, 64)
		if err != nil {
			log.Fatal("Ошибка преобразования string в int64:", err)
		}
		size := formatSize(sizeInfoInt64)
		name := padStringToLength(fileInfo.Name, 30)
		pad := strings.Repeat("-", 32)
		fmt.Printf("%s -- %s -- %s\n", fileType, name, size)
		fmt.Printf("%*s|%s|\n", 6, " ", pad)

		fileInfos[i].IsDir = fileType
		fileInfos[i].Size = size

	}
	elapsed := time.Since(start)
	fmt.Printf("\nProgram execution time: %s\n", elapsed)
	return fileInfos, nil
}

// padStringToLength дополняет строку пробелами до заданной длины и центрирует ее.
// Если длина строки нечетная, одна сторона будет иметь один пробел больше, чтобы центрировать строку ровно по середине.
func padStringToLength(s string, length int) string {
	padding := length - len(s)
	if padding%2 != 0 {
		return fmt.Sprintf("%*s%s%*s", padding/2+1, "", s, padding/2, "")
	}
	return fmt.Sprintf("%*s%s%*s", padding/2, "", s, padding/2, "")
}

// dirSize calculates the total size of all files in a directory.
func dirSize(path string) (int64, error) {
	var size int64

	err := filepath.Walk(path, func(_ string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		size += info.Size()

		return nil
	})
	return size, err
}

// formatSize formats the size in bytes to a human-readable string in megabytes, gigabytes, or terabytes.
func formatSize(size int64) string {
	const (
		KB = 1000
		MB = 1000 * KB
		GB = 1000 * MB
		TB = 1000 * GB
	)
	switch {
	case size < KB:
		return fmt.Sprintf("%.1f B", float64(size))
	case size < MB:
		return fmt.Sprintf("%.1f KB", float64(size)/KB)
	case size < GB:
		return fmt.Sprintf("%.1f MB", float64(size)/MB)
	case size < TB:
		return fmt.Sprintf("%.1f GB", float64(size)/GB)
	default:
		return fmt.Sprintf("%.1f TB", float64(size)/TB)
	}
}
