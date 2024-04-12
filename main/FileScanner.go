package main

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"file-scanner/scanner"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

var port int          //порт сервера
var basePath string   //базовый путь
var StatServer string //ссылка на статистику
var Stat string       //ссылка на статичкику для верстки

// хранит инвормацию для таблицы стаистики в mysql
type StatisticInfo struct {
	Path        string //путь к файлц или деректории
	SizeInt64   int64  //размер файла или директории в байтах
	Size        string //размер файла отформатированный
	ElapsedTime int64  //время выполнения
}

// filesHandler handles HTTP requests for the root path.
func filesHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	root := r.URL.Query().Get("root")
	sort := r.URL.Query().Get("sort")
	if root == "" {
		root = basePath
	}
	fileInfos, err := scanner.FileScanner(root, sort)
	if err != nil {
		fmt.Println(err)
		return
	}
	fileInfos.BasePath = root
	fileInfos.StatisticLink = Stat

	jsonData, err := json.Marshal(fileInfos)
	if err != nil {
		http.Error(w, "Error serializing to JSON", http.StatusInternalServerError)
		return
	}
	//горутина отправляет данные статистики
	go func(fileInfos scanner.Info) {
		var Statistic StatisticInfo = StatisticInfo{
			Path:        fileInfos.BasePath,
			SizeInt64:   fileInfos.RootInfo.SizeInt64,
			Size:        fileInfos.RootInfo.Size,
			ElapsedTime: fileInfos.Time,
		}

		jsonStatistic, err := json.Marshal(Statistic)
		if err != nil {
			http.Error(w, "Error serializing to JSON", http.StatusInternalServerError)
			return
		}

		fmt.Printf("%v\n", Statistic)
		resp, err := http.Post("http://localhost/Statistic/post-statistic.php", "applicaton/json", bytes.NewBuffer(jsonStatistic))
		if err != nil {
			log.Println("Ошибка при отправке запроса:", err)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			log.Printf("Ошибка при отправке запроса, статус ответа: %s\n", resp.Status)
			return
		}

		fmt.Println("Зарос успешно отправлен на apache, статус ответа:", resp.Status)

	}(fileInfos)

	w.Write(jsonData)

}

func htmlHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	htmlFile, err := os.Open("../html/index.html")
	if err != nil {
		http.Error(w, "Error to opening HTML file", http.StatusInternalServerError)
		return
	}
	defer htmlFile.Close()

	scanner := bufio.NewScanner(htmlFile)
	for scanner.Scan() {
		w.Write(scanner.Bytes())
	}
}

// получает путь до конфига и возвращает конфиг ввиде map
func readConfigJson(src string) (map[string]interface{}, error) {
	file, err := os.Open(src)
	if err != nil {
		fmt.Println("Ошибка при открытии файла:", err)
		return nil, fmt.Errorf(fmt.Sprintf("Ошибка при открытии файла: %v\n", err))
	}
	defer file.Close()

	var config map[string]interface{}
	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&config); err != nil {
		return nil, fmt.Errorf(fmt.Sprintf("Ошибка при декодировании JSON: %v\n", err))
	}

	return config, nil
}

func main() {
	srcToConfig := "conf.json"

	config, err := readConfigJson(srcToConfig)
	if err != nil {
		log.Fatalf("Error: %v\n", err)
	}
	serverConfig := config["server"].(map[string]interface{})
	port = int(serverConfig["port"].(float64))
	basePath = fmt.Sprintf("%s", serverConfig["basePath"])
	StatServer = fmt.Sprintf("%s", serverConfig["StatServer"])
	Stat = fmt.Sprintf("%s", serverConfig["Stat"])

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	mux := http.NewServeMux()
	mux.HandleFunc("/files/", filesHandler)
	mux.HandleFunc("/", htmlHandler)
	mux.Handle("/ui/", http.StripPrefix("/ui/", http.FileServer(http.Dir("../ui"))))
	server := &http.Server{
		Addr:    fmt.Sprintf(":%v", port),
		Handler: mux,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			fmt.Printf("Ошибка при заупуске сервера: %s\n", err)
			stop()
		}

	}()

	fmt.Printf("Сервер запущен на http://localhost:%v\n", port)

	<-ctx.Done()

	fmt.Println("Завершаем работу сервера...")
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer shutdownCancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		fmt.Printf("Ошибка при завершени работы сервера: %s\n", err)
	}

	fmt.Println("Сервер успешно завершен")

}
