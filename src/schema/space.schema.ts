import { array, boolean, number, object, string, TypeOf } from "zod";

export const createSpaceSchema = object({
  body: object({
    name: string({
      required_error: "Space name is required",
    }).min(2, "Space name too short — should be 6 chars minimum"),
    is_public: boolean({
      required_error: "Is public is required",
    }),
    tags: array(string()),
    members: array(number()),
  }),
});

export type CreateSpaceInput = TypeOf<typeof createSpaceSchema>;
