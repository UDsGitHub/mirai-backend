## Conventions

- **`user_id`** — Clerk JWT `sub` claim (`TEXT`). Same value across all user-scoped tables. `user_profile` row created on first authenticated request.
- **`anime_id`** — Always references **`anime.id`** (internal PK), never AniList `external_id`.
- **`external_id`** — AniList media id on `anime`; AniList tag id on `tag`. AniList is the only catalog source.
- **`genre_id` / `tag_id`** — Local surrogate keys on `genre` / `tag`, not AniList ids (except `tag.external_id` during sync).
- **Types** — Postgres types intended for Prisma / Supabase migrations.


## Tables

`user_profile` · `user_genre_preference` · `user_tag_preference` · `user_taste_profile` · `user_anime_entry` · `discussion` · `discussion_reply` · `discussion_up_vote` · `discussion_reply_up_vote` · `connection` · `activity_event` · `recommendation_session` · `recommendation_result` · `recommendation_share` · `catalog` · `catalog_item` · `anime` · `genre` · `anime_genre` · `tag` · `anime_tag`


### user_profile

| Column | Type | Constraints |
|--------|------|-------------|
| `user_id` | `TEXT` | PK |
| `display_name` | `TEXT` | |
| `avatar_url` | `TEXT` | nullable |
| `is_incognito` | `BOOLEAN` | NOT NULL, default `false` |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, default `now()` |


### user_genre_preference

| Column | Type | Constraints |
|--------|------|-------------|
| `user_id` | `TEXT` | PK (composite), FK → `user_profile.user_id` ON DELETE CASCADE |
| `genre_id` | `INTEGER` | PK (composite), FK → `genre.id` |
| `weight` | `REAL` | NOT NULL, CHECK `weight >= 0` |

**Table constraints:** UNIQUE (`user_id`, `genre_id`)


### user_tag_preference

| Column | Type | Constraints |
|--------|------|-------------|
| `user_id` | `TEXT` | PK (composite), FK → `user_profile.user_id` ON DELETE CASCADE |
| `tag_id` | `INTEGER` | PK (composite), FK → `tag.id` |
| `weight` | `REAL` | NOT NULL, CHECK `weight >= 0` |

**Table constraints:** UNIQUE (`user_id`, `tag_id`)


### user_anime_entry

| Column | Type | Constraints |
|--------|------|-------------|
| `user_id` | `TEXT` | PK (composite), FK → `user_profile.user_id` ON DELETE CASCADE |
| `anime_id` | `UUID` | PK (composite), FK → `anime.id` |
| `status` | `TEXT` | NOT NULL, CHECK ∈ `planned`, `watching`, `completed`, `rewatching`, `paused`, `dropped` |
| `score` | `SMALLINT` | nullable, CHECK `score BETWEEN 1 AND 10` when set |
| `episode_progress` | `INTEGER` | NOT NULL, default `0`, CHECK `episode_progress >= 0` |
| `start_date` | `DATE` | nullable |
| `finish_date` | `DATE` | nullable |
| `total_rewatches` | `INTEGER` | NOT NULL, default `0`, CHECK `total_rewatches >= 0` |

**Table constraints:** UNIQUE (`user_id`, `anime_id`)

**Indexes:** (`user_id`, `status`)


### user_taste_profile

| Column | Type | Constraints |
|--------|------|-------------|
| `user_id` | `TEXT` | PK, FK → `user_profile.user_id` ON DELETE CASCADE |
| `summary_text` | `TEXT` | |
| `personality_json` | `JSONB` | nullable |
| `computed_at` | `TIMESTAMPTZ` | NOT NULL |


### discussion

| Column | Type | Constraints |
|--------|------|-------------|
| `discussion_id` | `UUID` | PK |
| `user_id` | `TEXT` | NOT NULL, FK → `user_profile.user_id` ON DELETE CASCADE |
| `anime_id` | `UUID` | NOT NULL, FK → `anime.id` |
| `title` | `TEXT` | NOT NULL, CHECK `length(trim(title)) > 0` |
| `body` | `TEXT` | NOT NULL, CHECK `length(trim(body)) > 0` |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, default `now()` |
| `last_reply_at` | `TIMESTAMPTZ` | nullable |

**Indexes:** (`anime_id`, `created_at` DESC), (`anime_id`, `last_reply_at` DESC)


### discussion_reply

| Column | Type | Constraints |
|--------|------|-------------|
| `reply_id` | `UUID` | PK |
| `discussion_id` | `UUID` | NOT NULL, FK → `discussion.discussion_id` ON DELETE CASCADE |
| `user_id` | `TEXT` | NOT NULL, FK → `user_profile.user_id` ON DELETE CASCADE |
| `body` | `TEXT` | NOT NULL, CHECK `length(trim(body)) > 0` |
| `parent_id` | `UUID` | nullable, FK → `discussion_reply.reply_id` ON DELETE CASCADE |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, default `now()` |

**Table constraints:** when `parent_id` is set, parent must belong to same `discussion_id` (enforce in app or trigger)

**Indexes:** (`discussion_id`, `created_at`)


### discussion_up_vote

Upvote-only: insert row to upvote; delete row to remove upvote.

| Column | Type | Constraints |
|--------|------|-------------|
| `discussion_id` | `UUID` | PK (composite), FK → `discussion.discussion_id` ON DELETE CASCADE |
| `user_id` | `TEXT` | PK (composite), FK → `user_profile.user_id` ON DELETE CASCADE |

**Table constraints:** UNIQUE (`discussion_id`, `user_id`)


### discussion_reply_up_vote

Upvote-only: insert row to upvote; delete row to remove upvote.

| Column | Type | Constraints |
|--------|------|-------------|
| `reply_id` | `UUID` | PK (composite), FK → `discussion_reply.reply_id` ON DELETE CASCADE |
| `user_id` | `TEXT` | PK (composite), FK → `user_profile.user_id` ON DELETE CASCADE |

**Table constraints:** UNIQUE (`reply_id`, `user_id`)


### connection

| Column | Type | Constraints |
|--------|------|-------------|
| `follower_id` | `TEXT` | PK (composite), FK → `user_profile.user_id` ON DELETE CASCADE |
| `following_id` | `TEXT` | PK (composite), FK → `user_profile.user_id` ON DELETE CASCADE |

**Table constraints:** UNIQUE (`follower_id`, `following_id`); CHECK `follower_id <> following_id`


### activity_event

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `UUID` | PK |
| `actor_id` | `TEXT` | NOT NULL, FK → `user_profile.user_id` ON DELETE CASCADE |
| `verb` | `TEXT` | NOT NULL, CHECK ∈ `rated`, `completed`, `added_to_list`, `shared_rec`, `started_discussion`, `replied_to_discussion` |
| `anime_id` | `UUID` | nullable, FK → `anime.id` |
| `metadata` | `JSONB` | nullable |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, default `now()` |

**Indexes:** (`actor_id`, `created_at` DESC), (`created_at` DESC)


### recommendation_session

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `UUID` | PK |
| `user_id` | `TEXT` | NOT NULL, FK → `user_profile.user_id` ON DELETE CASCADE |
| `prompt_text` | `TEXT` | NOT NULL |
| `filters` | `JSONB` | nullable |
| `created_at` | `TIMESTAMPTZ` | NOT NULL, default `now()` |

**Indexes:** (`user_id`, `created_at` DESC)


### recommendation_result

| Column | Type | Constraints |
|--------|------|-------------|
| `session_id` | `UUID` | PK (composite), FK → `recommendation_session.id` ON DELETE CASCADE |
| `anime_id` | `UUID` | PK (composite), FK → `anime.id` |
| `match_percent` | `REAL` | nullable, CHECK `match_percent BETWEEN 0 AND 100` when set |
| `explanation` | `TEXT` | |

**Table constraints:** UNIQUE (`session_id`, `anime_id`)

Optional later: add `rank` `INTEGER` with UNIQUE (`session_id`, `rank`) for stable display order.


### recommendation_share

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `UUID` | PK |
| `from_user_id` | `TEXT` | NOT NULL, FK → `user_profile.user_id` ON DELETE CASCADE |
| `to_user_id` | `TEXT` | nullable, FK → `user_profile.user_id` ON DELETE CASCADE |
| `public_token` | `TEXT` | nullable, UNIQUE when not null |
| `session_id` | `UUID` | NOT NULL, FK → `recommendation_session.id` ON DELETE CASCADE |
| `message` | `TEXT` | nullable |

**Table constraints:** directed share — `to_user_id` set and `public_token` null; link share — `public_token` set and `to_user_id` null


### catalog

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `UUID` | PK |
| `title` | `TEXT` | NOT NULL |
| `slug` | `TEXT` | NOT NULL, UNIQUE |
| `description` | `TEXT` | nullable |
| `owner_user_id` | `TEXT` | nullable, FK → `user_profile.user_id` ON DELETE SET NULL |
| `kind` | `TEXT` | NOT NULL, CHECK ∈ `custom`, `ai_generated`, `editorial` |

**Indexes:** `slug`


### catalog_item

| Column | Type | Constraints |
|--------|------|-------------|
| `catalog_id` | `UUID` | PK (composite), FK → `catalog.id` ON DELETE CASCADE |
| `anime_id` | `UUID` | PK (composite), FK → `anime.id` |
| `sort_order` | `INTEGER` | nullable, CHECK `sort_order >= 0` when set |

**Table constraints:** UNIQUE (`catalog_id`, `anime_id`)

Display order: use `sort_order` when set (editorial / AI snapshot); otherwise order by joined `anime.average_score` or `anime.popularity` at query time.

**Indexes:** (`catalog_id`, `sort_order`)


### anime

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `UUID` | PK |
| `external_id` | `INTEGER` | NOT NULL, UNIQUE |
| `title_romaji` | `TEXT` | |
| `title_english` | `TEXT` | nullable |
| `synopsis` | `TEXT` | nullable |
| `episode_count` | `INTEGER` | nullable |
| `status` | `TEXT` | nullable |
| `season` | `TEXT` | nullable |
| `season_year` | `INTEGER` | nullable |
| `average_score` | `REAL` | nullable |
| `popularity` | `INTEGER` | nullable |
| `banner_url` | `TEXT` | nullable |
| `cover_url` | `TEXT` | nullable |
| `trailer_url` | `TEXT` | nullable |
| `synced_at` | `TIMESTAMPTZ` | NOT NULL |

**Indexes:** `external_id`


### genre

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `SERIAL` | PK |
| `name` | `TEXT` | NOT NULL, UNIQUE |

Seeded from AniList `GenreCollection` (store each genre name string).


### anime_genre

| Column | Type | Constraints |
|--------|------|-------------|
| `anime_id` | `UUID` | PK (composite), FK → `anime.id` ON DELETE CASCADE |
| `genre_id` | `INTEGER` | PK (composite), FK → `genre.id` ON DELETE CASCADE |

**Table constraints:** UNIQUE (`anime_id`, `genre_id`)


### tag

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `SERIAL` | PK |
| `external_id` | `INTEGER` | NOT NULL, UNIQUE |
| `name` | `TEXT` | NOT NULL, UNIQUE |
| `category` | `TEXT` | NOT NULL |
| `is_adult` | `BOOLEAN` | NOT NULL, default `false` |

Seeded from AniList `MediaTagCollection`. Filter `is_adult = false` for onboarding UI.

**Indexes:** `external_id`


### anime_tag

| Column | Type | Constraints |
|--------|------|-------------|
| `anime_id` | `UUID` | PK (composite), FK → `anime.id` ON DELETE CASCADE |
| `tag_id` | `INTEGER` | PK (composite), FK → `tag.id` ON DELETE CASCADE |

**Table constraints:** UNIQUE (`anime_id`, `tag_id`)
