FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install curl for healthchecks and any other small deps
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests
COPY package*.json ./

# Install dependencies (production by default)
RUN npm ci --only=production

# Copy app sources
COPY . .

# Expose port
EXPOSE 5000

# Default environment
ENV NODE_ENV=production

# Use non-root user for security
RUN useradd --user-group --create-home --shell /bin/false appuser || true
RUN chown -R appuser:appuser /usr/src/app
USER appuser

CMD ["npm", "start"]
