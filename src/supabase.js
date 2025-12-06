
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zptdfpohpeqypudonohm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwdGRmcG9ocGVxeXB1ZG9ub2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMjkyMjYsImV4cCI6MjA4MDYwNTIyNn0.OinbuH_57EI6L7XaJin6_T1FgxwKqdsJXlq_2291NqE';

export const supabase = createClient(supabaseUrl, supabaseKey);
