import {NextApiRequest, NextApiResponse} from "next";
import {DB} from "@/utils/supabase-server";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const supabase = DB.getSupabase();
    const {data, error} = await supabase.from("tasks").select();
    res.status(200).json({name: "John Doe"});
}
