import { buildAllPets } from "./build-from-source.mjs";
import { SECTION_PETS } from "./source-config.mjs";

async function main() {
  console.log(`Building ${SECTION_PETS.length} section pets from source sprites...`);
  await buildAllPets();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
