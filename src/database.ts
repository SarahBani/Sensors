import { Sensor } from "./repositories/sensors_repository";
import { SensorValue } from "./repositories/sensor_values_repository";

// In-memory persistence to simulate a database
class Database {
  sensors: Record<number, Sensor> = {};
  sensorValues: Record<number, SensorValue> = {};

  clear() {
    this.sensors = {};
    this.sensorValues = {};
  }
}

export const database = new Database();
