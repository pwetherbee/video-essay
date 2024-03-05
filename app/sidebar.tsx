"use client";

import NewChat from "@/components/new-chat";
import ViewKey from "@/components/view-key";

export default function SideBar() {
  return (
    <div className="w-64 h-screen bg-base-100/50 backdrop-blur py-2 flex flex-col items-center gap-4">
      <ViewKey />
      <NewChat />
      <div className="divider" />
    </div>
  );
}
