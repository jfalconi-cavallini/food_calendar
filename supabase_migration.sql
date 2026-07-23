-- ============================================================
-- Meal Planner – Supabase Schema Migration
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- 1) Update meals table to add per-person calorie columns
ALTER TABLE meals
  ADD COLUMN IF NOT EXISTS jose_calories             INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS emma_calories             INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS jose_servings             NUMERIC NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS emma_servings             NUMERIC NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS total_calories            INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS manually_overridden_calories BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes                     TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS recipe_instructions       TEXT    NOT NULL DEFAULT '';

-- 2) Rename existing snacks → snacks_jose (Jose's personal snacks)
UPDATE meals SET meal_type = 'snacks_jose' WHERE meal_type = 'snacks';

-- 3) Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id          TEXT PRIMARY KEY,
  meal_id     TEXT NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  quantity    NUMERIC NOT NULL DEFAULT 1,
  unit        TEXT NOT NULL DEFAULT 'item',
  calories    INTEGER NOT NULL DEFAULT 0,
  category    TEXT NOT NULL DEFAULT 'Other',
  notes       TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- 4) Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id                        TEXT PRIMARY KEY,  -- 'jose' or 'emma'
  name                      TEXT,
  age                       INTEGER,
  sex                       TEXT,              -- 'male' | 'female'
  height_cm                 NUMERIC,
  weight_kg                 NUMERIC,
  goal_weight_kg            NUMERIC,
  activity_level            TEXT    NOT NULL DEFAULT 'moderate',
  fitness_goal              TEXT    NOT NULL DEFAULT 'maintain',
  weekly_weight_change      NUMERIC NOT NULL DEFAULT 0,
  estimated_calorie_target  INTEGER,
  manual_calorie_target     INTEGER,
  exercise_adjustment_mode  TEXT    NOT NULL DEFAULT 'none',
  dietary_preferences       TEXT[]  NOT NULL DEFAULT '{}',
  allergies                 TEXT[]  NOT NULL DEFAULT '{}',
  disliked_foods            TEXT[]  NOT NULL DEFAULT '{}',
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed initial profile rows so upsert works
INSERT INTO profiles (id, name) VALUES ('jose', 'Jose'), ('emma', 'Emma')
ON CONFLICT (id) DO NOTHING;

-- 5) Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id               TEXT PRIMARY KEY,
  date             TEXT NOT NULL,       -- 'YYYY-MM-DD'
  person_id        TEXT NOT NULL,       -- 'jose' | 'emma'
  name             TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  calories_burned  INTEGER NOT NULL DEFAULT 0,
  notes            TEXT NOT NULL DEFAULT '',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
