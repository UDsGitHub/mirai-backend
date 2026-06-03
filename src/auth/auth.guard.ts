import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { AuthenticatedRequest, GqlContext } from './auth.interface';
import { verifyToken as clerkVerifyToken } from '@clerk/backend';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  private getRequest(context: ExecutionContext): Request {
    if (context.getType<'http' | 'graphql'>() === 'http') {
      return context.switchToHttp().getRequest<Request>();
    }

    const gqlContext =
      GqlExecutionContext.create(context).getContext<GqlContext>();
    return gqlContext.req;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const jwtPayload = await clerkVerifyToken(token, {
      secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
    });

    if (!jwtPayload.sub) {
      throw new UnauthorizedException();
    }

    (request as AuthenticatedRequest).userId = jwtPayload.sub;
    return true;
  }
}
