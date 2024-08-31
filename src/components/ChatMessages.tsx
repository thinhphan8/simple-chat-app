import InitMessages from "@/lib/store/InitMessages";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import ListMessages from "./ListMessages";

export default async function ChatMessages() {
  const supabase = createClient();
  const { data } = await supabase.from("messages").select("*, users(*)");

  console.log(data);

  return (
    <Suspense fallback={"Loading..."}>
      <ListMessages />
      <InitMessages messages={data || []} />
    </Suspense>
  );
}
