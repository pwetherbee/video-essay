"use client";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useParams, usePathname } from "next/navigation";
import { toast } from "react-toastify";

export default function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Message[];
}) {
  const params = useParams();
  const key = params.key;

  const path = usePathname();

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
      onFinish() {
        if (!path.includes("/c/")) {
          window.history.pushState({}, "", `/c/${id}`);
        }
      },
    });
  return (
    <div>
      <h1>Client Component</h1>
    </div>
  );
}
