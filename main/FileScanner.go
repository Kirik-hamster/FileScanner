package main

import (
	"bufio"
	"context"
	"encoding/json"
	"file-scanner/scanner"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// filesHandler handles HTTP requests for the root path.
func filesHandler(w http.ResponseWriter, r *http.Request) {
	//w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	root := r.URL.Query().Get("root")
	sort := r.URL.Query().Get("sort")
	fileInfos, err := scanner.FileScanner(root, sort)
	if err != nil {
		fmt.Println(err)
		return
	}

	jsonData, err := json.Marshal(fileInfos)
	if err != nil {
		http.Error(w, "Error serializing to JSON", http.StatusInternalServerError)
		return
	}

	htmlFile, err := os.Open("../ui/main.html")
	if err != nil {
		http.Error(w, "Error to opening HTML file", http.StatusInternalServerError)
		return
	}
	defer htmlFile.Close()

	data := struct {
		FilesJSON string
	}{
		FilesJSON: string(jsonData),
	}

	htmlContent := ""
	scanner := bufio.NewScanner(htmlFile)
	for scanner.Scan() {
		htmlContent += scanner.Text() + "\n"
	}
	tmpl := template.Must(template.New("ui").Parse(string(htmlContent)))
	err = tmpl.Execute(w, data)
	if err != nil {
		http.Error(w, "Error executing template", http.StatusInternalServerError)
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
	port := int(serverConfig["port"].(float64))

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	mux := http.NewServeMux()
	mux.HandleFunc("/", filesHandler)
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

	fmt.Println("Сервер запущен на http://localhost:8080")

	<-ctx.Done()

	fmt.Println("Завершаем работу сервера...")
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer shutdownCancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		fmt.Printf("Ошибка при завершени работы сервера: %s\n", err)
	}

	fmt.Println("Сервер успешно завершен")

}
