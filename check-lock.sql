SELECT
  pid,
  usename,
  application_name,
  state,
  query
FROM pg_stat_activity
WHERE datname = 'neondb';