# Containerizing the Loan Union Scribe Application

This document provides instructions for building and running the Loan Union Scribe application using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine (optional, but recommended)

## Building and Running with Docker Compose

The easiest way to run the application is using Docker Compose:

```bash
# Clone the repository (if you haven't already)
git clone <repository-url>
cd loan-union-scribe

# Build and run the application
docker-compose up -d
```

This will build the Docker image and start a container running the application. The application will be available at http://localhost:80.

## Environment Variables

The application requires the following environment variables:

- `VITE_ODOO_URL`: The URL of your Odoo instance
- `VITE_ODOO_DB`: The name of your Odoo database

You can set these variables in a `.env` file in the project root, or pass them directly to Docker Compose:

```bash
VITE_ODOO_URL=https://your-odoo-instance.com VITE_ODOO_DB=your-database-name docker-compose up -d
```

## Building and Running with Docker

If you prefer to use Docker directly:

```bash
# Build the Docker image
docker build -t loan-union-scribe .

# Run the container
docker run -p 80:80 -e VITE_ODOO_URL=https://your-odoo-instance.com -e VITE_ODOO_DB=your-database-name loan-union-scribe
```

## How It Works

The application is containerized using a multi-stage build:

1. The first stage builds the React application using Node.js
2. The second stage serves the built static files using Nginx

Environment variables are injected at runtime using an entrypoint script that processes the `env.js` file. This allows you to change the environment variables without rebuilding the Docker image.

## Production Considerations

For a production deployment, consider:

1. **HTTPS**: Configure Nginx with SSL certificates
2. **Caching**: Add proper caching headers for static assets
3. **CI/CD**: Set up automated builds and deployments
4. **Health checks**: Add health check endpoints
5. **Logging**: Configure proper logging

## Troubleshooting

If you encounter issues:

1. Check that the environment variables are set correctly
2. Ensure that your Odoo instance is accessible from the container
3. Check the container logs: `docker-compose logs` or `docker logs <container-id>`