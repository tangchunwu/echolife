/*
  # Create game tables for "时空回响" (Temporal Echo)

  1. New Tables
    - `players`
      - `id` (uuid, primary key, references auth.users)
      - `nickname` (text) - player display name
      - `created_at` (timestamptz)
    - `game_saves`
      - `id` (uuid, primary key)
      - `player_id` (uuid, references players)
      - `slot` (integer) - save slot number (1-3)
      - `chapter` (integer) - current chapter
      - `scene` (text) - current scene identifier
      - `dialogue_progress` (jsonb) - dialogue state
      - `inventory` (jsonb) - collected items
      - `unlocked_timelines` (jsonb) - unlocked timeline branches
      - `player_position` (jsonb) - 3D position in scene
      - `play_time_seconds` (integer) - total play time
      - `updated_at` (timestamptz)
      - `created_at` (timestamptz)
    - `dialogue_choices`
      - `id` (uuid, primary key)
      - `player_id` (uuid, references players)
      - `chapter` (integer)
      - `node_id` (text) - dialogue node identifier
      - `choice_key` (text) - which option was chosen
      - `created_at` (timestamptz)
    - `timeline_events`
      - `id` (uuid, primary key)
      - `player_id` (uuid, references players)
      - `event_type` (text) - type of event
      - `event_data` (jsonb) - event details
      - `chapter` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Players can only access their own data
*/

CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  nickname text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can read own data"
  ON players FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Players can insert own data"
  ON players FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Players can update own data"
  ON players FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS game_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES players(id),
  slot integer NOT NULL DEFAULT 1,
  chapter integer NOT NULL DEFAULT 1,
  scene text NOT NULL DEFAULT 'hall',
  dialogue_progress jsonb NOT NULL DEFAULT '{}'::jsonb,
  inventory jsonb NOT NULL DEFAULT '[]'::jsonb,
  unlocked_timelines jsonb NOT NULL DEFAULT '["present"]'::jsonb,
  player_position jsonb NOT NULL DEFAULT '{"x":0,"y":0,"z":0}'::jsonb,
  play_time_seconds integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(player_id, slot)
);

ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can read own saves"
  ON game_saves FOR SELECT
  TO authenticated
  USING (player_id = auth.uid());

CREATE POLICY "Players can insert own saves"
  ON game_saves FOR INSERT
  TO authenticated
  WITH CHECK (player_id = auth.uid());

CREATE POLICY "Players can update own saves"
  ON game_saves FOR UPDATE
  TO authenticated
  USING (player_id = auth.uid())
  WITH CHECK (player_id = auth.uid());

CREATE POLICY "Players can delete own saves"
  ON game_saves FOR DELETE
  TO authenticated
  USING (player_id = auth.uid());

CREATE TABLE IF NOT EXISTS dialogue_choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES players(id),
  chapter integer NOT NULL DEFAULT 1,
  node_id text NOT NULL DEFAULT '',
  choice_key text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dialogue_choices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can read own choices"
  ON dialogue_choices FOR SELECT
  TO authenticated
  USING (player_id = auth.uid());

CREATE POLICY "Players can insert own choices"
  ON dialogue_choices FOR INSERT
  TO authenticated
  WITH CHECK (player_id = auth.uid());

CREATE TABLE IF NOT EXISTS timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES players(id),
  event_type text NOT NULL DEFAULT '',
  event_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  chapter integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can read own events"
  ON timeline_events FOR SELECT
  TO authenticated
  USING (player_id = auth.uid());

CREATE POLICY "Players can insert own events"
  ON timeline_events FOR INSERT
  TO authenticated
  WITH CHECK (player_id = auth.uid());
