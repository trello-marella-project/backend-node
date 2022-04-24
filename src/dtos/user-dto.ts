import { UserAttributes } from "../models/user.module";

class UserDto {
  email: string;
  user_id: number;
  is_enabled: boolean;
  role: "USER" | "ADMIN";

  constructor(model: UserAttributes) {
    this.email = model.email;
    this.user_id = model.user_id as number;
    this.is_enabled = model.is_enabled as boolean;
    this.role = model.role as "USER" | "ADMIN";
  }
}

export { UserDto };
