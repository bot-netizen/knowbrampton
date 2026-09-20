// Copy the ETL output the browser needs into public/. Build-time only.
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const data = join(here, "..", "..", "data");
const out = join(here, "..", "public", "data");

// Only files the client actually fetches. Everything else is inlined at build time.
const clientFiles = ["wards.geojson"];

await mkdir(out, { recursive: true });
for (const f of clientFiles) {
  await copyFile(join(data, f), join(out, f));
  console.log(`sync-data: ${f}`);
}
