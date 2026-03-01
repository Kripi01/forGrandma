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
  "Type d'examen : IRM thoracique (séquence pondérée T1).",
  "",
  "Technique : Coupes axiales du thorax, étage médiastino-pulmonaire.",
  "",
  "RÉSULTATS",
  "Coupe axiale : Bonne visualisation des structures médiastinales.",
  "Corps vertébral thoracique en arrière-plan sans signal anormal.",
  "Côtes et paroi thoracique d'aspect habituel.",
  "",
  "Poumons : Champs pulmonaires en hyposignal (air), sans anomalie focale.",
  "Pas d'épanchement pleural.",
  "",
  "Médiastin : Vaisseaux du médiastin (aorte, crosse, troncs supra-aortiques,",
  "veine cave supérieure) en flux vide, sans dilatation. Trachée et bronches",
  "souches perméables. Pas d'adénopathie médiastinale significative.",
  "",
  "Conclusion du radiologue : IRM thoracique sans particularité.",
  "Aspect en accord avec une coupe axiale T1 habituelle. Pas d'urgence.",
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
