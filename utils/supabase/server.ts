
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qsswdusttgzhprqgmaez.supabase.co'
  ,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzc3dkdXN0dGd6aHBycWdtYWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2MTQ5OTEsImV4cCI6MjAzMzE5MDk5MX0.CJc3dZAFjU4KOrbZ1z4G_sgilV60BrGWEZs7oLeXMN8'
);

export default supabase;
