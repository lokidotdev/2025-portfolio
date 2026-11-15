"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/types/project";

/** Same endpoint the DesignEng sponsor page reads its visit count from. */
const DESIGNENG_STATS_URL = "https://api.designeng.tools/api/v1/sponsors/pricing";

/** Same rounding as designeng.tools/sponsor: 55,400 → "55k+". */
function formatVisits(visits: number) {
  if (visits >= 1_000_000) return `${Math.floor(visits / 1_000_000)}M+`;
  if (visits >= 1_000) return `${Math.floor(visits / 1_000)}K+`;
  return visits.toLocaleString();
}

// One request per page load, shared by every component that lists projects.
let visitsPromise: Promise<number | null> | null = null;
function fetchDesignEngVisits() {
  visitsPromise ??= fetch(DESIGNENG_STATS_URL)
    .then((r) => (r.ok ? r.json() : null))
    .then((body) => {
      const v = body?.data?.siteVisits;
      return typeof v === "number" && v > 0 ? v : null;
    })
    .catch(() => null);
  return visitsPromise;
}

/** Replaces static badges with live numbers where a project has a `liveBadge` source. Falls back to `badge`. */
export function useLiveProjects<T extends Project>(projects: T[]): T[] {
  const [visits, setVisits] = useState<number | null>(null);
  const needsVisits = projects.some((p) => p.liveBadge === "designengVisits");

  useEffect(() => {
    if (!needsVisits) return;
    let alive = true;
    fetchDesignEngVisits().then((v) => alive && setVisits(v));
    return () => {
      alive = false;
    };
  }, [needsVisits]);

  return useMemo(() => {
    if (visits === null) return projects;
    return projects.map((p) =>
      p.liveBadge === "designengVisits" ? { ...p, badge: `${formatVisits(visits)} visits/m` } : p,
    );
  }, [projects, visits]);
}
