// create a local storage system that can be used to store and retrieve chats and messages
/*
It will be an array of objects,

import { ChatCompletionMessage } from "openai/resources/index.mjs";

export interface Chat {
  videoUrl: string;
  videoTitle: string;
  videoCaptions: string;

  chatMessages: ChatCompletionMessage[];
}

local storage Chats will contain Chat[]

*/

import { EssayChat } from "@/types/Chat";

// Path: lib/local-storage.ts

export const getChats = (): EssayChat[] => {
  const chats = localStorage.getItem("chats");
  if (chats) {
    return JSON.parse(chats);
  }
  return [];
};

export const setChats = (chats: EssayChat[]) => {
  localStorage.setItem("chats", JSON.stringify(chats));
};

export const addChat = (chat: EssayChat) => {
  const chats = getChats();
  chats.push(chat);
  setChats(chats);
};

export const removeChat = (index: number) => {
  const chats = getChats();
  chats.splice(index, 1);
  setChats(chats);
};

export const clearChats = () => {
  localStorage.removeItem("chats");
};

export const getChat = (index: number) => {
  const chats = getChats();
  return chats[index];
};

export const setChat = (index: number, chat: EssayChat) => {
  const chats = getChats();
  chats[index] = chat;
  setChats(chats);
};

export const getChatCount = () => {
  return getChats().length;
};
