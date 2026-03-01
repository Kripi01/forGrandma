# Revue de code – 0001 Compagnon agentique patient

## 1. Conformité au plan (0001_PLAN.md)

- **Backend** : Présent. `POST /api/report/understand` et `POST /api/chat` implémentés dans `server/index.js`. Pipeline 4 étapes (extraction, vulgarisation, validation, questions) dans `server/pipeline.js`. Aucune persistance.
- **Frontend** : Composant résultat pipeline (`ReportExplanationPanel`), saisie via `PdfViewer` (extraction PDF côté client + envoi du texte), état partagé `pipelineResult` passé au `ChatPanel`. Chat branché sur `POST /api/chat` avec contexte extraction + vulgarisation + historique.
- **Alignement** : Le plan est respecté (phases 1, 2A, 2B).

---

## 2. Bugs et points d’attention

### 2.1 Corrigé : analyse « tourne dans le vide »

- **Problème** : L’appel à `POST /api/report/understand` n’avait pas de timeout. Si Ollama ne répond pas (non démarré ou très lent), le chargement restait indéfini.
- **Correction** :
  - **Frontend** (`src/pages/Index.tsx`) : `AbortController` + timeout 180 s sur le `fetch`. En cas d’abandon, message d’erreur invitant à vérifier Ollama et le backend.
  - **Backend** (`server/llm.js`) : Timeout 90 s par appel LLM (`AbortController` + `signal` sur `fetch`). En cas de dépassement, erreur explicite renvoyée au client.

### 2.2 Historique du chat (ChatPanel)

- **Comportement** : `history` envoyé à l’API est construit à partir de `messages` au moment du clic. Comme `setMessages([...prev, userMsg])` est asynchrone, `messages` ne contient pas encore le message courant ; celui-ci est bien envoyé dans le champ `message`. L’historique contient donc les échanges précédents uniquement, ce qui est correct.
- **Conclusion** : Pas de bug, comportement cohérent avec l’API.

### 2.3 Alignement des données (snake_case / camelCase)

- **Backend** : Les prompts demandent un JSON avec des clés en français (`localisation`, `type_examen`, `conclusion_rapport`, etc.). `parseExtraction` renvoie ces clés telles quelles.
- **Frontend** : `ReportPipelineResult` et `ExtractedFacts` dans `src/types/report.ts` utilisent les mêmes noms (snake_case pour les champs issus du rapport). Pas de décalage.
- **API** : Le backend renvoie `{ extraction, vulgarization, validationOk, questions }` (camelCase pour `validationOk`). Le type TypeScript utilise aussi `validationOk` et `vulgarization`. Alignement OK.

### 2.4 Réponse LLM (structure)

- **Backend** : On lit `data.choices?.[0]?.message?.content`. Format standard OpenAI / Ollama. Pas de structure imbriquée du type `{ data: { ... } }` côté réponses utilisées ici.
- **Pipeline** : En cas d’échec de parsing JSON pour l’extraction, fallback avec `conclusion_rapport: raw?.slice(0, 500)`. Les étapes vulgarisation / validation / questions ont des fallbacks (texte par défaut, `validationOk = false`, questions par défaut). Comportement robuste.

---

## 3. Sur-ingénierie / taille des fichiers

- **Fichiers** : `Index.tsx`, `ChatPanel.tsx`, `ReportExplanationPanel.tsx`, `PdfViewer.tsx` restent de taille raisonnable (< 200 lignes). `pipeline.js` et `llm.js` sont courts et lisibles.
- **Pas de refactoring nécessaire** pour la taille ou la complexité à ce stade.

---

## 4. Style et cohérence

- **Frontend** : TypeScript, hooks React, même style de composants (interfaces explicites, `className` Tailwind).
- **Backend** : ESM (`import`/`export`), pas de mix CommonJS/ESM.
- **Prompts** : Regroupés dans `server/prompts.js`, en français, cohérents avec le plan (pas de diagnostic, rappel médecin, etc.).

---

## 5. Synthèse

| Point | Statut |
|-------|--------|
| Plan implémenté | OK |
| Bug « tourne dans le vide » | Corrigé (timeouts front + back) |
| Alignement données (snake_case, API) | OK |
| Robustesse (fallbacks pipeline) | OK |
| Taille / complexité | OK |
| Style / cohérence | OK |

**Recommandation** : Vérifier qu’Ollama est lancé (`ollama run llama3.2`) et que le backend tourne sur le port 3001 avant de tester l’analyse du rapport PDF. En cas de timeout, les messages d’erreur guident désormais l’utilisateur.
