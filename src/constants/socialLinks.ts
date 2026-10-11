import { siteConfig } from "@/lib/site";

/** Profiles shown in the Connect section — `handle` is what people read, not the raw URL. */
export const socialLinks = [
  { platform: "LinkedIn", handle: "in/lokidotdev", href: siteConfig.linkedin },
  { platform: "GitHub", handle: "@lokidotdev", href: siteConfig.github },
  { platform: "X", handle: "@lokidotdev", href: siteConfig.twitter },
];
