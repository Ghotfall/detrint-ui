package main

import (
	"context"
	"embed"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"io/fs"
	"log"
	"mime/multipart"
	"net"
	"net/http"
	"os"
	"os/signal"
)

//go:embed web/build
var webBuild embed.FS

func main() {
	// WebUI part
	uiLn, err := net.Listen("tcp", "127.0.0.1:7057")
	if err != nil {
		log.Fatalf("Failed to create WebUI listener: %v", err)
	}

	sub, err := fs.Sub(webBuild, "web/build")
	if err != nil {
		log.Fatalf("Failed to create fs subtree: %v", err)
	}

	uiServer := &http.Server{Handler: http.FileServer(http.FS(sub))}
	go func() {
		err := uiServer.Serve(uiLn)
		if err == http.ErrServerClosed {
			log.Println("WebUI server is closed!")
		} else if err != nil {
			log.Fatalf("Failed to start WebUI server: %v", err)
		}
	}()
	log.Printf("WebUI address: http://%s", uiLn.Addr())

	// API part
	apiLn, err := net.Listen("tcp", "127.0.0.1:7058")
	if err != nil {
		log.Fatalf("Failed to create API listener: %v", err)
	}

	router := httprouter.New()
	router.GET("/", func(w http.ResponseWriter, request *http.Request, params httprouter.Params) {
		_, _ = fmt.Fprint(w, "TEST!")
	})
	router.POST("/upload", func(w http.ResponseWriter, request *http.Request, params httprouter.Params) {
		log.Println("File upload started!")

		w.Header().Set("Access-Control-Allow-Origin", "*")

		err := request.ParseMultipartForm(10 << 24)
		if err != nil {
			log.Printf("Failed to parse multipart form: %v", err)
		}

		file, header, err := request.FormFile("file")
		if err != nil {
			log.Printf("Failed to retrieve file: %v", err)
		}
		defer func(file multipart.File) {
			err := file.Close()
			if err != nil {
				log.Printf("Failed to close file: %v", err)
			}
		}(file)

		log.Printf("Uploaded File: %s", header.Filename)
		log.Printf("File Size: %d", header.Size)
		log.Printf("MIME Header: %+v\n", header.Header)

		_, _ = fmt.Fprint(w, `{"result": "Success!"}`)
	})

	apiServer := &http.Server{Handler: router}
	go func() {
		err := apiServer.Serve(apiLn)
		if err == http.ErrServerClosed {
			log.Println("API server is closed!")
		} else if err != nil {
			log.Fatalf("Failed to start API server: %v", err)
		}
	}()
	log.Printf("API address: http://%s", apiLn.Addr())

	// Shutdown
	sign := make(chan os.Signal, 1)
	signal.Notify(sign, os.Interrupt)
	<-sign

	err = uiServer.Shutdown(context.Background())
	if err != nil {
		log.Fatalf("Failed to stop WebUI server: %v", err)
	}
	err = apiServer.Shutdown(context.Background())
	if err != nil {
		log.Fatalf("Failed to stop API server: %v", err)
	}
}
