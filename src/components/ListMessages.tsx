"use client";

import { IMessage, useMessageStore } from "@/lib/store/messages";
import { createClient } from "@/utils/supabase/client";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Message from "./Message";
import { DeleteAlert, EditAlert } from "./MessageActions";
import LoadMoreMessages from "./LoadMoreMessages";

export default function ListMessages() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);
  const {
    messages,
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessageStore((state) => state);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          // console.log("Change received!", payload);
          if (!optimisticIds.includes(payload.new.id)) {
            const { error, data } = await supabase
              .from("users")
              .select("*")
              .eq("id", payload.new.send_by)
              .single();
            if (error) {
              toast.error(error.message);
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              };
              addMessage(newMessage as IMessage);
            }
          }
          const scrollContainer = scrollRef.current;
          if (scrollContainer.scrollTop < scrollContainer.clientHeight - 10) {
            setNotification((current) => current + 1);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          // console.log("Change received!", payload);
          optimisticUpdateMessage(payload.new as IMessage);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          // console.log("Change received!", payload);
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop < scrollContainer.clientHeight - 10;
      setUserScrolled(isScroll);
      if (scrollContainer.scrollTop === scrollContainer.clientHeight) {
        setNotification(0);
      }
    }
  };

  const scrollDown = () => {
    setNotification(0);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  return (
    <>
      <div
        className="flex-1 flex flex-col p-5 h-full overflow-y-auto gap-5"
        ref={scrollRef}
        onScroll={handleOnScroll}
      >
        <div className="flex-1">
          <LoadMoreMessages />
        </div>
        <div className="space-y-7">
          {messages.map((value, index) => {
            return <Message key={index} message={value} />;
          })}
        </div>
        <DeleteAlert />
        <EditAlert />
      </div>
      {userScrolled && (
        <div className="absolute bottom-20 w-full">
          {notification ? (
            <div
              className="w-40
                        mx-auto 
                        bg-indigo-500 
                        p-1 
                        text-center 
                        rounded-md 
                        cursor-pointer 
                        hover:scale-110 
                        transition-all"
              onClick={scrollDown}
            >
              <h1>New {notification} message(s)</h1>
            </div>
          ) : (
            <div
              className="w-10 h-10 
                        bg-blue-500 
                        rounded-full 
                        justify-center items-center 
                        flex mx-auto 
                        border 
                        cursor-pointer
                        hover:scale-110 
                        transition-all"
              onClick={scrollDown}
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}
    </>
  );
}
