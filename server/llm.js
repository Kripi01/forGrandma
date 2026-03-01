/**
 * Appel à une API LLM compatible OpenAI (chat completions).
 * Utilise OPENAI_API_KEY et OPENAI_API_URL (optionnel) depuis l’env.
 */

const getConfig = () => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_OPENAI;
  const baseUrl = process.env.OPENAI_API_URL || "https://api.openai.com/v1";
  const isLocal = /^https?:\/\/localhost(\d*)/.test(baseUrl) || /^https?:\/\/127\.0\.0\.1/.test(baseUrl);
  return { apiKey, baseUrl, isLocal };
};

/**
 * @param {Array<{ role: 'system' | 'user' | 'assistant'; content: string }>} messages
 * @param {{ model?: string; max_tokens?: number; temperature?: number }} options
 * @returns {Promise<string>} contenu du premier choix
 */
export async function chatCompletion(messages, options = {}) {
  const { apiKey, baseUrl, isLocal } = getConfig();
  if (!apiKey && !isLocal) {
    throw new Error("OPENAI_API_KEY (or OPENAI_API_KEY_OPENAI) is required unless using local API (e.g. Ollama)");
  }

  const model = options.model || process.env.OPENAI_MODEL || (isLocal ? "gemma3:27b" : "gpt-4o-mini");
  const maxTokens = options.max_tokens ?? 1024;
  const temperature = options.temperature ?? 0.3;
  const timeoutMs = options.timeoutMs ?? 90_000; // 90 s par appel (Ollama peut être lent)

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    "Content-Type": "application/json",
    ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
  };

  let res;
  try {
    res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new Error(
        "Le serveur LLM (Ollama ou API) n'a pas répondu à temps. Vérifiez qu'Ollama tourne (ollama run gemma3:27b) ou votre clé API."
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LLM API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (content == null) {
    throw new Error("LLM API: no content in response");
  }
  return content.trim();
}
