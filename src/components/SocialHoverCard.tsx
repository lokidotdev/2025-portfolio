"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Users, FolderGit2 } from "lucide-react";

type Platform = "github" | "linkedin" | "twitter";

type GithubData = {
  live: true;
  platform: "github";
  avatar: string;
  name: string;
  bio: string | null;
  followers: number;
  publicRepos: number;
  link: string;
  activity: { date: string; count: number }[];
};

type PreviewData = {
  live: true;
  platform: "linkedin" | "twitter";
  title: string | null;
  description: string | null;
  image: string | null;
  link: string;
};

type Unavailable = { live: false; platform: Platform | null };

type SocialData = GithubData | PreviewData | Unavailable;

const cache = new Map<Platform, SocialData>();

const cardVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.94, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 300, damping: 26, mass: 0.6 },
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.96,
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

const Skeleton = ({ darkTheme }: { darkTheme: boolean }) => (
  <div className="flex flex-col gap-2 animate-pulse">
    <div className="flex items-center gap-3">
      <div className={`h-10 w-10 rounded-full ${darkTheme ? "bg-on-dark/10" : "bg-ink/10"}`} />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className={`h-3 w-24 rounded ${darkTheme ? "bg-on-dark/10" : "bg-ink/10"}`} />
        <div className={`h-2.5 w-16 rounded ${darkTheme ? "bg-on-dark/10" : "bg-ink/10"}`} />
      </div>
    </div>
    <div className={`h-2.5 w-full rounded ${darkTheme ? "bg-on-dark/10" : "bg-ink/10"}`} />
    <div className={`h-2.5 w-2/3 rounded ${darkTheme ? "bg-on-dark/10" : "bg-ink/10"}`} />
  </div>
);

const GithubCard = ({ data, darkTheme }: { data: GithubData; darkTheme: boolean }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <img
        src={data.avatar}
        alt={data.name}
        className="h-10 w-10 rounded-full object-cover"
      />
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-sm truncate">{data.name}</span>
        <span className={`text-xs truncate ${darkTheme ? "text-on-dark/45" : "text-ink/45"}`}>
          @lokidotdev
        </span>
      </div>
    </div>
    {data.bio && (
      <p className={`text-xs leading-snug line-clamp-2 ${darkTheme ? "text-on-dark/60" : "text-ink/60"}`}>
        {data.bio}
      </p>
    )}
    <div className={`flex items-center gap-4 text-xs ${darkTheme ? "text-on-dark/60" : "text-ink/60"}`}>
      <span className="flex items-center gap-1 whitespace-nowrap">
        <Users size={13} /> {data.followers} followers
      </span>
      <span className="flex items-center gap-1 whitespace-nowrap">
        <FolderGit2 size={13} /> {data.publicRepos} repos
      </span>
    </div>
    {/* <ActivityGraph activity={data.activity} darkTheme={darkTheme} /> */}
  </div>
);

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type ActivityDay = GithubData["activity"][number];

function buildCalendar(activity: ActivityDay[]) {
  const cells: (ActivityDay | null)[] = [];
  const firstDate = new Date(`${activity[0].date}T00:00:00Z`);
  const leading = firstDate.getUTCDay();
  for (let i = 0; i < leading; i++) cells.push(null);
  cells.push(...activity);
  while (cells.length % 7 !== 0) cells.push(null);

  const columns: (ActivityDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    columns.push(cells.slice(i, i + 7));
  }

  let lastMonth = -1;
  const labels = columns.map((column) => {
    const firstCell = column.find((cell) => cell !== null);
    if (!firstCell) return "";
    const month = new Date(`${firstCell.date}T00:00:00Z`).getUTCMonth();
    if (month === lastMonth) return "";
    lastMonth = month;
    return MONTH_NAMES[month];
  });

  return { columns, labels };
}

const ActivityGraph = ({
  activity,
  darkTheme,
}: {
  activity: GithubData["activity"];
  darkTheme: boolean;
}) => {
  const max = Math.max(1, ...activity.map((day) => day.count));
  const total = activity.reduce((sum, day) => sum + day.count, 0);
  const { columns, labels } = buildCalendar(activity);

  const emptyColor = darkTheme
    ? "color-mix(in srgb, var(--color-on-dark) 8%, transparent)"
    : "color-mix(in srgb, var(--color-ink) 8%, transparent)";

  return (
    <div>
      <div className="flex flex-col gap-1 w-fit">
        <div className="flex gap-0.75">
          {labels.map((label, i) => (
            <span
              key={i}
              className={`w-3.25 text-[9px] leading-none ${darkTheme ? "text-on-dark/45" : "text-ink/45"}`}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="flex gap-0.75">
          {columns.map((column, ci) => (
            <div key={ci} className="flex flex-col gap-0.75">
              {column.map((cell, ri) => (
                <div
                  key={ri}
                  title={
                    cell
                      ? `${cell.count} contribution${cell.count === 1 ? "" : "s"} on ${cell.date}`
                      : undefined
                  }
                  className="h-3.25 w-3.25 rounded-[3px]"
                  style={{
                    backgroundColor: !cell
                      ? "transparent"
                      : cell.count === 0
                        ? emptyColor
                        : "var(--color-design)",
                    opacity: cell && cell.count > 0 ? 0.35 + (cell.count / max) * 0.65 : 1,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className={`mt-2 text-[11px] ${darkTheme ? "text-on-dark/45" : "text-ink/45"}`}>
        {total} contributions in the last 30 days
      </p>
    </div>
  );
};

const PreviewCard = ({ data, darkTheme }: { data: PreviewData; darkTheme: boolean }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      {data.image && (
        <img
          src={data.image}
          alt={data.title ?? data.platform}
          className="h-10 w-10 rounded-full object-cover"
        />
      )}
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-sm truncate">
          {data.title ?? (data.platform === "linkedin" ? "LinkedIn" : "X (Twitter)")}
        </span>
        <span className={`text-xs truncate ${darkTheme ? "text-on-dark/45" : "text-ink/45"}`}>
          {data.platform === "linkedin" ? "linkedin.com" : "x.com"}
        </span>
      </div>
    </div>
    {data.description && (
      <p className={`text-xs leading-snug line-clamp-3 ${darkTheme ? "text-on-dark/60" : "text-ink/60"}`}>
        {data.description}
      </p>
    )}
  </div>
);

interface SocialHoverCardProps {
  platform: Platform;
  darkTheme: boolean;
  children: React.ReactNode;
}

const SocialHoverCard = ({ platform, darkTheme, children }: SocialHoverCardProps) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<SocialData | null>(cache.get(platform) ?? null);
  const [loading, setLoading] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async () => {
    if (cache.has(platform)) {
      setData(cache.get(platform)!);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/social?platform=${platform}`);
      const json = (await res.json()) as SocialData;
      cache.set(platform, json);
      setData(json);
    } catch {
      const fallback: SocialData = { live: false, platform };
      cache.set(platform, fallback);
      setData(fallback);
    } finally {
      setLoading(false);
    }
  }, [platform]);

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
    fetchData();
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const unavailable = data !== null && !data.live;
  const showCard = open && !unavailable;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      <AnimatePresence>
        {showCard && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 ${
              platform === "github" ? "w-fit max-w-64" : "w-64"
            } rounded-2xl p-4 z-50 origin-bottom backdrop-blur-xl border ${
              darkTheme
                ? "bg-surface-inverse/90 border-on-dark/10 text-on-dark"
                : "bg-surface-raised/90 border-ink/5 text-ink"
            } shadow-[0_10px_40px_-10px_color-mix(in_srgb,var(--color-ink)_35%,transparent)]`}
          >
            {loading || !data || !data.live ? (
              <Skeleton darkTheme={darkTheme} />
            ) : data.platform === "github" ? (
              <GithubCard data={data} darkTheme={darkTheme} />
            ) : (
              <PreviewCard data={data} darkTheme={darkTheme} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialHoverCard;
