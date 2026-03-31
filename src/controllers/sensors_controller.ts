import { z } from "zod";
import { SensorValuesRepository } from "../repositories/sensor_values_repository";
import { SensorsRepository } from "../repositories/sensors_repository";
import { Controller } from "./_controller";

export const SensorsController: Controller = {
  async list(ctx) {
    const list = await SensorsRepository.list();
    ctx.body = list;
  },

  async read(ctx) {
    const parsed = z
      .object({
        id: z.coerce.number().nonnegative(),
      })
      .safeParse(ctx.params);

    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = { error: "Invalid id", details: parsed.error.issues };
      return;
    }

    const { id } = parsed.data;

    try {
      const sensor = await SensorsRepository.read(id);
      const values = await SensorValuesRepository.list(
        (value) => value.sensor_id === id,
      );

      ctx.body = {
        ...sensor,
        values: values.map(({ timestamp, values: v }) => [
          timestamp,
          v.reduce((sum, num) => sum + num, 0) / v.length,
        ]),
      };
    } catch (err) {
      ctx.status = 404;
      ctx.body = {
        error: err instanceof Error ? err.message : "Sensor not found",
      };
    }
  },

  async update(ctx) {
    const parsed = z
      .object({
        id: z.coerce.number().nonnegative(),
        name: z.string().trim().min(1),
      })
      .safeParse({ ...ctx.params, ...(ctx.request.body as object) });

    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = { error: "Invalid request", details: parsed.error.issues };
      return;
    }

    const { id, name } = parsed.data;

    try {
      const sensor = await SensorsRepository.update(id, { name });
      ctx.body = { ...sensor };
    } catch (err) {
      ctx.status = 404;
      ctx.body = {
        error: err instanceof Error ? err.message : "Sensor not found",
      };
    }
  },

  async delete(ctx) {
    const parsed = z
      .object({
        id: z.coerce.number().nonnegative(),
      })
      .safeParse(ctx.params);

    if (!parsed.success) {
      ctx.status = 400;
      ctx.body = { error: "Invalid id", details: parsed.error.issues };
      return;
    }

    const { id } = parsed.data;

    try {
      // const values = await SensorValuesRepository.list(
      //   (value) => value.sensor_id === id,
      // );
      // await Promise.all(
      //   values.map((value) => SensorValuesRepository.delete(value.timestamp)),
      // );

      await SensorValuesRepository.deleteBySensorId(id);
      await SensorsRepository.delete(id);
      ctx.status = 204;
    } catch (err) {
      ctx.status = 404;
      ctx.body = {
        error: err instanceof Error ? err.message : "Sensor not found",
      };
    }
  },
};
