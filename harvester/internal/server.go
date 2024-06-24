package internal

import (
	"time"

	"github.com/charmbracelet/log"
)

// Tables and columns where the userID is stored
var tablesAndColumns = map[string]string{
	"users": "userID",
}

func HarvestUsers() {
	for {
		userIDs, err := getUsersWithFlag(1 << 2)
		if err != nil {
			log.Error("Error fetching users with flag", "err", err)
			continue
		}

		for _, userID := range userIDs {
			log.Info("Harvesting", "userID", userID)

			userData, err := getUserData(userID, tablesAndColumns)
			if err != nil {
				log.Error("Error fetching user data", "err", err)
				continue
			}

			if err := exportCSV(userID, userData); err != nil {
				log.Error("Error exporting CSV", "err", err)
				continue
			}

			if err := zipAndMove(userID); err != nil {
				log.Error("Error creating ZIP file", "err", err)
				continue
			}

			log.Info("ZIP export successful", "userID", userID)
		}

		time.Sleep(3 * time.Minute)
	}
}
