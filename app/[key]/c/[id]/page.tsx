import { getChat } from "@/app/actions";
import Chat from "@/components/chat";
import { notFound } from "next/navigation";

export default async function ChatPage({
  params,
}: {
  params: {
    id: string;
    key: string;
  };
}) {
  const chat = await getChat(params.id, params.key);

  if (!chat) {
    notFound();
  }

  return <Chat id={params.id} initialMessages={chat.messages} />;
}
