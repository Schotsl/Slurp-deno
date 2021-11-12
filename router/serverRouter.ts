import { Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";

import mysqlClient from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/connections/mysql.ts";
import ServerController from "../controller/ServerController.ts";

const serverController = new ServerController(mysqlClient);
const serverRouter = new Router({
  prefix: "/v1/server",
});

serverRouter.get(
  "/",
  serverController.getCollection.bind(serverController),
);

serverRouter.post(
  "/",
  serverController.addObject.bind(serverController),
);

serverRouter.put(
  "/:uuid",
  serverController.updateObject.bind(serverController),
);

serverRouter.delete(
  "/:uuid",
  serverController.removeObject.bind(serverController),
);

export default serverRouter;
