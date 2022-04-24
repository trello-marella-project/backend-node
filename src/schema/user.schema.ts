import { object, string, TypeOf } from "zod";

export const registerUserSchema = object({
  body: object({
    username: string({
      required_error: "Username is required",
    }),
    password: string({
      required_error: "Username is required",
    }).min(6, "Password too short — should be 6 chars minimum"),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }),
});

export type RegisterUserInput = TypeOf<typeof registerUserSchema>;

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    password: string({
      required_error: "Username is required",
    }).min(6, "Password too short — should be 6 chars minimum"),
  }),
});

export type LoginUserInput = TypeOf<typeof loginUserSchema>;
