import { object, string, TypeOf } from "zod";

export const workspaceBlockSchema = object({
  body: object({
    name: string({
      required_error: "Block name is required",
    }),
  }),
});

export type WorkspaceBlockInput = TypeOf<typeof workspaceBlockSchema>;

export const workspaceCardSchema = object({
  body: object({
    name: string({
      required_error: "Card name is required",
    }),
    description: string({
      required_error: "Card description name is required",
    }),
  }),
});

export type WorkspaceCardInput = TypeOf<typeof workspaceCardSchema>;
