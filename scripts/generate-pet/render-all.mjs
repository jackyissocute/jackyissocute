import { buildAllPets } from "./build-from-source.mjs";
import { buildAllTraversePets } from "./build-traverse.mjs";
import { SECTION_PETS } from "./source-config.mjs";

async function main() {
  const standard = SECTION_PETS.filter((p) => p.animation !== "traverse");
  console.log(`Building ${standard.length} section pets from source sprites...`);
  await buildAllPets(standard);

  console.log(`Building traverse pets...`);
  await buildAllTraversePets();

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
