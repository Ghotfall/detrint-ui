package stt

import (
	"bytes"
	"encoding/json"
	"github.com/ghotfall/detrint/state"
	"github.com/julienschmidt/httprouter"
	"github.com/pelletier/go-toml/v2"
	"io"
	"log"
	"mime/multipart"
	"net/http"
)

const (
	prefix = "/stt"
)

var (
	stateSet state.Set = nil
)

func GetStateSet() state.Set {
	return stateSet
}

func Register(router *httprouter.Router) {
	router.Handle(http.MethodGet, prefix, GetStateStatus)
	router.Handle(http.MethodPost, prefix, UploadStateFile)
}

func GetStateStatus(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	res := struct {
		Available bool      `json:"available"`
		StateSet  state.Set `json:"state_set,omitempty"`
	}{
		Available: false,
		StateSet:  nil,
	}

	if stateSet != nil {
		res.Available = true
	}

	full := r.URL.Query().Get("full")
	if full == "true" {
		res.StateSet = stateSet
	}

	resBytes, err := json.Marshal(res)
	if err != nil {
		log.Printf("Failed to marshal GetStateStatus response: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(resBytes)
}

func UploadStateFile(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	err := r.ParseMultipartForm(10 << 24)
	if err != nil {
		log.Printf("Failed to parse multipart form: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("stt")
	if err != nil {
		log.Printf("Failed to retrieve file: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	defer func(file multipart.File) {
		err := file.Close()
		if err != nil {
			log.Printf("Failed to close file: %v", err)
		}
	}(file)

	buffer := bytes.NewBuffer(nil)
	_, err = io.Copy(buffer, file)
	if err != nil {
		log.Printf("Failed to read file to buffer: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var s state.Set
	err = toml.Unmarshal(buffer.Bytes(), &s)
	if err != nil || len(s) == 0 {
		log.Printf("Failed to unmarshal state file: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	stateSet = s

	w.WriteHeader(http.StatusCreated)
}
