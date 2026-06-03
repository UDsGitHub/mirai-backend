import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        CLERK_SECRET_KEY: 'test-secret-key',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    guard = module.get(AuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw if the token is missing for HTTP requests', async () => {
    const context = {
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(mockConfigService.get).not.toHaveBeenCalled();
  });

  it('should throw if the token is missing for GraphQL requests', async () => {
    const context = {
      getType: () => 'graphql',
    } as ExecutionContext;

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({
        req: { headers: {} },
      }),
    } as unknown as GqlExecutionContext);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(mockConfigService.get).not.toHaveBeenCalled();
  });
});
