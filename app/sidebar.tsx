import NewChat from "@/components/new-chat";
import ViewKey from "@/components/view-key";
import { getChats } from "./actions";

export default async function SideBar({ keyVal }: { keyVal: string }) {
  console.log(keyVal);
  const chats = await getChats(keyVal);
  console.log(chats);
  return (
    <div className="w-64 h-screen bg-base-100/50 backdrop-blur p-2 flex flex-col items-center gap-4">
      <ViewKey keyValue={keyVal} />
      <NewChat />
      <div className="divider" />
    </div>
  );
}
