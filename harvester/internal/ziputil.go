package internal

import (
	"archive/zip"
	"io"
	"os"
	"path/filepath"

	"github.com/charmbracelet/log"
)

func zipAndMove(userID string) error {
	outputDir := "output"
	exportDir := "exports"

	if err := os.MkdirAll(exportDir, os.ModePerm); err != nil {
		return err
	}

	zipFileName := filepath.Join(exportDir, userID+".zip")
	zipFile, err := os.Create(zipFileName)
	if err != nil {
		return err
	}
	defer zipFile.Close()

	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()

	files, err := filepath.Glob(filepath.Join(outputDir, userID+"_*.csv"))
	if err != nil {
		return err
	}

	for _, file := range files {
		if err := addFileToZip(zipWriter, file); err != nil {
			return err
		}
	}

	return nil
}

func addFileToZip(zipWriter *zip.Writer, filePath string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	w, err := zipWriter.Create(filepath.Base(filePath))
	if err != nil {
		return err
	}

	if _, err := io.Copy(w, file); err != nil {
		return err
	}

	log.Debug("File added to ZIP", "path", filePath)
	return nil
}
