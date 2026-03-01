/**
 * Génération des légendes (flèches + labels) sur une image d'imagerie via LLM vision.
 */

import { chatCompletion } from "./llm.js";
import { LEGENDES_SYSTEM, LEGENDES_USER } from "./prompts.js";

/**
 * Parse la réponse JSON du LLM et valide le format des légendes.
 * @param {string} raw - Réponse brute du LLM
 * @returns {{ label: string, fleche: { x1, y1, x2, y2 } }[]}
 */
function parseLegendesResponse(raw) {
  if (!raw || typeof raw !== "string") return [];
  try {
    const cleaned = raw
      .replace(/```json\s?/g, "")
      .replace(/```\s?/g, "")
      .trim();
    const obj = JSON.parse(cleaned);
    const list = Array.isArray(obj.legendes) ? obj.legendes : [];
    return list
      .filter(
        (item) =>
          item &&
          typeof item.label === "string" &&
          item.fleche &&
          typeof item.fleche.x1 === "number" &&
          typeof item.fleche.y1 === "number" &&
          typeof item.fleche.x2 === "number" &&
          typeof item.fleche.y2 === "number"
      )
      .map((item) => ({
        label: String(item.label).trim() || "Zone",
        fleche: {
          x1: clamp(item.fleche.x1, 0, 1),
          y1: clamp(item.fleche.y1, 0, 1),
          x2: clamp(item.fleche.x2, 0, 1),
          y2: clamp(item.fleche.y2, 0, 1),
        },
      }));
  } catch {
    return [];
  }
}

function clamp(v, min, max) {
  const n = Number(v);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

/**
 * Génère les légendes (flèches + labels) pour une image d'imagerie.
 * @param {string} imageDataUrl - Data URL base64 de l'image (data:image/...;base64,...)
 * @param {object} extraction - Résultat de l'extraction du rapport
 * @returns {Promise<{ label: string, fleche: { x1, y1, x2, y2 } }[]>}
 */
export async function runLegendes(imageDataUrl, extraction) {
  const extractionStr =
    typeof extraction === "string" ? extraction : JSON.stringify(extraction, null, 2);
  const textContent = LEGENDES_USER(extractionStr);

  const messages = [
    { role: "system", content: LEGENDES_SYSTEM },
    {
      role: "user",
      content: [
        { type: "image_url", image_url: { url: imageDataUrl } },
        { type: "text", text: textContent },
      ],
    },
  ];

  const raw = await chatCompletion(messages, {
    max_tokens: 1024,
    temperature: 0.2,
    timeoutMs: 60_000,
  });

  return parseLegendesResponse(raw);
}
