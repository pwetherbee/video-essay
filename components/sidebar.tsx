import NewChat from "@/components/new-chat";
import ViewKey from "@/components/view-key";
import { getChats } from "../app/actions";
import { unstable_noStore as noStore } from "next/cache";
import ChatsList from "./chats-list";

export default async function SideBar({ keyVal }: { keyVal: string }) {
  noStore();
  console.log(keyVal);
  const chats = await getChats(keyVal);
  console.log(chats);
  return (
    <div className="w-64 h-screen bg-base-100/50 backdrop-blur p-1 flex flex-col items-center gap-4 sticky top-0">
      <ViewKey keyValue={keyVal} />
      <NewChat />
      <div className="divider" />
      <ChatsList chats={chats} />
    </div>
  );
}
