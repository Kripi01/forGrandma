/**
 * Génère un PDF de rapport d'imagerie factice pour tester l'app (Comprendre mon rapport).
 * Usage : node scripts/generate-test-report.js
 * Sortie : docs/rapport_test.pdf
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "docs");
const outPath = path.join(outDir, "rapport_test.pdf");

const reportLines = [
  "RAPPORT D'IMAGERIE MÉDICALE",
  "Date d'examen : 15/02/2025",
  "Patient : [Anonymisé pour test]",
  "",
  "Type d'examen : Scanner thoracique sans et avec injection de produit de contraste.",
  "",
  "Technique : Coupes millimétriques en hélicoïdal sur le thorax.",
  "",
  "RÉSULTATS",
  "Poumon droit : Discrète opacité en verre dépoli au niveau du lobe supérieur,",
  "sans nodule solide associé. Pas d'épanchement pleural.",
  "",
  "Poumon gauche : Pas d'anomalie focale. Médiastin centré.",
  "",
  "Conclusion du radiologue : Opacité en verre dépoli du lobe supérieur droit,",
  "de signification indéterminée. Recommandation : surveillance par scanner",
  "à 3 mois ou avis pneumologique selon contexte clinique. Pas de caractère",
  "d'urgence.",
];

async function main() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = 14;
  const margin = 50;
  let page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();
  let y = height - margin;

  for (const line of reportLines) {
    if (y < margin + lineHeight) {
      page = doc.addPage([595, 842]);
      y = page.getHeight() - margin;
    }
    page.drawText(line, {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
  }

  const bytes = await doc.save();
  await mkdir(outDir, { recursive: true });
  await writeFile(outPath, bytes);
  console.log("PDF généré :", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
