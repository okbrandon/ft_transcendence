package internal

import (
	"os"

	"github.com/charmbracelet/log"
)

var Logger = log.NewWithOptions(os.Stderr, log.Options{
	ReportCaller:    true,
	ReportTimestamp: true,
	Level:           log.DebugLevel,
})
