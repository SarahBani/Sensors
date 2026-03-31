import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { SensorValuesRepository } from "./sensor_values_repository";
import { database } from "../database";
import { Timestamp } from "../utils/types";

const entry1 = {
  sensor_id: 1,
  timestamp: 123456789 as Timestamp,
  values: [1, 2, 3],
};

const entry2 = {
  sensor_id: 2,
  timestamp: 123456790 as Timestamp,
  values: [3, 2, 1],
};

describe("SensorValuesRepository", () => {
  beforeEach(() => {
    database.clear();
  });

  it("should create", async () => {
    const result = await SensorValuesRepository.create(entry1);
    assert.deepEqual(result, entry1);
  });

  it("should list all without a filter", async () => {
    await Promise.all([
      SensorValuesRepository.create(entry1),
      SensorValuesRepository.create(entry2),
    ]);

    const list = await SensorValuesRepository.list();
    assert.deepEqual(list, [entry1, entry2]);
  });

  it("should be able to list with a filter", async () => {
    await Promise.all([
      SensorValuesRepository.create(entry1),
      SensorValuesRepository.create(entry2),
    ]);

    const list = await SensorValuesRepository.list(
      (value) => value.sensor_id === 2,
    );

    assert.deepEqual(list, [entry2]);
  });

  it("should read by timestamp", async () => {
    await SensorValuesRepository.create(entry1);

    const result = await SensorValuesRepository.read(entry1.timestamp);

    assert.deepEqual(result, entry1);
  });

  it("should throw when reading a non-existent timestamp", async () => {
    await assert.rejects(
      () => SensorValuesRepository.read(999 as Timestamp),
      /Failed to find SensorValue with timestamp '999'/,
    );
  });

  it("should update by timestamp", async () => {
    await SensorValuesRepository.create(entry1);

    const updated = await SensorValuesRepository.update(entry1.timestamp, {
      sensor_id: 1,
      values: [9, 9, 9],
    });

    assert.deepEqual(updated, { ...entry1, values: [9, 9, 9] });
  });

  it("should throw when updating a non-existent timestamp", async () => {
    await assert.rejects(
      () =>
        SensorValuesRepository.update(999 as Timestamp, {
          sensor_id: 1,
          values: [],
        }),
      /Failed to find SensorValue with timestamp '999'/,
    );
  });

  it("should delete by timestamp", async () => {
    await SensorValuesRepository.create(entry1);
    await SensorValuesRepository.delete(entry1.timestamp);

    const list = await SensorValuesRepository.list();
    assert.deepEqual(list, []);
  });

  it("should throw when deleting a non-existent timestamp", async () => {
    await assert.rejects(
      () => SensorValuesRepository.delete(999 as Timestamp),
      /Failed to find SensorValue with timestamp '999'/,
    );
  });

  it("should deleteBySensorId", async () => {
    await Promise.all([
      SensorValuesRepository.create(entry1),
      SensorValuesRepository.create(entry2),
    ]);

    await SensorValuesRepository.deleteBySensorId(entry1.sensor_id);

    const list = await SensorValuesRepository.list();
    assert.deepEqual(list, [entry2]);
  });

  it("should do nothing when deleteBySensorId finds no matches", async () => {
    await SensorValuesRepository.create(entry1);

    await SensorValuesRepository.deleteBySensorId(999);

    const list = await SensorValuesRepository.list();
    assert.deepEqual(list, [entry1]);
  });
});
