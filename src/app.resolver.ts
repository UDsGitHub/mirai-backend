import { Context, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import type { AuthenticatedRequest } from './auth/auth.interface';

interface GqlContext {
  req: AuthenticatedRequest;
}

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard)
  @Query(() => String)
  hello(@Context() context: GqlContext): string {
    return this.appService.getHello(context.req.user.sub);
  }
}
