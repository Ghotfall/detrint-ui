package api

import (
	"github.com/ghotfall/detrint-ui/api/dpl"
	"github.com/ghotfall/detrint-ui/api/inv"
	"github.com/ghotfall/detrint-ui/api/stt"
	"github.com/julienschmidt/httprouter"
	"net/http"
)

func Register(router *httprouter.Router) {
	router.GlobalOPTIONS = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Access-Control-Request-Method") != "" {
			header := w.Header()
			header.Set("Access-Control-Allow-Methods", header.Get("Allow"))
			header.Set("Access-Control-Allow-Origin", "*")
		}

		w.WriteHeader(http.StatusNoContent)
	})

	inv.Register(router)
	stt.Register(router)
	dpl.Register(router)
}
