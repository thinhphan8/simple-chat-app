import { create } from "zustand";
import { LIMIT_MESSAGE } from "../constants";

export type IMessage = {
  created_at: string;
  id: string;
  is_edited: boolean;
  send_by: string;
  text: string;
  users: {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
  } | null;
};

interface MessageState {
  hasMore: boolean;
  page: number;
  messages: IMessage[];
  actionMessage: IMessage | null;
  optimisticIds: string[];
  addMessage: (message: IMessage) => void;
  setActionMessage: (message: IMessage | null) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: IMessage) => void;
  setOptimisticIds: (id: string) => void;
  setMessages: (message: IMessage[]) => void;
}

export const useMessageStore = create<MessageState>()((set) => ({
  hasMore: true,
  page: 1,
  messages: [],
  actionMessage: null,
  optimisticIds: [],
  setMessages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= LIMIT_MESSAGE
    })),
  addMessage: (newMessages) =>
    set((state) => ({
      messages: [...state.messages, newMessages],
    })),
  setOptimisticIds: (id: string) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
  setActionMessage: (message) =>
    set(() => ({
      actionMessage: message,
    })),
  optimisticDeleteMessage: (messageId) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => message.id !== messageId),
      };
    }),
  optimisticUpdateMessage: (updateMessage) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => {
          if (message.id === updateMessage.id) {
            (message.text = updateMessage.text),
              (message.is_edited = updateMessage.is_edited);
          }
          return message;
        }),
      };
    }),
}));
