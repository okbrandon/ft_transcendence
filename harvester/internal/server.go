package internal

import (
	"time"

	log "github.com/charmbracelet/log"
)

// Tables and columns where the userID is stored
var tablesAndColumns = map[string]string{
	"api_user":     "userID",
	"api_purchase": "userID",
	//"api_match":            "json:id:playerA,json:id:playerB",
	"api_verificationcode": "userID",
	"api_usersettings":     "userID",
	"api_relationship":     "userA,userB",
}

func HarvestUsers() {
	for {
		userIDs, err := getUsersWithFlag(1 << 3)
		if err != nil {
			log.Error("Error fetching users with flag", "err", err)
			continue
		}

		log.Debug("Fetched user IDs", "count", len(userIDs))

		for _, userID := range userIDs {
			log.Info("Harvesting", "userID", userID)

			userData, err := getUserData(userID, tablesAndColumns)
			if err != nil {
				log.Error("Error fetching user data", "userID", userID, "err", err)
				continue
			}

			log.Debug("User data retrieved", "userID", userID)

			if err := exportCSV(userID, userData); err != nil {
				log.Error("Error exporting CSV", "userID", userID, "err", err)
				continue
			}

			log.Debug("CSV exported successfully", "userID", userID)

			if err := zipAndMove(userID); err != nil {
				log.Error("Error creating ZIP file", "userID", userID, "err", err)
				continue
			}

			log.Info("ZIP export successful", "userID", userID)
		}

		log.Debug("Sleeping for 3 minutes before next harvest")
		time.Sleep(3 * time.Minute)
	}
}
