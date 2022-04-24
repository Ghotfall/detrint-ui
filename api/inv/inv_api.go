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
	router.Handle(http.MethodPost, prefix, UploadInventory)
	router.Handle(http.MethodGet, machinesURL, GetAllMachines)
	router.Handle(http.MethodGet, machineURL, GetMachine)
	router.Handle(http.MethodGet, groupsURL, GetAllGroups)
	router.Handle(http.MethodGet, groupURL, GetGroup)
}

func GetInventoryStatus(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
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

func UploadInventory(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	err := r.ParseMultipartForm(10 << 24)
	if err != nil {
		log.Printf("Failed to parse multipart form: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("inv")
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

	var i inv.Inventory
	err = toml.Unmarshal(buffer.Bytes(), &i)
	if err != nil {
		log.Printf("Failed to unmarshal inventory file: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	inventory = &i

	w.WriteHeader(http.StatusCreated)
}

func GetAllMachines(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	if inventory == nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	machinesBytes, err := json.Marshal(inventory.Machines)
	if err != nil {
		log.Printf("Failed to marshal machines: %v", err)
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(machinesBytes)
}

func GetMachine(w http.ResponseWriter, _ *http.Request, p httprouter.Params) {
	if inventory == nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	serverName := p.ByName("name")
	machine, ok := inventory.Machines[serverName]
	if !ok {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	machineBytes, err := json.Marshal(map[string]inv.Machine{serverName: machine})
	if err != nil {
		log.Printf("Failed to marshal machine '%s': %v", serverName, err)
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(machineBytes)
}

func GetAllGroups(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	if inventory == nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	groupsBytes, err := json.Marshal(inventory.Groups)
	if err != nil {
		log.Printf("Failed to marshal groups: %v", err)
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(groupsBytes)
}

func GetGroup(w http.ResponseWriter, _ *http.Request, p httprouter.Params) {
	if inventory == nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	groupName := p.ByName("name")
	group, ok := inventory.Groups[groupName]
	if !ok {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	groupBytes, err := json.Marshal(map[string]inv.Group{groupName: group})
	if err != nil {
		log.Printf("Failed to marshal group '%s': %v", groupName, err)
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(groupBytes)
}
