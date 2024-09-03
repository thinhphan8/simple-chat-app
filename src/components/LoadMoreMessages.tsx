import React from "react";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { LIMIT_MESSAGE } from "@/lib/constants";
import { getFromAndTo } from "@/utils/utils";
import { useMessageStore } from "@/lib/store/messages";
import { toast } from "sonner";

export default function LoadMoreMessages() {
  const page = useMessageStore((state) => state.page);
  const setMessages = useMessageStore((state) => state.setMessages);
  const hasMore = useMessageStore((state) => state.hasMore);
  const fetchMoreMessage = async () => {
    const { from, to } = getFromAndTo(page, LIMIT_MESSAGE);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select("*, users(*)")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setMessages(data.reverse());
    }
  };

  if (hasMore) {
    return (
      <Button variant="outline" className="w-full" onClick={fetchMoreMessage}>
        Load More
      </Button>
    );
  }

  return (<></>);
}
