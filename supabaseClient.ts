import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://amcqyxkkufmjheaanznn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY3F5eGtrdWZtamhlYWFuem5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzIxMTcsImV4cCI6MjA4NjkwODExN30.fN9wRno9fe_r56S49obFeEjTnRNjgW8F-3LJasqTB0g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
