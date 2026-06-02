-- CreateEnum
CREATE TYPE "AnimeEntryStatus" AS ENUM ('planned', 'watching', 'completed', 'rewatching', 'paused', 'dropped');

-- CreateEnum
CREATE TYPE "ActivityVerb" AS ENUM ('rated', 'completed', 'added_to_list', 'shared_rec', 'started_discussion', 'replied_to_discussion');

-- CreateEnum
CREATE TYPE "CatalogKind" AS ENUM ('custom', 'ai_generated', 'editorial');

-- CreateTable
CREATE TABLE "activity_event" (
    "id" UUID NOT NULL,
    "actor_id" TEXT NOT NULL,
    "verb" "ActivityVerb" NOT NULL,
    "anime_id" UUID,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime" (
    "id" UUID NOT NULL,
    "external_id" INTEGER NOT NULL,
    "title_romaji" TEXT NOT NULL,
    "title_english" TEXT,
    "synopsis" TEXT,
    "episode_count" INTEGER,
    "status" TEXT,
    "season" TEXT,
    "season_year" INTEGER,
    "average_score" DOUBLE PRECISION,
    "popularity" INTEGER,
    "banner_url" TEXT,
    "cover_url" TEXT,
    "trailer_url" TEXT,
    "synced_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_genre" (
    "anime_id" UUID NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "anime_genre_pkey" PRIMARY KEY ("anime_id","genre_id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" SERIAL NOT NULL,
    "external_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_adult" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_tag" (
    "anime_id" UUID NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "anime_tag_pkey" PRIMARY KEY ("anime_id","tag_id")
);

-- CreateTable
CREATE TABLE "catalog" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "owner_user_id" TEXT,
    "kind" "CatalogKind" NOT NULL,

    CONSTRAINT "catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_item" (
    "catalog_id" UUID NOT NULL,
    "anime_id" UUID NOT NULL,
    "sort_order" INTEGER,

    CONSTRAINT "catalog_item_pkey" PRIMARY KEY ("catalog_id","anime_id")
);

-- CreateTable
CREATE TABLE "discussion" (
    "discussion_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "anime_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_reply_at" TIMESTAMPTZ,

    CONSTRAINT "discussion_pkey" PRIMARY KEY ("discussion_id")
);

-- CreateTable
CREATE TABLE "discussion_reply" (
    "reply_id" UUID NOT NULL,
    "discussion_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "parent_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_reply_pkey" PRIMARY KEY ("reply_id")
);

-- CreateTable
CREATE TABLE "discussion_up_vote" (
    "discussion_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "discussion_up_vote_pkey" PRIMARY KEY ("discussion_id","user_id")
);

-- CreateTable
CREATE TABLE "discussion_reply_up_vote" (
    "reply_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "discussion_reply_up_vote_pkey" PRIMARY KEY ("reply_id","user_id")
);

-- CreateTable
CREATE TABLE "recommendation_session" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "prompt_text" TEXT NOT NULL,
    "filters" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_result" (
    "session_id" UUID NOT NULL,
    "anime_id" UUID NOT NULL,
    "match_percent" DOUBLE PRECISION,
    "explanation" TEXT,

    CONSTRAINT "recommendation_result_pkey" PRIMARY KEY ("session_id","anime_id")
);

-- CreateTable
CREATE TABLE "recommendation_share" (
    "id" UUID NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT,
    "public_token" TEXT,
    "session_id" UUID NOT NULL,
    "message" TEXT,

    CONSTRAINT "recommendation_share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profile" (
    "user_id" TEXT NOT NULL,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "is_incognito" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_genre_preference" (
    "user_id" TEXT NOT NULL,
    "genre_id" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "user_genre_preference_pkey" PRIMARY KEY ("user_id","genre_id")
);

-- CreateTable
CREATE TABLE "user_tag_preference" (
    "user_id" TEXT NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "user_tag_preference_pkey" PRIMARY KEY ("user_id","tag_id")
);

-- CreateTable
CREATE TABLE "user_taste_profile" (
    "user_id" TEXT NOT NULL,
    "summary_text" TEXT,
    "personality_json" JSONB,
    "computed_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_taste_profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_anime_entry" (
    "user_id" TEXT NOT NULL,
    "anime_id" UUID NOT NULL,
    "status" "AnimeEntryStatus" NOT NULL,
    "score" INTEGER,
    "episode_progress" INTEGER NOT NULL DEFAULT 0,
    "start_date" DATE,
    "finish_date" DATE,
    "total_rewatches" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_anime_entry_pkey" PRIMARY KEY ("user_id","anime_id")
);

-- CreateTable
CREATE TABLE "connection" (
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,

    CONSTRAINT "connection_pkey" PRIMARY KEY ("follower_id","following_id")
);

-- CreateIndex
CREATE INDEX "activity_event_actor_id_created_at_idx" ON "activity_event"("actor_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "activity_event_created_at_idx" ON "activity_event"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "anime_external_id_key" ON "anime"("external_id");

-- CreateIndex
CREATE INDEX "anime_external_id_idx" ON "anime"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "genre_name_key" ON "genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tag_external_id_key" ON "tag"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE INDEX "tag_external_id_idx" ON "tag"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "catalog_slug_key" ON "catalog"("slug");

-- CreateIndex
CREATE INDEX "catalog_slug_idx" ON "catalog"("slug");

-- CreateIndex
CREATE INDEX "catalog_item_catalog_id_sort_order_idx" ON "catalog_item"("catalog_id", "sort_order");

-- CreateIndex
CREATE INDEX "discussion_anime_id_created_at_idx" ON "discussion"("anime_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "discussion_anime_id_last_reply_at_idx" ON "discussion"("anime_id", "last_reply_at" DESC);

-- CreateIndex
CREATE INDEX "discussion_reply_discussion_id_created_at_idx" ON "discussion_reply"("discussion_id", "created_at");

-- CreateIndex
CREATE INDEX "recommendation_session_user_id_created_at_idx" ON "recommendation_session"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_share_public_token_key" ON "recommendation_share"("public_token");

-- CreateIndex
CREATE INDEX "user_anime_entry_user_id_status_idx" ON "user_anime_entry"("user_id", "status");

-- AddForeignKey
ALTER TABLE "activity_event" ADD CONSTRAINT "activity_event_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_event" ADD CONSTRAINT "activity_event_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genre" ADD CONSTRAINT "anime_genre_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genre" ADD CONSTRAINT "anime_genre_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_tag" ADD CONSTRAINT "anime_tag_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_tag" ADD CONSTRAINT "anime_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog" ADD CONSTRAINT "catalog_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_item" ADD CONSTRAINT "catalog_item_catalog_id_fkey" FOREIGN KEY ("catalog_id") REFERENCES "catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_item" ADD CONSTRAINT "catalog_item_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_reply" ADD CONSTRAINT "discussion_reply_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "discussion"("discussion_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_reply" ADD CONSTRAINT "discussion_reply_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_reply" ADD CONSTRAINT "discussion_reply_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "discussion_reply"("reply_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_up_vote" ADD CONSTRAINT "discussion_up_vote_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "discussion"("discussion_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_up_vote" ADD CONSTRAINT "discussion_up_vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_reply_up_vote" ADD CONSTRAINT "discussion_reply_up_vote_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "discussion_reply"("reply_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_reply_up_vote" ADD CONSTRAINT "discussion_reply_up_vote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_session" ADD CONSTRAINT "recommendation_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_result" ADD CONSTRAINT "recommendation_result_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "recommendation_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_result" ADD CONSTRAINT "recommendation_result_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_share" ADD CONSTRAINT "recommendation_share_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_share" ADD CONSTRAINT "recommendation_share_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_share" ADD CONSTRAINT "recommendation_share_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "recommendation_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_genre_preference" ADD CONSTRAINT "user_genre_preference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_genre_preference" ADD CONSTRAINT "user_genre_preference_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tag_preference" ADD CONSTRAINT "user_tag_preference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tag_preference" ADD CONSTRAINT "user_tag_preference_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_taste_profile" ADD CONSTRAINT "user_taste_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_anime_entry" ADD CONSTRAINT "user_anime_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_anime_entry" ADD CONSTRAINT "user_anime_entry_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
