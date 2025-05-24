export class UnauthorizedError extends Error {
  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ServiceUninitializedError extends Error {
  constructor(message: string = "Service is not initialized") {
    super(message);
    this.name = "ServiceUninitializedError";
  }
}

export class InternalServerError extends Error {
  constructor(message: string = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
  }
}

export class MemoNotFoundError extends Error {
  constructor(message: string = "Memo not found") {
    super(message);
    this.name = "MemoNotFoundError";
  }
}

export class HashMismatchError extends Error {
  constructor(message: string = "Hash mismatch") {
    super(message);
    this.name = "HashMismatchError";
  }
}

export class MemoDatabaseCorruptedError extends Error {
  constructor(message: string = "Memo database is corrupted") {
    super(message);
    this.name = "MemoDatabaseCorruptedError";
  }
}
