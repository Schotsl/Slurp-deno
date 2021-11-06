import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import { Request, Response } from "https://deno.land/x/oak@v9.0.1/mod.ts";

import ServerEntity from "../entity/ServerEntity.ts";
import ServerRepository from "../repository/ServerRepository.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

export default class ServerController implements InterfaceController {
  private serverRepository: ServerRepository;

  constructor(mysqlClient: Client) {
    this.serverRepository = new ServerRepository(mysqlClient);
  }

  async getCollection(
    { request, response }: { request: Request; response: Response },
  ) {
    const limit = Number(request.url.searchParams.get(`limit`));
    const offset = Number(request.url.searchParams.get(`offset`));

    response.body = await this.serverRepository.getCollection(
      offset,
      limit,
    );
  }

  async removeObject(
    { params, response }: {
      request: Request;
      params: { uuid: string };
      response: Response;
    },
  ) {
    await this.serverRepository.removeObject(params.uuid);

    response.status = 204;
  }

  async updateObject(
    { request, params, response }: {
      request: Request;
      params: { uuid: string };
      response: Response;
    },
  ) {
    const body = await request.body();
    const value = await body.value;

    delete value.uuid;

    // validateUUID(value.user, "user", true);

    const server = new ServerEntity(params.uuid);

    // TODO: Prevent non existing properties from being copied

    Object.assign(server, value);

    response.body = await this.serverRepository.updateObject(server);
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    const body = await request.body();
    const value = await body.value;

    delete value.uuid;

    // validateUUID(value.user, "user");

    const server = new ServerEntity();
    Object.assign(server, value);

    response.body = await this.serverRepository.addObject(server);
  }
}