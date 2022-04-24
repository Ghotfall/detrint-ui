package inv

import (
	"bytes"
	"encoding/json"
	"github.com/ghotfall/detrint/inv"
	"github.com/julienschmidt/httprouter"
	"github.com/pelletier/go-toml/v2"
	"io"
	"log"
	"mime/multipart"
	"net/http"
)

const (
	prefix      = "/inv"
	machinesURL = prefix + "/machines"
	machineURL  = machinesURL + "/:name"
	groupsURL   = prefix + "/groups"
	groupURL    = groupsURL + "/:name"
)

var (
	inventory *inv.Inventory = nil
)

func Register(router *httprouter.Router) {
	router.Handle(http.MethodGet, prefix, GetInventoryStatus)

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

		buffer := bytes.NewBuffer(nil)
		_, err = io.Copy(buffer, file)
		if err != nil {
			log.Printf("Failed to read file to buffer: %v", err)
		}

		var i inv.Inventory
		err = toml.Unmarshal(buffer.Bytes(), &i)
		if err != nil {
			log.Printf("Failed to unmarshal inventory file: %v", err)
		}

		log.Printf("Inventory: %v", i)

		iJson, err := json.Marshal(i)
		if err != nil {
			log.Printf("Failed to marshal inventory into JSON: %v", err)
		}

		_, _ = w.Write(iJson)
	})
}

func GetInventoryStatus(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	res := struct {
		Available bool           `json:"available"`
		Inventory *inv.Inventory `json:"inventory,omitempty"`
	}{
		Available: false,
		Inventory: nil,
	}

	if inventory != nil {
		res.Available = true
	}

	full := r.URL.Query().Get("full")
	if full == "true" {
		res.Inventory = inventory
	}

	resBytes, err := json.Marshal(res)
	if err != nil {
		log.Printf("Failed to marshal GetInventoryStatus response: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(resBytes)
}
