# The Momo Hiring Challenge

This repository contains a simple backend api which could use some improvements. The goal is to test your ability to make changes to code that you could encounter when working at Momo. Below, we have listed some challenges for you to complete. Good luck and have fun!

## Getting Started

- Have Node.js >=22 installed.
- `npm install`
- `npm start` to start the server.
- `npm test` to run tests.

## Some Context

This app concerns itself mostly with two concepts: `Sensors` and `SensorValues`. To keep the challenge focused, their data is simply stored in-memory. For convenience, we already insert some data on server start.

- `GET http://localhost:1234/sensors` lists all sensors
- `GET http://localhost:1234/sensors/1` returns a single sensor and includes its sensor values

## Challenges

### A. Implement a delete method

Currently, `SensorValuesRepository.delete` lacks an implementation. Implement this method and show that it actually deletes the sensor value.

### B. Validation

When updating a sensor, we allow the user to input anything they want into the `Sensor` object! Please add proper validation so this can't happen.

### C. Transformation

In `SensorsController.read`, we don't want to return the full `SensorValue` objects. Instead we'd like to receive a concise array in the format: `[[timestamp, average of the three values], ...]`. For example, `[[123456789, 2], [123456790, 4]]`.

### D. Something better than "Internal Server Error"

Sometimes reading can fail, for various reasons! In `SensorsController.read`, make sure that we always return an understandable error response to the client.

### E. A Different Idea

We'd like to remove the `id` from `SensorValue` objects completely, and instead use the `timestamp` as identifier for reading/writing. Creating a new `SensorValue` should use the current time.

Note: The `Repository` interface is currently not fitted to accomodate this, so you will probably need to refactor some of the types there.
