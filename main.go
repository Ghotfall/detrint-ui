package main

import (
	"context"
	"embed"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
)

//go:embed web/build
var webBuild embed.FS

func main() {
	// WebUI part
	uiLn, err := net.Listen("tcp", "127.0.0.1:0")
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
	apiLn, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		log.Fatalf("Failed to create API listener: %v", err)
	}

	router := httprouter.New()
	router.GET("/", func(w http.ResponseWriter, request *http.Request, params httprouter.Params) {
		_, _ = fmt.Fprint(w, "TEST!")
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
