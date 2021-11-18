import { Client } from "https://deno.land/x/mysql@v2.10.1/mod.ts";
import {
  validateTinyint,
  validateUUID,
} from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/validation.ts";
import {
  Request,
  Response,
  State,
} from "https://deno.land/x/oak@v9.0.1/mod.ts";

import EntryEntity from "../entity/EntryEntity.ts";
import EntryRepository from "../repository/EntryRepository.ts";
import InterfaceController from "https://raw.githubusercontent.com/Schotsl/Uberdeno/main/controller/InterfaceController.ts";

export default class EntryController implements InterfaceController {
  private entryRepository: EntryRepository;

  constructor(mysqlClient: Client) {
    this.entryRepository = new EntryRepository(mysqlClient);
  }

  async getCollection(
    { response, state }: {
      response: Response;
      state: State;
    },
  ) {
    response.body = await this.entryRepository.getCollection(
      state.offset,
      state.limit,
    );
  }

  async removeObject(
    { response, params, state }: {
      response: Response;
      request: Request;
      params: { uuid: string };
      state: State;
    },
  ) {
    await this.entryRepository.removeObject(params.uuid, state.uuid);

    response.status = 204;
  }

  async updateObject(
    { response, request, params, state }: {
      response: Response;
      request: Request;
      params: { uuid: string };
      state: State;
    },
  ) {
    const body = await request.body();
    const value = await body.value;

    delete value.uuid;
    value.server = state.uuid;

    validateUUID(value.player, "player", true);

    validateTinyint(value.sips, "sips", true);
    validateTinyint(value.shots, "shots", true);
    validateTinyint(value.giveable, "giveable", true);

    const entry = new EntryEntity(params.uuid);
    Object.assign(entry, value);

    response.body = await this.entryRepository.updateObject(entry);
  }

  async addObject(
    { response, request, state }: {
      response: Response;
      request: Request;
      state: State;
    },
  ) {
    const body = await request.body();
    const value = await body.value;

    delete value.uuid;
    value.server = state.uuid;

    validateUUID(value.player, "player");

    validateTinyint(value.sips, "sips", true);
    validateTinyint(value.shots, "shots", true);
    validateTinyint(value.giveable, "giveable", true);

    if (value.sips > 0 || value.shots > 0) {
      fetch('http://localhost:3000/hue/group', { method: 'post' });
    }

    const entry = new EntryEntity();
    Object.assign(entry, value);

    response.body = await this.entryRepository.addObject(entry);
  }
}
