"use client";

import { useState, useEffect } from "react";
import { IconKey } from "@tabler/icons-react";
import Link from "next/link";

export default function ViewKey({ keyValue }: { keyValue: string }) {
  const [key, setKey] = useState<string>();
  useEffect(() => {
    function checkUserData() {
      const item = localStorage.getItem("key");

      if (item) {
        setKey(item);
      }
    }

    window.addEventListener("storage", checkUserData);

    return () => {
      window.removeEventListener("storage", checkUserData);
    };
  }, []);

  useEffect(() => {
    setKey(localStorage.getItem("key") || "");
  }, []);

  return (
    <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
      <IconKey size={15} />
      {keyValue}
      <Link href="/">
        <button className="btn btn-xs btn-ghost">Change</button>
      </Link>
    </p>
  );
}
