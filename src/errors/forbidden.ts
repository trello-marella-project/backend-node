import { CustomApiError } from "./";

class ForbiddenError extends CustomApiError {
  constructor(message: string) {
    super(message, 403);
    this.statusCode = 403;
  }
}

export { ForbiddenError };
