"use client";

import SetKey from "@/components/set-key";

export default function Home() {
  return (
    <main className=" ">
      <div className="flex items-center justify-center h-screen gap-4">
        <article className="prose flex-1">
          <h1 className="text-7xl">Auto Quiz</h1>
          <h3>Commit the videos you watch to memory</h3>
        </article>
        <div className="space-y-4">
          <article className="prose">
            <h2>Get Started</h2>
            <p>
              Welcome to the video quiz generator powered by ChatGPT. To get
              started, create a unique key to save your chat history.
            </p>
          </article>
          <SetKey />
        </div>
      </div>
    </main>
  );
}
