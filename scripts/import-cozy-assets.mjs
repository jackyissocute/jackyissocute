import { copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOWNLOADS = "/Users/jackylin/Downloads";

copyFileSync(join(DOWNLOADS, "Banner gif.gif"), join(ROOT, "assets/banner.gif"));
console.log("Copied cozy banner -> assets/banner.gif");

copyFileSync(join(DOWNLOADS, "GIF from GIFER.gif"), join(ROOT, "assets/pets/cat-birdwatch.gif"));
console.log("Copied birdwatch cat -> assets/pets/cat-birdwatch.gif");

const result = spawnSync("python3", [join(__dirname, "import-cozy-calico.py")], {
  stdio: "inherit",
});
if (result.status !== 0) process.exit(result.status ?? 1);
