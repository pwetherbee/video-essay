import { ChatCompletionMessage } from "openai/resources/index.mjs";

export interface EssayChat {
  id: string;
  user: string;
  createdAt: string;
  videoUrl: string;
  videoTitle: string;
  videoCaptions: string;

  chatMessages: ChatCompletionMessage[];
}
