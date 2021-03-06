import { convertObjectsToArray } from "../utils/helpers";
import UserService from "./user.service";
import { SpaceModel } from "../models/space.model";

class ConvertedService {
  async getConvertedSpace({ space }: { space: any }) {
    // TODO перенести все в dtos
    return {
      is_public: space.is_public,
      name: space.name,
      tags: await convertObjectsToArray({
        input: space.tags,
        property: "name",
      }),
      members: await convertObjectsToArray({
        input: space.permissions,
        property: "user_id",
        callback: async (input) => {
          const username = await UserService.getUsernameById({
            user_id: input,
          });
          console.log("username", username);
          return username;
        },
      }),
    };
  }

  async getConvertedSpaces({ spaces }: { spaces: SpaceModel[] }) {
    // TODO убрать и изменить на джоины (возможно создать индекс)
    let convertedSpaces = [];
    for (const id in spaces) {
      const username = await UserService.getUsernameById({
        user_id: spaces[id].user_id,
      });
      convertedSpaces.push({
        space_id: spaces[id].space_id,
        name: spaces[id].name,
        is_public: spaces[id].is_public,
        username,
      });
    }

    return convertedSpaces;
  }

  async getConvertedAllSpaces({ spaces }: { spaces: any }) {
    // TODO нормально переделать ...
    // TODO сделать не any
    let convertedSpaces = [];
    for (const id in spaces) {
      const username = await UserService.getUsernameById({
        user_id: spaces[id].user_id,
      });

      convertedSpaces.push({
        space_id: spaces[id].space_id,
        name: spaces[id].name,
        tags: convertObjectsToArray({
          input: spaces[id].tags,
          property: "name",
        }),
        username,
      });
    }
    return convertedSpaces;
  }

  async getConvertedWorkspace({ space }: { space: any }) {
    // TODO change any
    return {
      space_id: space.space_id,
      name: space.name,
      is_public: space.is_public,
      members: await convertObjectsToArray({
        input: space.permissions,
        property: "user_id",
        callback: async (input) =>
          await UserService.getUsernameById({
            user_id: input,
          }),
      }),
      blocks: space.blocks.map((block: any) => ({
        name: block.name,
        block_id: block.block_id,
        cards: block.cards.map((card: any) => ({
          card_id: card.card_id,
          name: card.name,
          description: card.description,
        })),
      })),
    };
  }
}

export default new ConvertedService();
