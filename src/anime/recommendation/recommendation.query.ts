export const GET_ANIME_PREVIEW_RECOMMENDATIONS = `
  query AnimePreviewRecommendations(
    $genreIn: [String]
    $tagIn: [String]
    $perPage: Int
  ) {
    Page(page: 1, perPage: $perPage) {
      media(
        type: ANIME
        genre_in: $genreIn
        tag_in: $tagIn
        sort: [POPULARITY_DESC, SCORE_DESC]
        isAdult: false
      ) {
        id
        title {
          romaji
          english
        }
        description(asHtml: false)
        episodes
        status
        season
        seasonYear
        averageScore
        popularity
        bannerImage
        coverImage {
          large
          medium
        }
        trailer {
          id
          site
        }
        genres
        tags {
          id
          name
        }
      }
    }
  }
`;
