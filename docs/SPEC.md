## Tables
- user_profile
- user_genre_preference
- user_tag_preference
- user_taste_profile
- user_anime_entry
- comment
- connection
- activity_event
- recommendation_session
- recommendation_result
- recommendation_share
- catalog
- catalog_item


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


### Comment table
- comment_id
- user_id
- anime_id
- comment_body
- parent_id


### Connection table
- user_id
- follow_id


### Activity Event table
- id
- actor_id
- verb - rated | completed | added_to_list | shared_rec
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