import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authGuard: AuthGuard) {}

  @Get()
  @UseGuards(AuthGuard)
  getHello(@Req() request: any): string {
    return this.appService.getHello(request.user.sub);
  }
}
