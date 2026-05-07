// src/modules/common/generateRouter.js
import express from "express";
import getUserID, { requireRole } from "../middleware/middleware.js";

// helper
const withMiddlewares = (route) => (route.middlewares ? route.middlewares : []);

export const commonRouter = (controller, permissionMap, options = {}) => {
  const common_router = express.Router();

  const listRoles = permissionMap.list;

  if (controller.list) {
    if (listRoles === "public") {
      common_router.get("/", controller.list);
    } else if (Array.isArray(listRoles)) {
      common_router.get(
        "/",
        requireRole("list", ...(permissionMap.list || [])),
        ...withMiddlewares(controller.list),
        controller.list,
      );
    }
  }
  if (controller.getOne) {
    common_router.get(
      "/:id",
      requireRole("view", ...(permissionMap.getOne || [])),
      ...withMiddlewares(controller.getOne),
      controller.getOne,
    );
  }

  // CREATE (optional)
  if (!options.skipCreate) {
    if (controller.create) {
      common_router.post(
        "/",
        requireRole("create", ...(permissionMap.create || [])),
        ...withMiddlewares(controller.create),
        controller.create,
      );
    }
    if (controller.update) {
      common_router.put(
        "/:id",
        requireRole("update", ...(permissionMap.update || [])),
        ...withMiddlewares(controller.update),
        controller.update,
      );
    }
  }

  // BULK DELETE (OPTIONAL)
  if (controller.removeMany) {
    common_router.delete(
      "/",
      requireRole("delete", ...(permissionMap.remove || [])),
      ...withMiddlewares(controller.removeMany),
      controller.removeMany,
    );
  }
  // DELETE
  if (controller.remove) {
    common_router.delete(
      "/:id",
      requireRole("delete", ...(permissionMap.remove || [])),
      ...withMiddlewares(controller.remove),
      controller.remove,
    );
  }
  // RESTORE (optional)
  if (controller.restore) {
    common_router.put(
      "/:id",
      requireRole("restore", ...(permissionMap.restore || [])),
      controller.restore,
    );
  }

  if (controller.restoreMany) {
    common_router.put(
      "/",
      requireRole("restore", ...(permissionMap.restore || [])),
      controller.restoreMany,
    );
  }
  // if (controller.fetchRouts) {
  //   common_router.get(
  //     "/",
  //     requireRole("fetchRouts", ...(permissionMap.fetchRouts || [])),
  //     controller.fetchRouts,
  //   );
  // }
  return common_router;
};
