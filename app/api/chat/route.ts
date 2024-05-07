import { kv } from "@vercel/kv";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

import { nanoid } from "@/lib/utils";
import { revalidateChatLayout } from "@/components/actions";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const json = await req.json();
  const { messages, previewToken } = json;

  if (previewToken) {
    openai.apiKey = previewToken;
  }

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
    stream: true,
  });

  console.log(json.userKey);

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      // generate a quick title based on the last message
      const titleRes = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Create a super short title for this chat based on the last message",
          },
          {
            role: "system",
            content: completion,
          },
        ],
        temperature: 0.7,
      });

      const title = titleRes.choices[0].message.content;
      const id = json.id ?? nanoid();
      const userId = json.userKey;
      const createdAt = Date.now();
      const path = `/chat/${id}`;
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: "assistant",
          },
        ],
      };
      await kv.hmset(`chat:${id}`, payload);
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`,
      });

      await revalidateChatLayout(userId);
    },
  });

  return new StreamingTextResponse(stream);
}
