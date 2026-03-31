import Router from "@koa/router";
import { Controller } from "./controllers/_controller";
import { SensorsController } from "./controllers/sensors_controller";

const router = new Router();

const controllers: Record<string, Controller> = {
  "/sensors": SensorsController,
};

for (const [path, controller] of Object.entries(controllers)) {
  controller.list && router.get(path, controller.list);
  controller.create && router.post(path, controller.create);
  controller.read && router.get(`${path}/:id`, controller.read);
  controller.update && router.post(`${path}/:id`, controller.update);
  controller.delete && router.delete(`${path}/:id`, controller.delete);
}

export default router;
