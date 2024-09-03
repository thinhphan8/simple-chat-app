import InitMessages from "@/lib/store/InitMessages";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import ListMessages from "./ListMessages";
import { LIMIT_MESSAGE } from "@/lib/constants";

export default async function ChatMessages() {
  const supabase = createClient();
  const { data } = await supabase
    .from("messages")
    .select("*, users(*)")
    .range(0, LIMIT_MESSAGE)
    .order("created_at", { ascending: false });

  return (
    <Suspense fallback={"Loading..."}>
      <ListMessages />
      <InitMessages messages={data || []} />
    </Suspense>
  );
}
