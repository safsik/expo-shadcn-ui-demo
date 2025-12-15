import { write } from "bun";

const M3U_URL = "https://iptv-org.github.io/iptv/index.language.m3u";
const OUTPUT_FILE = "./app/data/videos.ts";

// 1. Define the exact shape you requested
interface StreamRaw {
  id: string;
  title: string;
  url: string;
  thumb: string;
  isLive: boolean;
  author: string;
  views: string;
  rating: number;
  time: string;
}

// Fallback gradients if no logo is found
const FALLBACK_GRADIENTS = [
  "bg-gradient-to-br from-orange-600 to-red-900",
  "bg-gradient-to-bl from-red-600 via-orange-500 to-yellow-500",
  "bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-900",
  "bg-gradient-to-r from-cyan-500 to-blue-500",
  "bg-gradient-to-br from-pink-500 to-rose-500",
  "bg-gradient-to-bl from-indigo-900 via-purple-900 to-slate-900",
];

// Helper: Get random gradient
const getRandomGradient = () => 
  FALLBACK_GRADIENTS[Math.floor(Math.random() * FALLBACK_GRADIENTS.length)];

// Helper: Generate dummy views (e.g. "1.2K views" or "4.5M views")
const getRandomViews = () => {
  const isMillion = Math.random() > 0.8;
  if (isMillion) {
    return (Math.random() * 5 + 1).toFixed(1) + "M views";
  }
  return Math.floor(Math.random() * 900 + 10) + "K views";
};

// Helper: Generate dummy rating (4.0 - 5.0)
const getRandomRating = () => {
  return parseFloat((Math.random() * (5.0 - 4.0) + 4.0).toFixed(1));
};

console.log(`Fetching playlist from ${M3U_URL}...`);

try {
  const response = await fetch(M3U_URL);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  const text = await response.text();

  const streams: StreamRaw[] = [];
  const lines = text.split("\n");

  let streamCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("#EXTINF:")) {
      const infoPart = line.substring(8);
      const commaIndex = infoPart.lastIndexOf(",");
      const metaString = infoPart.substring(0, commaIndex);
      const name = infoPart.substring(commaIndex + 1).trim();

      // Extract logo URL
      const logoMatch = metaString.match(/tvg-logo="([^"]*)"/);
      const logoUrl = logoMatch ? logoMatch[1] : null;

      // Extract Stream URL (next line)
      let url = "";
      if (lines[i + 1] && !lines[i + 1].startsWith("#")) {
        url = lines[i + 1].trim();
      }

      if (url) {
        streamCount++;
        
        const thumb = logoUrl && logoUrl.length > 0 ? logoUrl : getRandomGradient();

        streams.push({
          id: `stream_${streamCount}`,
          title: name,
          url: url,
          thumb: thumb,
          isLive: true,                // Hardcoded as requested
          author: name,                // Same as title
          views: getRandomViews(),     // Dummy numbers
          rating: getRandomRating(),   // 4.0 to 5.0
          time: "",                    // Empty because isLive is true
        });
      }
    }
  }

  // 2. Generate the content for src/data/videos.ts
  const fileContent = `/**
 * Auto-generated HLS Stream List
 * Source: ${M3U_URL}
 * Generated at: ${new Date().toISOString()}
 */

export interface HlsStream {
  id: string;
  title: string;
  url: string;
  thumb: string;
  isLive: boolean;
  author: string;
  views: string;
  rating: number;
  time: string;
}

export const HLS_STREAMS: HlsStream[] = ${JSON.stringify(streams, null, 2)};
`;

  await write(OUTPUT_FILE, fileContent);
  console.log(`Generated ${streams.length} streams in ${OUTPUT_FILE}`);

} catch (error) {
  console.error("Error generating streams:", error);
  process.exit(1);
}