package internal

import (
	"archive/zip"
	"io"
	"os"
	"path/filepath"

	log "github.com/charmbracelet/log"
)

func zipAndMove(userID string) error {
	outputDir := "output"
	exportDir := "/exports"

	log.Debug("Creating export directory", "dir", exportDir)
	if err := os.MkdirAll(exportDir, os.ModePerm); err != nil {
		log.Error("Failed to create export directory", "dir", exportDir, "err", err)
		return err
	}

	zipFileName := filepath.Join(exportDir, userID+".zip")
	log.Debug("Creating ZIP file", "file", zipFileName)
	zipFile, err := os.Create(zipFileName)
	if err != nil {
		log.Error("Failed to create ZIP file", "file", zipFileName, "err", err)
		return err
	}
	defer zipFile.Close()

	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()

	files, err := filepath.Glob(filepath.Join(outputDir, userID+"_*.csv"))
	if err != nil {
		log.Error("Failed to list CSV files", "dir", outputDir, "err", err)
		return err
	}

	log.Debug("Found CSV files to add to ZIP", "files", files)
	for _, file := range files {
		if err := addFileToZip(zipWriter, file); err != nil {
			log.Error("Failed to add file to ZIP", "file", file, "err", err)
			return err
		}
	}

	log.Info("ZIP file created successfully", "file", zipFileName)
	return nil
}

func addFileToZip(zipWriter *zip.Writer, filePath string) error {
	log.Debug("Opening file for ZIP", "file", filePath)
	file, err := os.Open(filePath)
	if err != nil {
		log.Error("Failed to open file", "file", filePath, "err", err)
		return err
	}
	defer file.Close()

	w, err := zipWriter.Create(filepath.Base(filePath))
	if err != nil {
		log.Error("Failed to create file in ZIP", "file", filePath, "err", err)
		return err
	}

	log.Debug("Copying file content to ZIP", "file", filePath)
	if _, err := io.Copy(w, file); err != nil {
		log.Error("Failed to copy file content to ZIP", "file", filePath, "err", err)
		return err
	}

	log.Debug("File added to ZIP", "path", filePath)
	return nil
}
