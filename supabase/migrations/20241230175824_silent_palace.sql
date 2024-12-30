/*
  # Initial Schema Setup

  1. Tables
    - profiles
      - id (uuid, references auth.users)
      - username (text, unique)
      - created_at (timestamp)
    - tasks
      - id (uuid)
      - user_id (uuid, references auth.users)
      - title (text)
      - description (text)
      - category (text)
      - priority (text)
      - status (text)
      - due_date (date)
      - time_spent (integer)
      - created_at (timestamp)
    - weekly_productivity
      - id (uuid)
      - user_id (uuid, references auth.users)
      - username (text)
      - total_time (integer)
      - week_start (date)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read any profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  priority text NOT NULL,
  status text NOT NULL,
  due_date date,
  time_spent integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own tasks"
  ON tasks
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create weekly productivity table
CREATE TABLE weekly_productivity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  username text NOT NULL,
  total_time integer DEFAULT 0,
  week_start date NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE weekly_productivity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all weekly productivity"
  ON weekly_productivity FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own weekly productivity"
  ON weekly_productivity
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);