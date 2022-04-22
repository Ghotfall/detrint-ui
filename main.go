package main

import (
	"context"
	"embed"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"time"
)

//go:embed web/build
var webBuild embed.FS

func main() {
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		log.Fatalf("Failed to create listener: %v", err)
	}

	sub, err := fs.Sub(webBuild, "web/build")
	if err != nil {
		log.Fatalf("Failed to create fs subtree: %v", err)
	}

	server := &http.Server{Handler: http.FileServer(http.FS(sub))}
	go func() {
		err := server.Serve(ln)
		if err == http.ErrServerClosed {
			log.Println("Server closed!")
		} else if err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	log.Printf("Address: http://%s", ln.Addr())

	sign := make(chan os.Signal, 1)
	signal.Notify(sign, os.Interrupt)
	<-sign

	timeout, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	err = server.Shutdown(timeout)
	if err != nil {
		log.Fatalf("Failed to stop server: %v", err)
	}
}
