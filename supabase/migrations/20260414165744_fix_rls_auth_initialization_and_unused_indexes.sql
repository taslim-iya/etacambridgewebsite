/*
  # Fix RLS Auth Initialization Plan & Remove Unused Indexes

  ## Summary
  Replace bare `auth.uid()` and `auth.jwt()` calls in RLS policies with
  `(select auth.uid())` and `(select auth.jwt())` so Postgres evaluates them
  once per query rather than once per row.

  Also tightens the `email_settings` UPDATE policy to admin-only (was any
  authenticated user) and removes five unused indexes.

  ## Tables Fixed
  - newsletter_subscribers
  - contact_submissions
  - resources
  - events
  - case_studies
  - analytics_events
  - admin_users
  - event_registrations
  - email_settings

  ## Unused Indexes Removed
  - idx_resources_category
  - idx_events_date
  - idx_case_studies_year
  - idx_analytics_created
  - idx_event_registrations_email
*/

-- ============================================================
-- newsletter_subscribers
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Authenticated users can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- ============================================================
-- contact_submissions
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view submissions" ON public.contact_submissions;
CREATE POLICY "Authenticated users can view submissions"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- ============================================================
-- resources
-- ============================================================
DROP POLICY IF EXISTS "Only admins can insert resources" ON public.resources;
CREATE POLICY "Only admins can insert resources"
  ON public.resources FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can update resources" ON public.resources;
CREATE POLICY "Only admins can update resources"
  ON public.resources FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can delete resources" ON public.resources;
CREATE POLICY "Only admins can delete resources"
  ON public.resources FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  );

-- ============================================================
-- events
-- ============================================================
DROP POLICY IF EXISTS "Only admins can insert events" ON public.events;
CREATE POLICY "Only admins can insert events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can update events" ON public.events;
CREATE POLICY "Only admins can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can delete events" ON public.events;
CREATE POLICY "Only admins can delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  );

-- ============================================================
-- case_studies
-- ============================================================
DROP POLICY IF EXISTS "Only admins can insert case studies" ON public.case_studies;
CREATE POLICY "Only admins can insert case studies"
  ON public.case_studies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can update case studies" ON public.case_studies;
CREATE POLICY "Only admins can update case studies"
  ON public.case_studies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can delete case studies" ON public.case_studies;
CREATE POLICY "Only admins can delete case studies"
  ON public.case_studies FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  );

-- ============================================================
-- analytics_events
-- ============================================================
DROP POLICY IF EXISTS "Only admins can view analytics" ON public.analytics_events;
CREATE POLICY "Only admins can view analytics"
  ON public.analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  );

-- ============================================================
-- admin_users
-- ============================================================
DROP POLICY IF EXISTS "Admins can read admin_users" ON public.admin_users;
CREATE POLICY "Admins can read admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (email = ((select auth.jwt()) ->> 'email'));

DROP POLICY IF EXISTS "Only admins can insert admin users" ON public.admin_users;
CREATE POLICY "Only admins can insert admin users"
  ON public.admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.email = ((select auth.jwt()) ->> 'email')
        AND au.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can update admin users" ON public.admin_users;
CREATE POLICY "Only admins can update admin users"
  ON public.admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.email = ((select auth.jwt()) ->> 'email')
        AND au.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.email = ((select auth.jwt()) ->> 'email')
        AND au.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can delete admin users" ON public.admin_users;
CREATE POLICY "Only admins can delete admin users"
  ON public.admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.email = ((select auth.jwt()) ->> 'email')
        AND au.role = 'admin'
    )
  );

-- ============================================================
-- event_registrations
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view registrations" ON public.event_registrations;
CREATE POLICY "Authenticated users can view registrations"
  ON public.event_registrations FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete registrations" ON public.event_registrations;
CREATE POLICY "Authenticated users can delete registrations"
  ON public.event_registrations FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- ============================================================
-- email_settings — tighten UPDATE to admin-only
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can update email settings" ON public.email_settings;
CREATE POLICY "Only admins can update email settings"
  ON public.email_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
        AND admin_users.role = 'admin'
    )
  );

-- ============================================================
-- Remove unused indexes
-- ============================================================
DROP INDEX IF EXISTS public.idx_resources_category;
DROP INDEX IF EXISTS public.idx_events_date;
DROP INDEX IF EXISTS public.idx_case_studies_year;
DROP INDEX IF EXISTS public.idx_analytics_created;
DROP INDEX IF EXISTS public.idx_event_registrations_email;
