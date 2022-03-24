import { Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { authenticationHandler } from "../middleware.ts";

import EntryController from "../controller/EntryController.ts";

const entryRouter = new Router({ prefix: "/v1/entry" });
const entryController = new EntryController("entry");

const get = entryController.getCollection.bind(entryController);
const post = entryController.addObject.bind(entryController);
const remove = entryController.removeObject.bind(entryController);

entryRouter.use(authenticationHandler);

entryRouter.get("/", get);
entryRouter.post("/", post);
entryRouter.delete("/:uuid", remove);

export default entryRouter;
