/*
  # Add resource_type column for case study filtering

  1. Modified Tables
    - `resources`: Add resource_type column for case study subcategories
      - `resource_type` (text - null for non-case-studies, searcher, investor, company, other for case studies)

  2. Important Notes
    - Allows filtering case studies by perspective (searcher, investor, company, etc.)
    - Backwards compatible - existing resources have NULL resource_type
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resources' AND column_name = 'resource_type'
  ) THEN
    ALTER TABLE resources ADD COLUMN resource_type text;
  END IF;
END $$;
