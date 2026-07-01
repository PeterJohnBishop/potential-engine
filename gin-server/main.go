package main

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	r := gin.Default()

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://admin:secretpassword@localhost:5432/potential_engine_db?sslmode=disable"
	}

	ctx := context.Background()
	dbpool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		panic("Unable to connect to database: " + err.Error())
	}
	defer dbpool.Close()

	r.GET("/", func(c *gin.Context) {
		var currentTime time.Time

		// Query the time in Postgres
		err := dbpool.QueryRow(ctx, "SELECT NOW()").Scan(&currentTime)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"source":        "Go/Gin Backend",
			"db_status":     "connected",
			"postgres_time": currentTime.String(),
		})
	})

	r.Run(":8080")
}
