package main

import (
	"time"
	"transcendence/harvester/internal"

	log "github.com/charmbracelet/log"
)

func main() {
	log.SetReportCaller(true)
	log.SetLevel(log.InfoLevel)
	log.Info("Starting the harvester...")
	time.Sleep(10 * time.Second)
	internal.HarvestUsers()
}
