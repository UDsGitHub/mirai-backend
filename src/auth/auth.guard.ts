import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private supabase: SupabaseClient | null = null;

  constructor(private readonly configService: ConfigService) {}

  private getSupabaseClient(): SupabaseClient {
    if (!this.supabase) {
      const url = this.configService.get<string>('SUPABASE_URL');
      const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

      if (!url || !key) {
        throw new Error(
          'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set',
        );
      }

      this.supabase = createClient(url, key);
    }

    return this.supabase;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const supabase = this.getSupabaseClient();
    const { data, error } = await supabase.auth.getClaims(token);

    if (error || !data?.claims) {
      throw new UnauthorizedException('Invalid Supabase token');
    }

    request.user = data.claims;
    return true;
  }
}
