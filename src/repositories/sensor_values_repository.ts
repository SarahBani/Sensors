import { database } from "../database";
import { Timestamp } from "../utils/types";
import { Repository } from "./_repository";

export type SensorValue = {
  timestamp: Timestamp;
  sensor_id: number;
  values: number[];
};

export const SensorValuesRepository: Repository<SensorValue, "timestamp"> & {
  deleteBySensorId(sensorId: number): Promise<void>;
} = {
  async list(filter) {
    if (filter) {
      return Object.values(database.sensorValues).filter(filter);
    }
    return Object.values(database.sensorValues);
  },

  async create(data) {
    database.sensorValues[data.timestamp] = data;
    return data;
  },

  async read(timestamp) {
    const value = database.sensorValues[timestamp];
    if (!value) {
      throw new Error(
        `Failed to find SensorValue with timestamp '${timestamp}'`,
      );
    }
    return value;
  },

  async update(timestamp, data) {
    if (!database.sensorValues[timestamp]) {
      throw new Error(
        `Failed to find SensorValue with timestamp '${timestamp}'`,
      );
    }
    const value = { timestamp, ...data };
    database.sensorValues[timestamp] = value;
    return value;
  },

  async delete(timestamp) {
    if (!database.sensorValues[timestamp]) {
      throw new Error(`Failed to find SensorValue with timestamp '${timestamp}'`);
    }
    delete database.sensorValues[timestamp];
  },

  async deleteBySensorId(sensorId: number) {
    for (const key of Object.keys(database.sensorValues)) {
      if (database.sensorValues[Number(key)].sensor_id === sensorId) {
        delete database.sensorValues[Number(key)];
      }
    }
  },
};
