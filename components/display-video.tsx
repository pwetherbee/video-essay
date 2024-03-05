"use client";

import { useMemo } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";

export default function DisplayVideo({ content }: { content: string }) {
  const id = useMemo(() => {
    return parseVideoId(content);
  }, [content]);

  console.log(id);

  // only render the video if we have an id

  return (
    <div>
      {id && (
        <iframe
          src={"https://www.youtube.com/embed/" + id}
          title={""}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          width={650} // 16:9
          height={400}
        ></iframe>
      )}{" "}
    </div>
  );
}

function parseVideoId(content: string) {
  const startIndex = content.indexOf("watch?v=") + 8;
  const endIndex = content.indexOf('"', startIndex);
  const id = content.slice(startIndex, endIndex);
  return id;
}
