import { database } from "../database";
import { autoIncrement } from "../utils/identifiers";
import { Repository } from "./_repository";

export type Sensor = {
  id: number;
  name: string;
};

export const SensorsRepository: Repository<Sensor> = {
  async list(filter) {
    if (filter) {
      return Object.values(database.sensors).filter(filter);
    }
    return Object.values(database.sensors);
  },

  async create(data) {
    const id = autoIncrement(Object.keys(database.sensors).map(Number));
    const sensor: Sensor = {
      id,
      ...data,
    };
    database.sensors[id] = sensor;
    return sensor;
  },

  async read(id) {
    const sensor = database.sensors[id];
    if (!sensor) {
      throw new Error(`Failed to find Sensor with id '${id}'`);
    }
    return sensor;
  },

  async update(id, data) {
    if (!Object.keys(database.sensors).map(Number).includes(id)) {
      throw new Error(`Failed to find Sensor with id '${id}'`);
    }
    const sensor = { id, ...data };
    database.sensors[id] = sensor;
    return sensor;
  },

  async delete(id) {
    if (!database.sensors[id]) {
      throw new Error(`Failed to find Sensor with id '${id}'`);
    }
    delete database.sensors[id];
  },
};
