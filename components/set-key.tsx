"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SetKey() {
  const [key, setKey] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    setKey(localStorage.getItem("key") || "");
  }, []);

  const [success, setSuccess] = useState(false);
  const handleSaveKey = () => {
    if (!key) return;
    localStorage.setItem("key", key);
    setSuccess(true);
    router.push(`/${key}`);
  };
  return (
    <>
      <input
        className="input input-bordered w-full max-w-xs"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        type="text"
        placeholder="Create your unique key"
      />
      <button onClick={handleSaveKey} className="btn btn-primary">
        Submit {success && "✔️"}
      </button>
    </>
  );
}
