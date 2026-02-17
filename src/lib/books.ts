import { supabase } from "./supabase";
import { Book } from "./types";

/**
 * Fetch all books from Supabase, sorted by created_at descending.
 */
export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching books:", error.message);
    return [];
  }

  return data ?? [];
}
