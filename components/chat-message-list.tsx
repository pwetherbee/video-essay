"use client";

import { Message } from "ai";
import DisplayVideo from "./display-video";
import ChatMessage from "./chat-message";

export default function ChatList({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col container justify-center items-center gap-4">
      {messages
        .slice(1)
        .map((message, index) =>
          message.content.startsWith("%VIDEO") ? (
            <DisplayVideo key={index} content={message.content} />
          ) : (
            <ChatMessage key={index} message={message} />
          )
        )}
    </div>
  );
}
