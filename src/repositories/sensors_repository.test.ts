import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { database } from "../database";
import { SensorsRepository } from "./sensors_repository";

describe("SensorsRepository", () => {
  beforeEach(() => {
    database.clear();
  });

  it("should create", async () => {
    const result = await SensorsRepository.create({ name: "Sensor" });
    assert.deepEqual(result, { id: 1, name: "Sensor" });
  });

  it("should auto-increment id on create", async () => {
    const a = await SensorsRepository.create({ name: "A" });
    const b = await SensorsRepository.create({ name: "B" });
    assert.equal(a.id, 1);
    assert.equal(b.id, 2);
  });

  it("should list all created sensors", async () => {
    await SensorsRepository.create({ name: "BedSense A" });
    await SensorsRepository.create({ name: "BedSense B" });

    const results = await SensorsRepository.list();

    assert.deepEqual(results, [
      { id: 1, name: "BedSense A" },
      { id: 2, name: "BedSense B" },
    ]);
  });

  it("should list with a filter", async () => {
    await SensorsRepository.create({ name: "BedSense A" });
    await SensorsRepository.create({ name: "BedSense B" });

    const results = await SensorsRepository.list(
      (s) => s.name === "BedSense B",
    );

    assert.deepEqual(results, [{ id: 2, name: "BedSense B" }]);
  });

  it("should read by id", async () => {
    const sensor = await SensorsRepository.create({ name: "BedSense A" });
    const result = await SensorsRepository.read(sensor.id);
    assert.deepEqual(result, sensor);
  });

  it("should throw when reading a non-existent id", async () => {
    await assert.rejects(
      () => SensorsRepository.read(999),
      /Failed to find Sensor with id '999'/,
    );
  });

  it("should update a record correctly", async () => {
    const sensor = await SensorsRepository.create({ name: "BedSense X" });

    const updated = await SensorsRepository.update(sensor.id, {
      name: "BedSense Y",
    });

    const expected = { id: 1, name: "BedSense Y" };
    assert.deepEqual(updated, expected);
    assert.deepEqual(await SensorsRepository.list(), [expected]);
  });

  it("should throw when updating a non-existent id", async () => {
    await assert.rejects(
      () => SensorsRepository.update(999, { name: "Ghost" }),
      /Failed to find Sensor with id '999'/,
    );
  });

  it("should delete by id", async () => {
    const sensor = await SensorsRepository.create({ name: "BedSense A" });
    await SensorsRepository.delete(sensor.id);
    assert.deepEqual(await SensorsRepository.list(), []);
  });

  it("should throw when deleting a non-existent id", async () => {
    await assert.rejects(
      () => SensorsRepository.delete(999),
      /Failed to find Sensor with id '999'/,
    );
  });
});
