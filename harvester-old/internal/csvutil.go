package internal

import (
	"encoding/csv"
	"os"
	"path/filepath"

	log "github.com/charmbracelet/log"
)

func exportCSV(userID string, userData map[string][][]string) error {
	outputDir := "output"
	log.Debug("Creating output directory", "dir", outputDir)

	if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
		log.Error("Failed to create output directory", "dir", outputDir, "err", err)
		return err
	}
	log.Debug("Output directory created successfully", "dir", outputDir)

	for table, data := range userData {
		filePath := filepath.Join(outputDir, userID+"_"+table+".csv")
		log.Debug("Creating CSV file", "file", filePath)

		file, err := os.Create(filePath)
		if err != nil {
			log.Error("Failed to create CSV file", "file", filePath, "err", err)
			return err
		}
		defer file.Close()

		writer := csv.NewWriter(file)
		log.Debug("Writing records to CSV file", "file", filePath)

		for _, record := range data {
			if err := writer.Write(record); err != nil {
				log.Error("Failed to write record to CSV", "file", filePath, "record", record, "err", err)
				return err
			}
		}
		writer.Flush()

		if err := writer.Error(); err != nil {
			log.Error("Error flushing writer", "file", filePath, "err", err)
			return err
		}

		log.Debug("CSV exported successfully", "file", filePath)
	}
	return nil
}
