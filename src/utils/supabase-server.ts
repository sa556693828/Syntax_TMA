import {createClient} from "@/utils/supabase/server";
import {SupabaseClient} from "@supabase/supabase-js";

export class DB {
    private static supabase: SupabaseClient | null = null;

    static getSupabase() {
        if (!DB.supabase) {
            DB.supabase = createClient();
        }
        return DB.supabase;
    }

    private constructor() {

    }
}
