import { object, string, TypeOf } from "zod";

export const createWorkspaceBlockSchema = object({
  body: object({
    name: string({
      required_error: "Block name is required",
    }),
  }),
});

export type CreateWorkspaceBlockInput = TypeOf<
  typeof createWorkspaceBlockSchema
>;
