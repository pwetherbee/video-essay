"use client";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import ChatList from "./chat-message-list";

const initialPrompt: Message = {
  id: "1",
  role: "system",
  content:
    "You are an assistant that helps users recall information from videos. You will provide them with essay questions, quizzes and other prompts to help them remember the information.",
};

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
      initialMessages: initialMessages.length
        ? initialMessages
        : [initialPrompt],
      id,
      body: {
        id,
        userKey: key,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
      onFinish() {
        if (!path.includes("/c/")) {
          window.history.pushState({}, "", `/${key}/c/${id}`);
        }
      },
    });

  const [videoUrl, setVideoUrl] = useState("");

  const handleSearchVideo = async () => {
    if (!videoUrl) return;

    const response = await fetch(`/api/get-captions?url=${videoUrl}`);
    const data = await response.json();

    if (response.ok) {
      append(
        {
          role: "system",
          content: `%VIDEO[[[
            {
              "type": "video",
              "url": "${videoUrl}",
              "captions": ${JSON.stringify(data)}
            }
          ]]]`,
        },
        {
          options: {
            body: {
              title: data.title,
              description: data.description,
              thumbnail: data.thumbnail,
              id,
            },
          },
        }
      );
    } else {
      toast.error(data.message);
    }
  };

  // const handleDeleteChat = async () => {
  //   await fetch(`/api/delete-chat?id=${id}`);
  //   stop();
  // };

  if (!(messages.length > 1)) {
    return (
      <div className="flex flex-col items-center h-screen justify-center gap-2">
        <article className="prose">
          <h1>Link to Begin</h1>
        </article>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Video URL"
          className="input"
        />
        <button onClick={handleSearchVideo} className="btn btn-primary">
          Search
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* <div className="flex justify-end">
        <button className="btn">Delete</button>
      </div> */}

      <ChatList messages={messages} />
    </div>
  );
}
