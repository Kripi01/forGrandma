/**
 * Agent d'adaptation de la vulgarisation : prend l'explication simple initiale
 * et les libellés des légendes affichées sur l'image, et réécrit le texte
 * pour s'appuyer sur ces légendes (références explicites aux zones/labels).
 */

import { chatCompletion } from "./llm.js";
import { ADAPT_VULGARIZATION_SYSTEM, ADAPT_VULGARIZATION_USER } from "./prompts.js";

/**
 * Adapte le texte de vulgarisation pour qu'il fasse référence aux légendes affichées.
 * @param {string} vulgarization - Texte de l'explication simple (3 blocs séparés par "---")
 * @param {string[]} legendLabels - Liste des libellés des légendes (ex. ["Poumon droit", "Zone de densité"])
 * @returns {Promise<string>} Texte adapté (même structure 3 blocs)
 */
export async function runAdaptVulgarizationToLegendes(vulgarization, legendLabels) {
  if (!vulgarization || typeof vulgarization !== "string" || vulgarization.trim() === "") {
    return vulgarization || "";
  }
  const labels = Array.isArray(legendLabels) ? legendLabels.filter((l) => l != null && String(l).trim() !== "") : [];
  if (labels.length === 0) {
    return vulgarization;
  }

  const raw = await chatCompletion(
    [
      { role: "system", content: ADAPT_VULGARIZATION_SYSTEM },
      { role: "user", content: ADAPT_VULGARIZATION_USER(vulgarization.trim(), labels) },
    ],
    { max_tokens: 800, temperature: 0.3 }
  );

  let trimmed = raw && typeof raw === "string" ? raw.trim() : "";
  if (trimmed) {
    trimmed = trimmed.replace(/^```(?:text)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  }
  const out = trimmed || vulgarization;
  const hasRef = labels.some((l) => out.includes(l));
  if (!hasRef && out === vulgarization) {
    console.warn("[adapt-vulgarization] LLM response unchanged or no legend reference found; labels were:", labels.slice(0, 5));
  }
  return out;
}
