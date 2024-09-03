import { createClient } from "@supabase/supabase-js";

const [SUPABASE_URL, SUPABASE_ANON_KEY] = ['https://citsycvbofgludylicnh.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpdHN5Y3Zib2ZnbHVkeWxpY25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzE4OTEsImV4cCI6MjAzODQ0Nzg5MX0.IzErQg4qXueDThoIg-LRV-FN8AR3MTFS7F0YxY2i_Ow'];
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

