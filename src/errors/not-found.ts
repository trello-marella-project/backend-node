import { CustomApiError } from "./";

class NotFoundError extends CustomApiError {
  constructor(message: string) {
    super(message, 404);
    this.statusCode = 404;
  }
}

export { NotFoundError };
