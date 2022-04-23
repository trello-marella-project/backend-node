import { CustomApiError } from "./";

class UnauthenticatedError extends CustomApiError {
  constructor(message: string) {
    super(message, 401);
    this.statusCode = 401;
  }
}

export { UnauthenticatedError };
