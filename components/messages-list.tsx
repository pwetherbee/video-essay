"use client";

import { Message } from "ai";

export default function ChatList({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col">
      {messages.map((message, index) => (
        <div key={index} className="flex">
          <div className="flex-1">
            <div className="text-gray-500">{message.role}</div>
            <div>{message.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
