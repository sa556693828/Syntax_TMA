import { Context } from "@/components/Provider";
import { tableMap } from "@/types/types";
import { createClient } from "@supabase/supabase-js";
import { useContext } from "react";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);
