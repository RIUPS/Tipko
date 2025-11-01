# Tipko — Backend

This folder contains the backend API for the Tipko project (Express + MongoDB).

## Requirements

- Docker & Docker Compose (for containerized deployment)
- Node.js (for local development and running seeds/tests)
- A MongoDB instance if running locally (unless using Docker Compose)

## Quickstart — Docker Compose (recommended)

Start the application and a MongoDB server with Docker Compose from the `backend` directory:

```bash
# from backend/
docker compose up -d --build
```

This will:
- build the `tipko-backend` image using `backend/Dockerfile`
- start a `mongo` service (image `mongo:6.0`)
- expose the backend on port `5000`

Healthcheck: the backend container uses a simple HTTP healthcheck at `/`.

Environment variables used in Docker Compose (see `docker-compose.yml`):
- `MONGO_URI` — URI used by the app to connect to MongoDB (set to `mongodb://mongo:27017/tipko` inside compose)
- `PORT` — server port (default 5000)
- `JWT_SECRET` — JSON Web Token secret (change in production — use secrets or env files)

To stop and remove containers:

```bash
docker compose down
```

To view backend logs:

```bash
docker compose logs -f backend
```

## Running seeds

There are seed scripts inside `backend/seeds/` to populate the database with example lessons, achievements and users.

If running inside Docker Compose you can execute the seed scripts inside the backend container:

```bash
# runs seed:all inside the backend container
docker compose exec backend npm run seed:all
```

If running locally (with Node & a local MongoDB), from the `backend` folder:

```bash
# make sure MONGO_URI points to your local Mongo (e.g. mongodb://127.0.0.1:27017/tipko)
npm run seed:all
```

Individual seed scripts (available via `npm run`):
- `npm run seed:lessons` — seed lessons
- `npm run seed:achievements` — seed achievements
- `npm run seed:users` — seed users

## Running tests

The backend includes integration tests (Jest + Supertest). Tests expect a reachable MongoDB instance via `process.env.MONGO_URI` or default `mongodb://127.0.0.1:27017/tipko_test`.

Run tests locally:

```bash
cd backend
npm install
npm test
```

You can also run tests inside a container if you prefer to use Docker for an isolated environment — make sure a Mongo instance is available and `MONGO_URI` is set accordingly.

## Local development

Start the server with nodemon for local development (requires Node & packages installed):

```bash
npm install
# set MONGO_URI in .env or environment
npm run dev
```

## Notes

- For production deployments, don't store secrets in the compose file. Use environment files, Docker secrets, or a secrets manager.
- The test helper drops the test database after the suite runs — do not point `MONGO_URI` tests at a production database.
- If you need CI support, add a workflow that starts a Mongo service and runs `npm test`.
