"use client";

import { Message } from "ai";
import { MemoizedReactMarkdown } from "./markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { IconBrandOpenai, IconUser } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function ChatMessage({ message }: { message: Message }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
            message.role === "user"
              ? "bg-background"
              : "bg-primary text-primary-foreground"
          )}
        >
          {message.role === "user" ? <IconUser /> : <IconBrandOpenai />}
        </div>
        <span className="text-gray-300 font-bold">
          {message.role === "assistant" ? "Mentor" : "You"}
        </span>
      </div>

      <MemoizedReactMarkdown
        className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
        }}
      >
        {message.content}
      </MemoizedReactMarkdown>
    </div>
  );
}
