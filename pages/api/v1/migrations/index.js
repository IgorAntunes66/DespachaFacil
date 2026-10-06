import { createRouter } from "next-connect";
import controller from "infra/controller";
import migrationsModel from "models/migrations";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler({
  onError: controller.errorHandlers.onError,
  onNoMatch(request, response) {
    response.setHeader("Allow", "GET, HEAD, POST");
    return controller.errorHandlers.onNoMatch(request, response);
  },
});

async function getHandler(request, response) {
  const pendingMigrations = await migrationsModel.listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrationsModel.applyPendingMigrations();
  const statusCode = migratedMigrations.length > 0 ? 201 : 200;
  return response.status(statusCode).json(migratedMigrations);
}
