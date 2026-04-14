/*
  # Create resources, events, and analytics tables for ETA platform

  1. New Tables
    - `resources`: Store uploaded resource files (books, primers, case studies)
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text - book, primer, case_study, article)
      - `file_url` (text)
      - `author` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `events`: Store ETA events
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `event_type` (text - workshop, panel, networking)
      - `date` (timestamp)
      - `location` (text)
      - `capacity` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `case_studies`: Store case study content
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `company_name` (text)
      - `acquisition_year` (integer)
      - `industry` (text)
      - `content` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `analytics_events`: Track page views and interactions
      - `id` (uuid, primary key)
      - `event_type` (text - page_view, button_click, form_submit)
      - `page` (text)
      - `data` (jsonb)
      - `created_at` (timestamp)
    
    - `admin_users`: Store admin user accounts
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `role` (text - admin, viewer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Admin users can manage resources, events, case studies
    - Public read access to resources and case studies
    - Analytics are admin-only
    - Newsletter subscribers table protected with RLS

  3. Important Notes
    - Resources can be filtered by category for organization
    - Analytics track user interactions for admin dashboard
    - Admin users identified by email with role-based access
*/

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('book', 'primer', 'case_study', 'article')),
  file_url text,
  author text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_type text NOT NULL CHECK (event_type IN ('workshop', 'panel', 'networking')),
  date timestamptz,
  location text,
  capacity integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  company_name text,
  acquisition_year integer,
  industry text,
  content text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  page text,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are publicly readable"
  ON resources FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert resources"
  ON resources FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update resources"
  ON resources FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete resources"
  ON resources FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Events are publicly readable"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Case studies are publicly readable"
  ON case_studies FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert case studies"
  ON case_studies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update case studies"
  ON case_studies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete case studies"
  ON case_studies FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can view analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only admins can manage admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users existing
      WHERE existing.email = auth.jwt() ->> 'email'
      AND existing.role = 'admin'
    )
  );

CREATE POLICY "Only admins can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );

CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_case_studies_year ON case_studies(acquisition_year);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
CREATE INDEX idx_admin_users_email ON admin_users(email);
