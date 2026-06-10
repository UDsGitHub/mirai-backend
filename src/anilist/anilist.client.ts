import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

@Injectable()
export class AnilistClient {
  private readonly url = 'https://graphql.anilist.co';

  constructor(private readonly httpService: HttpService) {}

  async query<T>(
    document: string,
    variables?: Record<string, unknown>,
  ): Promise<T> {
    const response = await firstValueFrom(
      this.httpService
        .post<GraphQLResponse<T>>(this.url, { query: document, variables })
        .pipe(map((res) => res.data)),
    );

    if (response.errors?.length) {
      throw new Error(response.errors.map((error) => error.message).join('; '));
    }

    if (!response.data) {
      throw new Error('AniList response did not include data');
    }

    return response.data;
  }
}
