"use client";

import { useState, useEffect } from "react";
import { IconKey } from "@tabler/icons-react";

export default function Name() {
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
      {key}
    </p>
  );
}
