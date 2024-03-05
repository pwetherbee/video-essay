"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function Chat() {
  const params = useParams();
  const key = params.key;
  return (
    <>
      <Link href={`/${key}`}>
        <button className="btn w-full">New Chat</button>
      </Link>
    </>
  );
}
