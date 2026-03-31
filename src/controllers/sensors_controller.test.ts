import Koa from "koa";
import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { database } from "../database";
import { SensorsController } from "./sensors_controller";
import { SensorsRepository } from "../repositories/sensors_repository";
import { SensorValuesRepository } from "../repositories/sensor_values_repository";
import { Timestamp } from "../utils/types";

const makeCtx = (params = {}, body = {}): Koa.Context =>
  ({ params, request: { body }, body: {}, status: 200 }) as unknown as Koa.Context;

describe("SensorsController", () => {
  beforeEach(() => {
    database.clear();
  });

  // list
  it("list: should return all sensors", async () => {
    await SensorsRepository.create({ name: "A" });
    await SensorsRepository.create({ name: "B" });

    const ctx = makeCtx();
    await SensorsController.list!(ctx);

    assert.deepEqual(ctx.body, [
      { id: 1, name: "A" },
      { id: 2, name: "B" },
    ]);
  });

  // read
  it("read: should return sensor with aggregated values", async () => {
    await SensorsRepository.create({ name: "Sensor Name" });
    await SensorValuesRepository.create({ timestamp: 123456789 as Timestamp, sensor_id: 1, values: [1, 2, 3] });
    await SensorValuesRepository.create({ timestamp: 123456790 as Timestamp, sensor_id: 1, values: [5, 4, 3] });

    const ctx = makeCtx({ id: 1 });
    await SensorsController.read!(ctx);

    assert.deepEqual(ctx.body, {
      id: 1,
      name: "Sensor Name",
      values: [
        [123456789, 2],
        [123456790, 4],
      ],
    });
  });

  it("read: should return 400 on invalid id", async () => {
    const ctx = makeCtx({ id: "abc" });
    await SensorsController.read!(ctx);

    assert.equal(ctx.status, 400);
    assert.equal((ctx.body as any).error, "Invalid id");
  });

  it("read: should return 404 for non-existent sensor", async () => {
    const ctx = makeCtx({ id: 999 });
    await SensorsController.read!(ctx);

    assert.equal(ctx.status, 404);
    assert.match((ctx.body as any).error, /Failed to find Sensor with id '999'/);
  });

  // update
  it("update: should update sensor name", async () => {
    await SensorsRepository.create({ name: "Initial" });

    const ctx = makeCtx({ id: 1 }, { name: "Updated" });
    await SensorsController.update!(ctx);

    assert.deepEqual(ctx.body, { id: 1, name: "Updated" });
  });

  it("update: should return 400 on invalid id", async () => {
    const ctx = makeCtx({ id: "abc" }, { name: "Updated" });
    await SensorsController.update!(ctx);

    assert.equal(ctx.status, 400);
    assert.equal((ctx.body as any).error, "Invalid request");
  });

  it("update: should return 400 on missing name", async () => {
    const ctx = makeCtx({ id: 1 }, {});
    await SensorsController.update!(ctx);

    assert.equal(ctx.status, 400);
    assert.equal((ctx.body as any).error, "Invalid request");
  });

  it("update: should trim whitespace from name", async () => {
    await SensorsRepository.create({ name: "Initial" });

    const ctx = makeCtx({ id: 1 }, { name: "  Updated  " });
    await SensorsController.update!(ctx);

    assert.deepEqual(ctx.body, { id: 1, name: "Updated" });
  });

  it("update: should return 400 on whitespace-only name", async () => {
    const ctx = makeCtx({ id: 1 }, { name: "   " });
    await SensorsController.update!(ctx);

    assert.equal(ctx.status, 400);
    assert.equal((ctx.body as any).error, "Invalid request");
  });

  it("update: should return 400 on empty name", async () => {
    const ctx = makeCtx({ id: 1 }, { name: "" });
    await SensorsController.update!(ctx);

    assert.equal(ctx.status, 400);
    assert.equal((ctx.body as any).error, "Invalid request");
  });

  it("update: should return 404 for non-existent sensor", async () => {
    const ctx = makeCtx({ id: 999 }, { name: "Ghost" });
    await SensorsController.update!(ctx);

    assert.equal(ctx.status, 404);
    assert.match((ctx.body as any).error, /Failed to find Sensor with id '999'/);
  });

  // delete
  it("delete: should delete sensor and its values", async () => {
    await SensorsRepository.create({ name: "BedSense A" });
    await SensorValuesRepository.create({ timestamp: 123456789 as Timestamp, sensor_id: 1, values: [1, 2, 3] });

    const ctx = makeCtx({ id: 1 });
    await SensorsController.delete!(ctx);

    assert.equal(ctx.status, 204);
    assert.deepEqual(await SensorsRepository.list(), []);
    assert.deepEqual(await SensorValuesRepository.list(), []);
  });

  it("delete: should return 400 on invalid id", async () => {
    const ctx = makeCtx({ id: "abc" });
    await SensorsController.delete!(ctx);

    assert.equal(ctx.status, 400);
    assert.equal((ctx.body as any).error, "Invalid id");
  });

  it("delete: should return 404 for non-existent sensor", async () => {
    const ctx = makeCtx({ id: 999 });
    await SensorsController.delete!(ctx);

    assert.equal(ctx.status, 404);
    assert.match((ctx.body as any).error, /Failed to find Sensor with id '999'/);
  });
});
