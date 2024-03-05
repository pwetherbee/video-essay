"use client";

import Chat from "@/components/chat";
import { nanoid } from "@/lib/utils";

export default function Page() {
  return (
    <div>
      <Chat id={nanoid()} initialMessages={[]} />
    </div>
  );
}
