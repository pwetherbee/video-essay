"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { kv } from "@vercel/kv";

import { type Chat } from "@/types/Chat";

export async function getChats(userId?: string | null) {
  if (!userId) {
    return [];
  }

  try {
    const pipeline = kv.pipeline();
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true,
    });

    for (const chat of chats) {
      pipeline.hgetall(chat);
    }

    const results = await pipeline.exec();

    return results as Chat[];
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string, userId: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`);

  if (!chat || (userId && chat.userId !== userId)) {
    return null;
  }

  return chat;
}

export async function removeChat({
  id,
  path,
  userId,
}: {
  id: string;
  path: string;
  userId: string;
}) {
  //Convert uid to string for consistent comparison with session.user.id
  const uid = String(await kv.hget(`chat:${id}`, "userId"));

  if (uid !== userId) {
    return {
      error: "Unauthorized",
    };
  }

  await kv.del(`chat:${id}`);
  await kv.zrem(`user:chat:${userId}`, `chat:${id}`);

  revalidatePath("/");
  return revalidatePath(path);
}

export async function clearChats({ userId }: { userId: string }) {
  const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1);
  if (!chats.length) {
    return redirect("/");
  }
  const pipeline = kv.pipeline();

  for (const chat of chats) {
    pipeline.del(chat);
    pipeline.zrem(`user:chat:${userId}`, chat);
  }

  await pipeline.exec();

  revalidatePath("/");
  return redirect("/");
}

export async function getSharedChat(id: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`);

  if (!chat || !chat.sharePath) {
    return null;
  }

  return chat;
}

export async function shareChat(id: string, userId: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`);

  if (!chat || chat.userId !== userId) {
    return {
      error: "Something went wrong",
    };
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`,
  };

  await kv.hmset(`chat:${chat.id}`, payload);

  return payload;
}
