import { CustomApiError } from "./";

class BadRequestError extends CustomApiError {
  constructor(message: string) {
    super(message, 400);
    this.statusCode = 400;
  }
}

export { BadRequestError };
