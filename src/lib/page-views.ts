import { supabase } from "./supabase";

export async function incrementPageViews(): Promise<void> {
  await supabase.rpc("increment_page_views");
}

export async function getPageViews(): Promise<number> {
  const { data } = await supabase
    .from("page_views")
    .select("count")
    .single();
  return data?.count ?? 0;
}
