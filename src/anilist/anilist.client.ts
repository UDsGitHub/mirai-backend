import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class AnilistClient {
  private readonly url = 'https://graphql.anilist.co';

  constructor(private readonly httpService: HttpService) {}

  async query<T>(
    document: string,
    variables?: Record<string, unknown>,
  ): Promise<T> {
    return await firstValueFrom<T>(
      this.httpService
        .post(this.url, JSON.stringify({ query: document, variables }))
        .pipe(map((response) => response.data as T)),
    );
  }
}
