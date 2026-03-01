/** Sortie du pipeline backend (POST /api/report/understand) */
export interface ReportPipelineResult {
  extraction: ExtractedFacts;
  vulgarization: string;
  validationOk: boolean;
  questions: string[];
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
