/*
  # Update newsletter subscribers for community signup

  1. Modified Tables
    - `newsletter_subscribers`: Add fields for community profile information
      - `full_name` (text - required)
      - `company` (text - optional)
      - `job_role` (text - optional)
      - `linkedin_profile` (text - optional URL)
      - `role_type` (text - optional: searcher, investor, prospective_searcher, deal_advisor, operator)
      - `is_cambridge_alum` (boolean - default false)

  2. Important Notes
    - Maintains backwards compatibility with existing email-only subscribers
    - New fields are optional except for full_name when used for community signup
    - source field distinguishes between newsletter and community signup
*/

DO $$
BEGIN
  -- Add full_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN full_name text;
  END IF;

  -- Add company column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'company'
  ) THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN company text;
  END IF;

  -- Add job_role column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'job_role'
  ) THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN job_role text;
  END IF;

  -- Add linkedin_profile column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'linkedin_profile'
  ) THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN linkedin_profile text;
  END IF;

  -- Add role_type column (searcher, investor, prospective_searcher, deal_advisor, operator)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'role_type'
  ) THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN role_type text;
  END IF;

  -- Add is_cambridge_alum column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'is_cambridge_alum'
  ) THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN is_cambridge_alum boolean DEFAULT false;
  END IF;
END $$;
