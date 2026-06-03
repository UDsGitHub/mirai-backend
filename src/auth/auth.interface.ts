import { Request } from 'express';

export interface JwtClaims {
  sub: string;
  [claim: string]: unknown;
}

export interface AuthenticatedRequest extends Request {
  user: JwtClaims;
}
