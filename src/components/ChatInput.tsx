"use client";

import { IMessage, useMessageStore } from "@/lib/store/messages";
import { useUserStore } from "@/lib/store/user";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Input } from "./ui/input";

export default function ChatInput() {
  const supabase = createClient();
  const user = useUserStore((state) => state.user);
  const addMessage = useMessageStore((state) => state.addMessage);
  const setOptimisticIds = useMessageStore((state) => state.setOptimisticIds);

  const handleSendMessage = async (text: string) => {
		if (text.trim()) {
			const id = uuidv4();
			const newMessage = {
				id,
				text,
				send_by: user?.id,
				is_edited: false,
				created_at: new Date().toISOString(),
				users: {
					id: user?.id,
					avatar_url: user?.user_metadata.avatar_url,
					created_at: new Date().toISOString(),
					display_name: user?.user_metadata.user_name,
				},
			};
			addMessage(newMessage as IMessage);
			setOptimisticIds(newMessage.id);
			const { error } = await supabase
				.from("messages")
				.insert({ text, id });
			if (error) {
				toast.error(error.message);
			}
		} else {
			toast.error("Message can not be empty!!");
		}
	};

  return (
    <div className="p-5">
      <Input
        placeholder="Send message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
