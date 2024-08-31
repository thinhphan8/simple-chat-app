import ChatHeader from "@/components/ChatHeader";
import InitUser from "@/lib/store/initUser";
import { createClient } from "@/utils/supabase/server";
import React from "react";

export default async function page() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <div className="max-w-3xl mx-auto md:py-10 h-screen">
        <div className="h-full border rounded-md">
          <ChatHeader user={data?.user} />
        </div>
      </div>
      <InitUser user={data?.user} />
    </>
  );
}
