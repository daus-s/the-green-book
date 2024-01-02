import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY     // TODO: test and get this working
                                                              // all files and calls to supa will use this smae connetion type object. 
                                                              // though nott a single instance? or should  combine calls to the database

export const supabase = createClient(supabaseUrl, supabaseAnonKey)