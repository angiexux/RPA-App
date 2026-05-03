import type { NextConfig } from "next";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const envPath = join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  try {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch (e) {
    console.warn("Could not parse .env.local:", e);
  }
}

const nextConfig: NextConfig = {};

export default nextConfig;
