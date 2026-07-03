import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
};

const FETCH_TIMEOUT_MS = 6000;

async function fetchWithTimeout(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${property}["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']*)["']`,
      "i"
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1]
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
    }
  }
  return null;
}

const ACTIVITY_DAYS = 30;

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildActivity(events: Array<{ created_at: string }>) {
  const counts = new Map<string, number>();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const days: { date: string; count: number }[] = [];
  for (let i = ACTIVITY_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    days.push({ date: toDateKey(d), count: 0 });
  }

  for (const event of events) {
    const key = toDateKey(new Date(event.created_at));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return days.map((day) => ({ ...day, count: counts.get(day.date) ?? 0 }));
}

async function getGithub() {
  const username = "lokidotdev";
  const [userRes, eventsRes] = await Promise.all([
    fetchWithTimeout(`https://api.github.com/users/${username}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 900 },
    }),
    fetchWithTimeout(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      { headers: { Accept: "application/vnd.github+json" }, next: { revalidate: 900 } }
    ),
  ]);

  if (!userRes.ok) throw new Error("GitHub user fetch failed");

  const user = await userRes.json();
  const events = eventsRes.ok ? await eventsRes.json() : [];
  const activity = buildActivity(Array.isArray(events) ? events : []);

  return {
    live: true,
    platform: "github",
    avatar: user.avatar_url as string,
    name: (user.name as string) || user.login,
    bio: user.bio as string | null,
    followers: user.followers as number,
    publicRepos: user.public_repos as number,
    link: user.html_url as string,
    activity,
  };
}

async function getLinkPreview(platform: "linkedin" | "twitter", url: string) {
  const res = await fetchWithTimeout(url, {
    headers: BROWSER_HEADERS,
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`${platform} fetch failed`);

  const html = await res.text();

  const title = extractMeta(html, "og:title");
  const description = extractMeta(html, "og:description");
  const image = extractMeta(html, "og:image");

  if (!title && !description) throw new Error(`${platform} preview unavailable`);

  return {
    live: true,
    platform,
    title,
    description,
    image,
    link: url,
  };
}

export async function GET(request: NextRequest) {
  const platform = request.nextUrl.searchParams.get("platform");

  try {
    if (platform === "github") {
      return NextResponse.json(await getGithub());
    }
    if (platform === "linkedin") {
      return NextResponse.json(
        await getLinkPreview("linkedin", "https://www.linkedin.com/in/yadav-lokesh/")
      );
    }
    if (platform === "twitter") {
      return NextResponse.json(
        await getLinkPreview("twitter", "https://x.com/lokidotdev")
      );
    }
    return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
  } catch {
    return NextResponse.json({ live: false, platform }, { status: 200 });
  }
}
