import { type Message } from "ai";

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;

  videoUrl: string;
  videoCaptions: string;

  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
}
