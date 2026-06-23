import ConnectPageClient from "@/components/ConnectPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect",
  description: "Get in touch with Lokesh Yadav — send a message or find him on LinkedIn and GitHub.",
};

export default function ConnectPage() {
  return <ConnectPageClient />;
}
