package internal

import (
	"encoding/csv"
	"os"
	"path/filepath"

	"github.com/charmbracelet/log"
)

func exportCSV(userID string, userData map[string][][]string) error {
	outputDir := "output"

	if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
		return err
	}

	for table, data := range userData {
		filePath := filepath.Join(outputDir, userID+"_"+table+".csv")
		file, err := os.Create(filePath)
		if err != nil {
			return err
		}

		writer := csv.NewWriter(file)
		defer file.Close()

		for _, record := range data {
			if err := writer.Write(record); err != nil {
				return err
			}
		}
		writer.Flush()

		if err := writer.Error(); err != nil {
			return err
		}

		log.Debug("CSV exported", "file", filePath)
	}
	return nil
}
