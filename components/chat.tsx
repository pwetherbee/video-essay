"use client";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ChatList from "./chat-message-list";
import { cn } from "@/lib/utils";

const initialPrompt: Message = {
  id: "1",
  role: "system",
  content:
    "You are an assistant that helps users recall information from videos. You will provide them with essay questions, quizzes and other prompts to help them remember the information.",
};

const quizPrompt = `Generate a quiz in JSON format about "{Topic}", with a mix of multiple-choice and text questions. Include a short answer for each text question. Format the quiz with a title, questions array, and each question specifying its type, the question text, and for text questions, a short answer.

eg.
\`\`\`
{
  "title": "Quiz on {Topic}",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "What is the capital of France?",
      "choices": ["London", "Paris", "New York", "Berlin"],
      "answer": "Paris"
    },
    {
      "type": "text",
      "question": "Explain the concept of gravity on a flat disk-shaped Earth and how it would affect individuals living towards the edge.",
      "answer": "The concept of gravity on a flat disk-shaped Earth is that the force of gravity would pull objects towards the center of the disk. This would mean that individuals living towards the edge would experience a force that pulls them towards the center of the disk."
    }
  ]
}

Begin the string with "%QUIZ%".`;

export default function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Message[];
}) {
  const params = useParams();
  const key = params.key;

  const router = useRouter();

  const path = usePathname();

  useEffect(() => {
    if (path.includes("/c/")) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [path]);

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
        // smooth scroll to the bottom of the chat
        // window.scrollTo({
        //   top: document.body.scrollHeight,
        //   behavior: "smooth",
        // });
        router.refresh();
      },
    });

  const [videoUrl, setVideoUrl] = useState("");
  const [quiz, setQuiz] = useState(true);

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
          ]]]
          
          ${quiz ? quizPrompt : ""}
          `,
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

  const [error, setError] = useState(false);
  const [validUrl, setValidUrl] = useState(false);

  useEffect(() => {
    // validate the video url
    if (videoUrl) {
      try {
        const url = new URL(videoUrl);
        if (url.hostname !== "www.youtube.com") {
          throw new Error("Invalid URL");
        }
        setError(false);
        setValidUrl(true);
      } catch (error) {
        setError(true);
      }
    }
  }, [videoUrl]);

  // check if text field is focused, and set it to boolean
  const [isFocused, setIsFocused] = useState(false);

  if (!(messages.length > 1)) {
    return (
      <div className="flex flex-col items-center h-screen justify-center gap-2">
        <article className="prose">
          <h1>Add A Youtube Link to Begin</h1>
          <h2>
            Paste a link to a Youtube video you would like to be quizzed on.
          </h2>
          <p className="text-sm">
            **Note. The closer the video is to a lecture or educational content,
            the better the quiz will be. Videos that are based on information in
            the public domain are best.
          </p>

          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
            className={cn(
              "input w-full",
              error ? "input-error" : validUrl ? "input-info" : ""
            )}
          />
          <div className="flex justify-center items-center gap-2 mt-2">
            <button
              onClick={handleSearchVideo}
              className="btn btn-primary"
              disabled={!!error || !videoUrl}
            >
              Generate
            </button>

            <input
              onChange={() => setQuiz(!quiz)}
              checked={quiz}
              className="checkbox"
              type="checkbox"
              id="search"
            />
            <label htmlFor="search">Create Quiz</label>
          </div>
          <div className="divider" />
          <p>Make sure the url is in the format </p>
          <pre className="p-2 rounded-md">
            https://www.youtube.com/watch?v=VIDEO_ID
          </pre>
        </article>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* <div className="flex justify-end">
        <button className="btn">Delete</button>
      </div> */}

      <ChatList messages={messages} />
      <div className="sticky bottom-0 pb-4 w-full flex justify-center">
        <div className=" w-2/5">
          <form
            className={cn(
              "flex bg-base-100 rounded-md gap-2 items-center p-2 shadow-md",
              isFocused ? "" : "opacity-25"
            )}
          >
            <textarea
              tabIndex={0}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message."
              spellCheck={false}
              className="min-h-[60px] flex-1 rounded-md bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 "
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <button
              type="button"
              className="btn btn-ghost btn-outline w-20"
              onClick={() => {
                append(
                  { role: "user", content: input },
                  {
                    options: {
                      body: {
                        id,
                      },
                    },
                  }
                );
                setInput("");
              }}
            >
              Send
            </button>
            <input
              onChange={() => setQuiz(!quiz)}
              checked={quiz}
              className="checkbox checkbox-sm"
              type="checkbox"
              id="search"
            />
            <label htmlFor="search">Quiz</label>
          </form>
        </div>
      </div>
    </div>
  );
}
