import { Context, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import type { GqlContext } from './auth/auth.interface';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard)
  @Query(() => String)
  hello(@Context() context: GqlContext): string {
    return this.appService.getHello(context.req.userId);
  }
}
