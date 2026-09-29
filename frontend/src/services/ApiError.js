// An error from the API with a safe, user-facing message and the HTTP status that caused it.
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
