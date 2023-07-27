export class TokenExpiratedError extends Error {
  constructor() {
    super('Token expirated');
  }
}
