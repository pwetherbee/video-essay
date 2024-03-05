import { NextRequest, NextResponse } from "next/server";

const MAX_CAPTIONS = 50;

// ES5
var getSubtitles = require("youtube-captions-scraper").getSubtitles;

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;

  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.error();
  }

  // strip out the video id from the url
  const id = url.split("v=")[1];

  const captions = await getSubtitles({
    videoID: id,
    lang: "en",
  });

  console.log(captions);

  const parsedCaptions = parseCaptions(captions);

  return NextResponse.json(parsedCaptions);
};

function parseCaptions(
  captions: {
    start: number;
    dur: number;
    text: string;
  }[]
) {
  // turn captions into a continuious string of text, ignoring the start and dur
  const parsedCaptions = captions
    .slice(0, MAX_CAPTIONS)
    .map((caption) => caption.text)
    .join(" ");

  return parsedCaptions;
}
