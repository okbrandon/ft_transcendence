package internal

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/charmbracelet/log"
	_ "github.com/lib/pq"
)

func getEnv(key string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return ""
}

func getUserData(userID string, tableColumns map[string]string) (map[string][][]string, error) {
	dbHost := getEnv("DB_HOST")
	dbPort := getEnv("DB_PORT")
	dbUser := getEnv("DB_USER")
	dbPassword := getEnv("DB_PASSWORD")
	dbName := getEnv("DB_NAME")

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	defer db.Close()

	userData := make(map[string][][]string)

	for table, column := range tableColumns {
		query := fmt.Sprintf("SELECT * FROM %s WHERE %s = $1", table, column)
		rows, err := db.Query(query, userID)
		if err != nil {
			return nil, err
		}

		columns, err := rows.Columns()
		if err != nil {
			return nil, err
		}

		data := make([][]string, 0)
		data = append(data, columns)

		for rows.Next() {
			values := make([]interface{}, len(columns))
			valuePtrs := make([]interface{}, len(columns))

			for i := range columns {
				valuePtrs[i] = &values[i]
			}

			rows.Scan(valuePtrs...)

			row := make([]string, len(columns))
			for i, val := range values {
				row[i] = fmt.Sprintf("%v", val)
			}

			data = append(data, row)
		}

		userData[table] = data
	}

	return userData, nil
}
