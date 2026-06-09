export const GetAnimeRecommendationsByFilter = `
    query AnimePreviewRecommendations($genres: [Int], $genre_in: [String] $tag_in: [String]) {
        Media (type: ANIME, genre_in: $genres, tag_in: $tags, sort: [SCORE_DESC, POPULARITY_DESC]) {
            id
            title {
                english
                romaji
            }
            description
            genres
            tags {
                id
            }
            episodes
            status
            season
            seasonYear
            averageScore
            popularity
            bannerImage
            coverImage {
                medium
            }
            trailer {
                site
            }
        }
    }
`