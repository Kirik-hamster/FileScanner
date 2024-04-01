package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"
)

// хранит инвормацию о ткущем файле или директории
type FileInfo struct {
	Name  string //имя файла или директории
	Size  int64  //размер файла или директороии
	IsDir bool   //директория или нет
}

// fileScanner сканирует переданный путь root и выводит содржимое сортируя
// по переданнаму параметру sortType который может быть равет DESC либо ASC
func fileScanner(root string, sortType string) []FileInfo {
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
				defer mu.Unlock()
				fileInfos = append(fileInfos, FileInfo{
					Name:  info.Name(),
					Size:  size,
					IsDir: info.IsDir(),
				})

			}(path)

		}

		return nil
	})

	if err != nil {
		fmt.Fprintln(os.Stderr, "Error walking directory:", err)
	}

	wg.Wait()
	fmt.Println(sortType)
	if sortType == "ASC" {
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
			fileType = "Dir "
		}
		size := formatSize(fileInfo.Size)
		name := padStringToLength(fileInfo.Name, 30)
		pad := strings.Repeat("-", 32)
		fmt.Printf("%s -- %s -- %s\n", fileType, name, size)
		fmt.Printf("%*s|%s|\n", 6, " ", pad)

	}
	elapsed := time.Since(start)
	fmt.Printf("\nProgram execution time: %s\n", elapsed)
	return fileInfos
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

// Обработчик для корневого пути
func filesHandler(w http.ResponseWriter, r *http.Request) {

	root := r.URL.Query().Get("root")
	sort := r.URL.Query().Get("sort")
	fileInfos := fileScanner(root, sort)

	fmt.Fprintf(w, "Root: %s\nSort: %s", root, sort)

	jsonData, err := json.Marshal(fileInfos)
	if err != nil {
		http.Error(w, "Ошибка сериализации в JSON", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	w.Write(jsonData)

}

func main() {
	http.HandleFunc("/files", filesHandler)
	// Запустите HTTP-сервер на порту 8080
	fmt.Println("Starting server on port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
