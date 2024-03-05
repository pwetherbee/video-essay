"use client";

import { Message } from "ai";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ChatsList({
  chats,
}: {
  chats: {
    userId: string;
    createdAt: Date;
    id: string;
    messages: Message[];
    title: string;
  }[];
}) {
  const { id } = useParams();
  return (
    <ul className="menu menu-md w-56 rounded-box">
      {chats.map((chat, index) => (
        <li key={index}>
          <Link
            className={id === chat.id ? "active" : ""}
            href={`/${chat.userId}/c/${chat.id}`}
          >
            <span className="overflow-ellipsis line-clamp-1 text-md">
              {chat.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
