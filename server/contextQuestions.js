/**
 * Questions de contexte patient adaptées au type d'examen.
 * Utilisées pour guider la vulgarisation et les questions pour le médecin.
 */

/** @typedef {{ id: string, label: string }} ContextQuestion */

/** Questions génériques (tous types d'examens) */
const GENERIC = [
  { id: "autres_examens_recents", label: "Avez-vous passé d'autres examens d'imagerie récemment ?" },
  { id: "traitement_en_cours", label: "Prenez-vous des médicaments régulièrement ?" },
  { id: "objectif_comprendre", label: "Qu'est-ce qui vous préoccupe le plus dans ce rapport ?" },
];

/** Questions adaptées au thorax / poumon */
const THORACIQUE = [
  { id: "antecedents_respiratoires", label: "Avez-vous des antécédents respiratoires (asthme, bronchite, etc.) ?" },
  { id: "tabac", label: "Êtes-vous ou avez-vous été fumeur ?" },
  { id: "souffle", label: "Avez-vous des difficultés respiratoires ou un traitement pour le souffle ?" },
];

/** Questions adaptées à l'abdomen */
const ABDOMINAL = [
  { id: "antecedents_digestifs", label: "Avez-vous des antécédents digestifs ou hépatiques ?" },
  { id: "douleurs_ventre", label: "Avez-vous des douleurs ou gênes abdominales ?" },
];

/** Questions adaptées à l'IRM / neurologie / tête */
const NEURO_IRM = [
  { id: "antecedents_neuro", label: "Avez-vous des antécédents neurologiques (migraines, AVC, etc.) ?" },
  { id: "cephalées", label: "Avez-vous des maux de tête fréquents ?" },
];

/** Questions adaptées à l'échographie */
const ECHO = [
  { id: "grossesse", label: "Êtes-vous enceinte ou susceptible de l'être ?" },
  { id: "organe_cible", label: "L'examen concernait-il un organe précis (foie, rein, thyroïde…) ? Lequel ?" },
];

/**
 * Retourne les questions de contexte à afficher pour un type d'examen donné.
 * @param {string} typeExamen - type_examen extrait du rapport (ex. "scanner thoracique")
 * @returns {ContextQuestion[]}
 */
export function getContextQuestions(typeExamen) {
  if (!typeExamen || typeof typeExamen !== "string") {
    return [...GENERIC];
  }
  const t = typeExamen.toLowerCase();
  const questions = [...GENERIC];

  if (t.includes("thoracique") || t.includes("thorax") || t.includes("poumon") || t.includes("pulmonaire")) {
    questions.push(...THORACIQUE);
  } else if (t.includes("abdominal") || t.includes("abdomen") || t.includes("foie") || t.includes("rein")) {
    questions.push(...ABDOMINAL);
  } else if (t.includes("irm") || t.includes("céphal") || t.includes("crâne") || t.includes("neuro")) {
    questions.push(...NEURO_IRM);
  } else if (t.includes("échographie") || t.includes("echo")) {
    questions.push(...ECHO);
  }

  return questions;
}
