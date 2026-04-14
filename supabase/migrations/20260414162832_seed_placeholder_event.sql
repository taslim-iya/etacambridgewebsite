/*
  # Seed placeholder event

  Inserts a placeholder event for "Search Fund Economics: From Raise to Acquisition"
  so the fallback on the Events page can properly register interest via the
  event_registrations table. Date is left null (TBC).
*/

INSERT INTO events (title, event_type, description, date, location, capacity)
VALUES (
  'Search Fund Economics: From Raise to Acquisition',
  'workshop',
  'An introduction to the search fund model — covering search fund capitalisation, search economics and the path from raise to acquisition.',
  NULL,
  NULL,
  NULL
)
ON CONFLICT DO NOTHING;
