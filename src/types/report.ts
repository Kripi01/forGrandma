/** Annotation de légende : flèche + label (coordonnées normalisées 0–1) */
export interface LegendAnnotation {
  label: string;
  fleche: { x1: number; y1: number; x2: number; y2: number };
}

/** Une image d'imagerie (radio/IRM) avec ses légendes générées par le LLM */
export interface LegendItem {
  imageUrl: string;
  legendes?: LegendAnnotation[] | null;
}

/** Sortie du pipeline backend (POST /api/report/understand) */
export interface ReportPipelineResult {
  extraction: ExtractedFacts;
  vulgarization: string;
  validationOk: boolean;
  questions: string[];
  /** Images d'imagerie (radio/IRM) ajoutées par le patient, avec légendes (flèches) — en lien avec l'explication vulgarisée */
  legendItems?: LegendItem[];
}

/** Résultat partiel (streaming) : chaque champ peut arriver au fil de l’eau */
export type ReportPipelineResultPartial = Partial<ReportPipelineResult> & {
  extraction?: ExtractedFacts;
};

/** Question de contexte patient (adaptée au type d'examen) */
export interface ContextQuestion {
  id: string;
  label: string;
}

/** Réponses du patient aux questions de contexte (id → réponse) */
export type PatientContext = Record<string, string>;

export interface ExtractedFacts {
  localisation?: string;
  type_examen?: string;
  faits_principaux?: string[];
  termes_techniques?: string[];
  conclusion_rapport?: string;
  niveau_urgence?: string | null;
}
