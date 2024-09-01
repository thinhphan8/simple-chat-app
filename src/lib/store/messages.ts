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
  optimisticIds: string[];
  addMessage: (message: IMessage) => void;
  setActionMessage: (message: IMessage | null) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: IMessage) => void;
  setOptimisticIds: (id: string) => void;
}

export const useMessageStore = create<MessageState>()((set) => ({
  messages: [],
  actionMessage: null,
  optimisticIds: [],
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
