"use client";

import SetKey from "@/components/set-key";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <main className=" ">
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <article className="prose">
          <h1>Commit the videos you watch to memory</h1>
          <h2>Get Started</h2>
          <p>
            Welcome to the video quiz generator powered by ChatGPT. To get
            started, create a unique key to save your chat history.
          </p>
        </article>
        <SetKey />
      </div>
    </main>
  );
}
