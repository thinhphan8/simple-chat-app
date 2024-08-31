"use client";

import { useEffect, useRef } from "react";
import { IMessage, useMessageStore } from "./messages";

export default function InitMessages({ messages }: { messages: IMessage[] }) {
  const initState = useRef(false);

  useEffect(() => {
    if (initState.current) {
      useMessageStore.setState({ messages });
    }
    initState.current = true;
    //eslint-disable-next-line
  }, []);

  return <></>;
}
