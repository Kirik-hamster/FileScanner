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

// stringer интрфей для получения строки с отформатироваными полями структуры
type stringer interface {
	string() string
}

// хранит инвормацию о ткущем файле или директории
type FileInfo struct {
	Name      string //имя файла или директории
	Size      string //размер файла или директороии
	SizeInt64 int64  //размер файла или директороии в байтах
	IsDir     string //директория или нет
	IsRoot    bool   //явлеется ли корневой папкой
}

// string форматирует и выводит строку с информацией о файле или директори
func (f FileInfo) string() string {
	name := padStringToLength(f.Name, 30)
	pad := strings.Repeat("-", 32)
	l1 := fmt.Sprintf("%s -- %s -- %s\n", f.IsDir, name, f.Size)
	l2 := fmt.Sprintf("%*s|%s|", 6, " ", pad)
	l := fmt.Sprintf("%s%s", l1, l2)
	return l
}

// хранит инвормацию о ткущем файле или директории и время выполенения программы
type Info struct {
	FilesInfos    []FileInfo
	RootInfo      FileInfo
	Time          int64
	BasePath      string
	StatisticLink string
}

// fileScanner сканирует переданный путь root и выводит содржимое сортируя
// по переданнаму параметру sortType который может быть равет DESC либо ASC
func FileScanner(root string, sortType string) (Info, error) {
	start := time.Now()
	sortType = strings.ToUpper(sortType)
	var fileInfos []FileInfo
	var wg sync.WaitGroup
	var mu sync.Mutex
	var RootInfo FileInfo

	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		files, err := os.ReadDir(root)
		if err != nil {
			fmt.Printf("Ошибка при чтении директории: %v\n", err)
			return err
		}
		go func() {
			if root == path {
				fmt.Println(path)
				size, err := dirSize(path)
				if err != nil {
					fmt.Fprintln(os.Stderr, "Error calculating directory root size:", err)

				}

				RootInfo.Name = info.Name()

				RootInfo.SizeInt64 = size
				RootInfo.IsDir = strconv.FormatBool(info.IsDir())
				RootInfo.IsRoot = path == root
				RootInfo.Size = formatSize(RootInfo.SizeInt64)
			}
		}()

		for _, file := range files {
			fileInfo, err := file.Info()
			if err != nil {
				fmt.Printf("Ошибка при получении информации о файле: %v\n", err)
				continue
			}
			wg.Add(1)
			go func(fileName string, fileInfo os.FileInfo) {
				defer wg.Done()
				size, err := dirSize(filepath.Join(root, fileName))
				if err != nil {
					fmt.Fprintln(os.Stderr, "Error calculating directory size:", err)
					return
				}
				mu.Lock()
				defer mu.Unlock()
				fileInfos = append(fileInfos, FileInfo{
					Name:      fileName,
					Size:      strconv.FormatInt(size, 10),
					SizeInt64: size,
					IsDir:     strconv.FormatBool(info.IsDir()),
					IsRoot:    path == root,
				})

			}(file.Name(), fileInfo)
		}

		return filepath.SkipDir
	})

	if err != nil {
		return Info{}, fmt.Errorf(fmt.Sprintf("Error walking directory: %v", err))
	}

	wg.Wait()
	for i := range fileInfos {
		if fileInfos[i].IsDir == "false" {
			fileInfos[i].SizeInt64 += 4096
			fileInfos[i].Size = strconv.FormatInt(fileInfos[i].SizeInt64, 10)
		}
		fileType := "File"
		if fileInfos[i].IsDir == "true" {
			fileType = "Dir "
		}
		fileInfos[i].IsDir = fileType
		sizeInfo := fileInfos[i].Size
		sizeInfoInt64, err := strconv.ParseInt(sizeInfo, 10, 64)
		if err != nil {
			log.Fatal("Ошибка преобразования string в int64:", err)
		}
		fileInfos[i].Size = formatSize(sizeInfoInt64)
	}
	if sortType == "ASC" {
		sort.Slice(fileInfos, func(i, j int) bool {
			return fileInfos[i].SizeInt64 < fileInfos[j].SizeInt64
		})
	} else {
		sort.Slice(fileInfos, func(i, j int) bool {
			return fileInfos[i].SizeInt64 > fileInfos[j].SizeInt64
		})
	}

	for i := range fileInfos {
		var String stringer = fileInfos[i]
		fmt.Println(String.string())
	}

	elapsed := time.Since(start)
	fmt.Printf("\nProgram execution time: %s\n", elapsed)
	Info := Info{
		FilesInfos:    fileInfos,
		RootInfo:      RootInfo,
		Time:          elapsed.Nanoseconds(),
		BasePath:      "",
		StatisticLink: "",
	}

	return Info, nil
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

// dirSize считатет полный размер файла в папке
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
