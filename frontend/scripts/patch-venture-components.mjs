/**
 * Updates venture components to load CMS content via getVenturePageContent.
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsDir = join(__dirname, "../src/components/ventures");

/** @type {{ file: string; slug: string; imports: { name: string; module: string }[] }[]} */
const patches = [
  { file: "VenturesHero.tsx", slug: "main", imports: [{ name: "venturesHero", module: "ventures" }] },
  { file: "VenturesMission.tsx", slug: "main", imports: [{ name: "venturesMission", module: "ventures" }] },
  { file: "VenturesStats.tsx", slug: "main", imports: [{ name: "ventureStats", module: "ventures" }] },
  { file: "FocusAreas.tsx", slug: "main", imports: [{ name: "focusAreas", module: "ventures" }] },
  {
    file: "VenturesProjects.tsx",
    slug: "main",
    imports: [
      { name: "featuredProject", module: "ventures" },
      { name: "venturesProjects", module: "ventures" },
      { name: "venturesProjectsSection", module: "ventures" },
    ],
  },
  { file: "FeaturedProject.tsx", slug: "main", imports: [{ name: "featuredProject", module: "ventures" }] },
  { file: "VenturesCTA.tsx", slug: "main", imports: [{ name: "venturesCta", module: "ventures" }] },
  { file: "eco-lodge/EcoLodgeHero.tsx", slug: "eco-lodge", imports: [{ name: "ecoLodgeHero", module: "eco-lodge" }] },
  { file: "eco-lodge/EcoLodgeConcept.tsx", slug: "eco-lodge", imports: [{ name: "ecoLodgeConcept", module: "eco-lodge" }] },
  { file: "eco-lodge/EcoLodgeExperiences.tsx", slug: "eco-lodge", imports: [{ name: "ecoLodgeExperiences", module: "eco-lodge" }] },
  { file: "eco-lodge/EcoLodgeDesign.tsx", slug: "eco-lodge", imports: [{ name: "ecoLodgeDesign", module: "eco-lodge" }] },
  { file: "eco-lodge/EcoLodgeSustainability.tsx", slug: "eco-lodge", imports: [{ name: "ecoLodgeSustainability", module: "eco-lodge" }] },
  { file: "eco-lodge/EcoLodgeVision.tsx", slug: "eco-lodge", imports: [{ name: "ecoLodgeFutureVision", module: "eco-lodge" }] },
  { file: "eco-lodge/EcoLodgeLocation.tsx", slug: "eco-lodge", imports: [{ name: "ecoLodgeLocation", module: "eco-lodge" }] },
  { file: "eco-lodge/EcoLodgePartnerCta.tsx", slug: "eco-lodge", imports: [{ name: "ecoLodgePartnerCta", module: "eco-lodge" }] },
  { file: "eco-lodge/EcoLodgeClosing.tsx", slug: "eco-lodge", imports: [{ name: "ecoLodgeClosing", module: "eco-lodge" }] },
  { file: "conservation/ConservationHero.tsx", slug: "conservation", imports: [{ name: "conservationHero", module: "conservation" }] },
  { file: "conservation/ConservationPhilosophy.tsx", slug: "conservation", imports: [{ name: "conservationPhilosophy", module: "conservation" }] },
  { file: "conservation/ConservationFocusAreas.tsx", slug: "conservation", imports: [{ name: "conservationFocusAreas", module: "conservation" }] },
  { file: "conservation/ConservationCommunity.tsx", slug: "conservation", imports: [{ name: "conservationCommunity", module: "conservation" }] },
  { file: "conservation/ConservationPartners.tsx", slug: "conservation", imports: [{ name: "conservationPartners", module: "conservation" }] },
  { file: "conservation/ConservationValues.tsx", slug: "conservation", imports: [{ name: "conservationValues", module: "conservation" }] },
  { file: "conservation/ConservationInvolvement.tsx", slug: "conservation", imports: [{ name: "conservationInvolvement", module: "conservation" }] },
  { file: "conservation/ConservationClosing.tsx", slug: "conservation", imports: [{ name: "conservationClosing", module: "conservation" }] },
  { file: "community/CommunityHero.tsx", slug: "community", imports: [{ name: "communityHero", module: "community" }] },
  { file: "community/CommunityPhilosophy.tsx", slug: "community", imports: [{ name: "communityPhilosophy", module: "community" }] },
  { file: "community/CommunityFocusAreas.tsx", slug: "community", imports: [{ name: "communityFocusAreas", module: "community" }] },
  { file: "community/CommunityStories.tsx", slug: "community", imports: [{ name: "communityStories", module: "community" }] },
  { file: "community/CommunityCraftsmanship.tsx", slug: "community", imports: [{ name: "communityCraftsmanship", module: "community" }] },
  { file: "community/CommunityGallery.tsx", slug: "community", imports: [{ name: "communityGallery", module: "community" }] },
  { file: "community/CommunityPartners.tsx", slug: "community", imports: [{ name: "communityPartners", module: "community" }] },
  { file: "community/CommunityCta.tsx", slug: "community", imports: [{ name: "communityCta", module: "community" }] },
  { file: "community/CommunityClosing.tsx", slug: "community", imports: [{ name: "communityClosing", module: "community" }] },
  { file: "agriculture/AgricultureHero.tsx", slug: "agriculture", imports: [{ name: "agricultureHero", module: "agriculture" }] },
  { file: "agriculture/AgricultureApproach.tsx", slug: "agriculture", imports: [{ name: "agricultureApproach", module: "agriculture" }] },
  { file: "agriculture/AgricultureFocusAreas.tsx", slug: "agriculture", imports: [{ name: "agricultureFocusAreas", module: "agriculture" }] },
  { file: "agriculture/AgricultureLand.tsx", slug: "agriculture", imports: [{ name: "agricultureLand", module: "agriculture" }] },
  { file: "agriculture/AgricultureCommunity.tsx", slug: "agriculture", imports: [{ name: "agricultureCommunity", module: "agriculture" }] },
  { file: "agriculture/AgriculturePartners.tsx", slug: "agriculture", imports: [{ name: "agriculturePartners", module: "agriculture" }] },
  { file: "agriculture/AgricultureEcosystem.tsx", slug: "agriculture", imports: [{ name: "agricultureEcosystem", module: "agriculture" }] },
  { file: "agriculture/AgricultureClosing.tsx", slug: "agriculture", imports: [{ name: "agricultureClosing", module: "agriculture" }] },
  { file: "hospitality/HospitalityHero.tsx", slug: "hospitality", imports: [{ name: "hospitalityHero", module: "hospitality" }] },
  { file: "hospitality/HospitalityPhilosophy.tsx", slug: "hospitality", imports: [{ name: "hospitalityPhilosophy", module: "hospitality" }] },
  { file: "hospitality/HospitalityFocusAreas.tsx", slug: "hospitality", imports: [{ name: "hospitalityFocusAreas", module: "hospitality" }] },
  { file: "hospitality/HospitalityDesign.tsx", slug: "hospitality", imports: [{ name: "hospitalityDesign", module: "hospitality" }] },
  { file: "hospitality/HospitalityExperience.tsx", slug: "hospitality", imports: [{ name: "hospitalityExperience", module: "hospitality" }] },
  { file: "hospitality/HospitalityDestinations.tsx", slug: "hospitality", imports: [{ name: "hospitalityDestinations", module: "hospitality" }] },
  { file: "hospitality/HospitalitySustainability.tsx", slug: "hospitality", imports: [{ name: "hospitalitySustainability", module: "hospitality" }] },
  { file: "hospitality/HospitalityGallery.tsx", slug: "hospitality", imports: [{ name: "hospitalityGallery", module: "hospitality" }] },
  { file: "hospitality/HospitalityPartnership.tsx", slug: "hospitality", imports: [{ name: "hospitalityPartnership", module: "hospitality" }] },
  { file: "hospitality/HospitalityEcosystem.tsx", slug: "hospitality", imports: [{ name: "hospitalityEcosystem", module: "hospitality" }] },
  { file: "hospitality/HospitalityClosing.tsx", slug: "hospitality", imports: [{ name: "hospitalityClosing", module: "hospitality" }] },
  { file: "partner/PartnerHero.tsx", slug: "partner", imports: [{ name: "partnerHero", module: "partner" }] },
  { file: "partner/PartnerIntro.tsx", slug: "partner", imports: [{ name: "partnerIntro", module: "partner" }] },
  { file: "partner/PartnerTypes.tsx", slug: "partner", imports: [{ name: "partnershipTypes", module: "partner" }] },
  { file: "partner/PartnerVision.tsx", slug: "partner", imports: [{ name: "partnerVision", module: "partner" }] },
  { file: "partner/PartnerMoodboard.tsx", slug: "partner", imports: [{ name: "partnerMoodboard", module: "partner" }] },
  { file: "partner/PartnerCollaborators.tsx", slug: "partner", imports: [{ name: "partnerCollaborators", module: "partner" }] },
  { file: "partner/PartnerClosing.tsx", slug: "partner", imports: [{ name: "partnerClosing", module: "partner" }] },
];

function patchFile({ file, slug, imports }) {
  const filePath = join(componentsDir, file);
  let src = readFileSync(filePath, "utf-8");

  if (src.includes("getVenturePageContent")) {
    console.log(`Skip ${file} (already patched)`);
    return;
  }

  // Remove lib/data imports for listed names
  for (const imp of imports) {
    const patterns = [
      new RegExp(`import\\s*\\{[^}]*\\b${imp.name}\\b[^}]*\\}\\s*from\\s*["']@/lib/data/${imp.module}["'];?\\n`, "g"),
      new RegExp(`,\\s*${imp.name}`, "g"),
      new RegExp(`${imp.name}\\s*,`, "g"),
      new RegExp(`\\{\\s*${imp.name}\\s*\\}\\s*from\\s*["']@/lib/data/${imp.module}["'];?\\n`, "g"),
    ];
    for (const p of patterns) {
      src = src.replace(p, "");
    }
  }

  // Clean empty import lines
  src = src.replace(/import\s*\{\s*\}\s*from\s*["']@\/lib\/data\/[^"']+["'];?\n/g, "");

  const defaultImports = imports
    .map(
      (imp) =>
        `import { ${imp.name} as default${imp.name.charAt(0).toUpperCase()}${imp.name.slice(1)} } from "@/lib/data/${imp.module}";`,
    )
    .join("\n");

  // Fix default import naming - use simpler aliases
  const defaultLines = imports.map((imp) => {
    const alias = `default_${imp.name}`;
    return `import { ${imp.name} as ${alias} } from "@/lib/data/${imp.module}";`;
  });

  const destructuring = imports.map((imp) => imp.name).join(", ");
  const assignments = imports
    .map(
      (imp) =>
        `  const ${imp.name} = content.${imp.name} as typeof default_${imp.name};`,
    )
    .join("\n");

  const ventureImport = `import { getVenturePageContent } from "@/services/content/ventures";\n`;
  const defaultImportBlock = defaultLines.join("\n") + "\n";

  // Insert after last import
  const lastImportMatch = [...src.matchAll(/^import .+$/gm)].pop();
  if (!lastImportMatch) {
    console.error(`No imports in ${file}`);
    return;
  }
  const insertAt = lastImportMatch.index + lastImportMatch[0].length + 1;

  if (!src.includes("getVenturePageContent")) {
    src =
      src.slice(0, insertAt) +
      ventureImport +
      defaultImportBlock +
      src.slice(insertAt);
  }

  src = src.replace(
    /export function (\w+)\(\)/,
    `export async function $1()`,
  );

  const fnMatch = src.match(/export async function \w+\(\) \{/);
  if (fnMatch) {
    const fnStart = fnMatch.index + fnMatch[0].length;
    src =
      src.slice(0, fnStart) +
      `\n  const content = await getVenturePageContent("${slug}");\n${assignments}\n` +
      src.slice(fnStart);
  }

  writeFileSync(filePath, src);
  console.log(`Patched ${file}`);
}

for (const patch of patches) {
  patchFile(patch);
}

console.log("Done. Patch PartnerForm manually.");
