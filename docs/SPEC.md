## Tables
- user_profile
- user_genre_preference
- user_tag_preference
- user_taste_profile
- user_anime_entry
- discussion
- discussion_reply
- discussion_up_vote
- discussion_reply_up_vote
- connection
- activity_event
- recommendation_session
- recommendation_result
- recommendation_share
- catalog
- catalog_item
- anime
- genre
- anime_genre
- tag
- anime_tag


### User Profile table
- user_id
- display_name
- avatar_url
- is_incognito
- created_at


### User Genre Preference table
- user_id
- genre_id
- weight


### User Tag Preference
- user_id
- tag_id
- weight


### User Anime Entry table
- user_id
- anime_id
- status - planned | watching | completed | rewatching | paused | dropped
- score
- episode_progress
- start_date
- finish_date
- total_rewatches


### User Taste Profile table
- user_id
- summary_text
- personality_json
- computed_at


### Discussion table
- discussion_id
- user_id
- anime_id
- title
- body
- created_at
- last_reply_at


### Discussion Reply table
- discussion_id
- reply_id
- user_id
- body
- parent_id
- created_at


### Discussion Vote table (only upvotes, if user toggles upvote, we delete entry)
- discussion_id
- user_id


### Discussion Reply Vote table (only upvotes, if user toggles upvote, we delete entry)
- reply_id
- user_id


### Connection table
- follower_id
- following_id


### Activity Event table
- id
- actor_id
- verb - rated | completed | added_to_list | shared_rec | started_discussion | replied_to_discussion
- anime_id
- metadata
- created_at


### Recommendation Session table
- id
- user_id
- prompt_text
- filters
- created_at


### Recommendation Result table
- session_id
- anime_id
- match_percent
- explanation


### Recommendation Share table
- id
- from_user_id
- to_user_id OR public link token
- session_id
- message


### Catalog table
- id
- title
- slug
- description
- owner_user_id
- kind - custom | ai_generated | editorial


### Catalog Item table
- catalog_id
- anime_id
- sort_order


### Anime table
- id
- external_id
- title_romaji
- title_english
- synopsis
- episode_count
- status
- season
- season_year
- average_score
- popularity
- banner_url
- cover_url
- trailer_url
- synced_at


### Genre table
- id
- genre


### Anime Genre table
- anime_id
- genre_id


### Tag table
- id
- external_id
- name
- category
- is_adult


### Anime Tag table
- tag_id
- anime_id