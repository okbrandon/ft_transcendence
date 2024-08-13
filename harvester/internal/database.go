package internal

import (
	"database/sql"
	"fmt"
	"os"
	"strings"

	log "github.com/charmbracelet/log"
	_ "github.com/lib/pq"
)

func getEnv(key string) string {
	if value, exists := os.LookupEnv(key); exists {
		log.Debug("Environment variable retrieved", "key", key, "value", value)
		return value
	}
	log.Debug("Environment variable not found", "key", key)
	return ""
}

func getUsersWithFlag(flag int) ([]string, error) {
	dbHost := "postgres"
	dbPort := "5432"
	dbUser := getEnv("POSTGRES_USER")
	dbPassword := getEnv("POSTGRES_PASSWORD")
	dbName := getEnv("POSTGRES_DB")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)
	log.Debug("Connecting to database", "connectionString", connStr)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to open database connection", "err", err)
		return nil, err
	}
	defer db.Close()

	query := "SELECT \"userID\" FROM api_user WHERE (flags & $1) = $1"
	log.Debug("Executing query", "query", query, "flag", flag)

	rows, err := db.Query(query, flag)
	if err != nil {
		log.Error("Query execution failed", "err", err)
		return nil, err
	}
	defer rows.Close()

	var userIDs []string
	for rows.Next() {
		var userID string
		if err := rows.Scan(&userID); err != nil {
			log.Error("Failed to scan userID", "err", err)
			return nil, err
		}
		userIDs = append(userIDs, userID)
		log.Debug("UserID retrieved", "userID", userID)
	}

	if err := rows.Err(); err != nil {
		log.Error("Error encountered during rows iteration", "err", err)
		return nil, err
	}

	log.Debug("UserIDs retrieved successfully", "userIDs", userIDs)

	// Remove flag after collecting user IDs
	for _, userID := range userIDs {
		query := `UPDATE api_user SET flags = flags & ~(CAST($1 AS integer)) WHERE "userID" = $2`
		if _, err := db.Exec(query, flag, userID); err != nil {
			log.Error("Error removing user flag", "userID", userID, "err", err)
		} else {
			log.Debug("User flag removed successfully", "userID", userID)
		}
	}

	return userIDs, nil
}

func getUserData(userID string, tableColumns map[string]string) (map[string][][]string, error) {
	dbHost := "postgres"
	dbPort := "5432"
	dbUser := getEnv("POSTGRES_USER")
	dbPassword := getEnv("POSTGRES_PASSWORD")
	dbName := getEnv("POSTGRES_DB")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)
	log.Debug("Connecting to database for user data", "connectionString", connStr)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to open database connection", "err", err)
		return nil, err
	}
	defer db.Close()

	userData := make(map[string][][]string)

	for table, column := range tableColumns {
		query := ""
		if strings.Contains(column, ",") {
			columns := strings.Split(column, ",")
			query = fmt.Sprintf("SELECT * FROM %s WHERE \"%s\" = $1 OR \"%s\" = $1", table, columns[0], columns[1])
		} else {
			query = fmt.Sprintf("SELECT * FROM %s WHERE \"%s\" = $1", table, column)
		}
		log.Debug("Executing query for user data", "query", query, "userID", userID)

		rows, err := db.Query(query, userID)
		if err != nil {
			log.Error("Query execution failed", "err", err)
			return nil, err
		}

		columns, err := rows.Columns()
		if err != nil {
			log.Error("Failed to retrieve columns", "err", err)
			return nil, err
		}
		log.Debug("Columns retrieved", "columns", columns)

		data := make([][]string, 0)
		data = append(data, columns)

		for rows.Next() {
			values := make([]interface{}, len(columns))
			valuePtrs := make([]interface{}, len(columns))

			for i := range columns {
				valuePtrs[i] = &values[i]
			}

			if err := rows.Scan(valuePtrs...); err != nil {
				log.Error("Failed to scan row values", "err", err)
				return nil, err
			}

			row := make([]string, len(columns))
			for i, val := range values {
				row[i] = fmt.Sprintf("%v", val)
			}

			data = append(data, row)
			log.Debug("Row data retrieved", "row", row)
		}

		userData[table] = data
		log.Debug("User data for table retrieved", "table", table, "data", data)
	}

	log.Debug("User data retrieval completed", "userData", userData)
	return userData, nil
}
