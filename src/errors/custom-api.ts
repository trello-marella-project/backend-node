interface CustomApiAttributes {
  statusCode: number;
}

class CustomApiError extends Error implements CustomApiAttributes {
  statusCode;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { CustomApiError };
