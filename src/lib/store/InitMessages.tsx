"use client";

import { useEffect, useRef } from "react";
import { IMessage, useMessageStore } from "./messages";
import { LIMIT_MESSAGE } from "../constants";

export default function InitMessages({ messages }: { messages: IMessage[] }) {
  const initState = useRef(false);
  const hasMore = messages.length >= LIMIT_MESSAGE;

  useEffect(() => {
    if (initState.current) {
      useMessageStore.setState({ messages, hasMore });
    }
    initState.current = true;
    //eslint-disable-next-line
  }, []);

  return <></>;
}
