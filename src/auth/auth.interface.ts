import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export interface GqlContext {
  req: AuthenticatedRequest;
}
