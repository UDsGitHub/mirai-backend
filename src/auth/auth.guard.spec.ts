import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard()).toBeDefined();
  });

  it('should throw an error if the token is missing', () => {
    const guard = new AuthGuard();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as ExecutionContext;
    expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});
