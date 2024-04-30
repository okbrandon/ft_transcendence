FROM golang:1.19

WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /gameserver

EXPOSE 8080

# Run
CMD ["/gameserver"]