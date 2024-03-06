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
    if (!key || key.length > 10) return;
    localStorage.setItem("key", key);
    setSuccess(true);
    router.push(`/${key}`);
  };
  return (
    <div className="join">
      <input
        className="input input-bordered w-full max-w-xs join-item"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        type="text"
        placeholder="Create your unique key"
      />
      {key && key.length > 10 && (
        <p className="text-xs text-red-600">
          Key must be less than 10 characters
        </p>
      )}
      <button onClick={handleSaveKey} className="btn btn-primary join-item">
        Submit {success && "✔️"}
      </button>
    </div>
  );
}
