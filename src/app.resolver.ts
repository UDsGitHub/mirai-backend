import { Context, Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}
  
  @UseGuards(AuthGuard)
  @Query(() => String)
  hello(@Context() context: any): string {
    return this.appService.getHello(context.req.user.sub);
  }
}
