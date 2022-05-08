package dpl

import (
	"bufio"
	"bytes"
	"encoding/json"
	"github.com/ghotfall/detrint-ui/api/inv"
	"github.com/ghotfall/detrint-ui/api/stt"
	"github.com/julienschmidt/httprouter"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"log"
	"net/http"
)

const (
	prefix = "/dpl"
)

var (
	logs = ""
)

func Register(router *httprouter.Router) {
	router.Handle(http.MethodGet, prefix, GetDeployStatus)
	router.Handle(http.MethodPost, prefix, StartDeploy)
}

func GetDeployStatus(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	resBytes, err := json.Marshal(struct {
		Logs  string `json:"logs"`
		Count string `json:"count"`
	}{
		Logs:  logs,
		Count: "1/1",
	})

	if err != nil {
		log.Printf("Failed to marshal GetStateStatus response: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(resBytes)
}

func StartDeploy(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	i := inv.GetInventory()
	s := stt.GetStateSet()

	if i == nil {
		resBytes, err := json.Marshal(struct {
			Message string `json:"message"`
		}{
			Message: "No inventory provided",
		})
		if err != nil {
			log.Printf("Failed to marshal GetStateStatus response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNotAcceptable)
		_, _ = w.Write(resBytes)
		return
	}

	if s == nil {
		resBytes, err := json.Marshal(struct {
			Message string `json:"message"`
		}{
			Message: "No state set provided",
		})
		if err != nil {
			log.Printf("Failed to marshal GetStateStatus response: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNotAcceptable)
		_, _ = w.Write(resBytes)
		return
	}

	encoder := zapcore.NewJSONEncoder(zap.NewProductionEncoderConfig())
	var logsBuffer bytes.Buffer
	writer := bufio.NewWriter(&logsBuffer)

	logger := zap.New(zapcore.NewCore(encoder, zapcore.AddSync(writer), zapcore.DebugLevel))

	s.Deploy(*i, logger)
	_ = writer.Flush()
	logs = logsBuffer.String()

	w.WriteHeader(http.StatusAccepted)
}
