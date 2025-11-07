import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create Supabase client instance
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API base URL for server functions
export const API_BASE_URL = `${supabaseUrl}/functions/v1/make-server-92709448`;
