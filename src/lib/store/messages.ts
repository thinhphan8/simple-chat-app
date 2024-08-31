import { create } from "zustand";

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
  messages: IMessage[];
  actionMessage: IMessage | null;
  addMessage: (message: IMessage) => void;
  setActionMessage: (message: IMessage | null) => void;
  optimisticDeleteMessage: (messageId: string) => void;
}

export const useMessageStore = create<MessageState>()((set) => ({
  messages: [],
  actionMessage: null,
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
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
}));
