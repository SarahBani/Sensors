# Sensors API

A small REST API for managing medical sensors and their recorded values, built with Koa.js and TypeScript.

## Tech Stack

| Technology | Version |
|---|---|
| Node.js | ≥ 22 (iterator helpers required) |
| TypeScript | ^5.7 |
| Koa | ^2.15 |
| @koa/router | ^13.1 |
| @koa/bodyparser | ^5.1 |
| koa-logger | ^3.2 |
| Zod | ^3.23 |
| ts-node | ^10.9 |

## Project Structure

```
src/
├── app.ts                          # Koa app entry point
├── config.ts                       # Environment config (Zod-validated)
├── database.ts                     # In-memory database
├── router.ts                       # Route registration
├── seed.ts                         # Dev seed data
├── controllers/
│   ├── _controller.ts              # Controller interface
│   └── sensors_controller.ts       # Sensor CRUD handlers
├── repositories/
│   ├── _repository.ts              # Repository interface
│   ├── sensors_repository.ts       # Sensor data access
│   └── sensor_values_repository.ts # Sensor value data access
└── utils/
    ├── identifiers.ts              # Auto-increment helper
    └── types.ts                    # Branded types (Timestamp)
```

> **Note:** The database is in-memory only — data is lost on restart. The app seeds two sensors and 10 sample values on startup.

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the server

```bash
npm start
```

The server starts on port `1234` by default. To use a different port:

```bash
PORT=3000 npm start
```

On startup, the available routes are printed to the console:

```
Listening on http://localhost:1234

Routes:
=> GET,HEAD http://localhost:1234/sensors
=> POST http://localhost:1234/sensors
=> GET,HEAD http://localhost:1234/sensors/:id
=> POST http://localhost:1234/sensors/:id
=> DELETE http://localhost:1234/sensors/:id
```

## API Reference

### `GET /sensors`
Returns a list of all sensors.

**Response**
```json
[
  { "id": 1, "name": "BedSense A" },
  { "id": 2, "name": "BedSense B" }
]
```

### `GET /sensors/:id`
Returns a single sensor with its recorded values. Each value entry is `[timestamp, average]` where the average is computed across all simultaneous readings.

**Response**
```json
{
  "id": 1,
  "name": "BedSense A",
  "values": [
    [1712000000000, 2.5],
    [1712000000100, 4.0]
  ]
}
```

**Error responses:** `400` on invalid id, `404` if not found.

### `POST /sensors`
Creates a new sensor.

**Request body**
```json
{ "name": "BedSense C" }
```

### `POST /sensors/:id`
Updates a sensor's name. Whitespace is trimmed; empty/whitespace-only names are rejected.

**Request body**
```json
{ "name": "New Name" }
```

**Error responses:** `400` on invalid input, `404` if not found.

### `DELETE /sensors/:id`
Deletes a sensor and all its associated values.

**Response:** `204 No Content`

**Error responses:** `400` on invalid id, `404` if not found.

## Running Tests

Tests use Node.js's built-in test runner (`node:test`) — no extra test framework needed.

```bash
npm test
```

Test files are co-located with their source files (`*.test.ts`) and cover:

- `sensors_controller.test.ts` — controller-level tests (list, read, update, delete, edge cases)
- `sensors_repository.test.ts` — repository CRUD operations
- `sensor_values_repository.test.ts` — sensor value data access
- `utils/identifiers.test.ts` — auto-increment id utility

Each test suite resets the in-memory database in `beforeEach`, so tests are fully isolated.
