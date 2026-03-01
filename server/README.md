# API For Grandma

Backend for the report pipeline (extraction → explanation → validation → questions) and report-anchored chat.

## Run the server

1. **Environment variables**  
   At the project root, copy `.env.example` to `.env` and set at least:
   - `GOOGLE_API_KEY` (for Gemma 3 27B) or `OPENAI_API_KEY` (OpenAI or compatible)

2. **Dependencies**  
   From the project root:
   ```bash
   cd server && npm install
   ```

3. **Start**  
   From the project root:
   ```bash
   npm run dev:server
   ```
   Or from `server/`: `npm start`

   Server listens on `http://localhost:3001`. The Vite frontend (port 8080) proxies `/api` to this server.

## Endpoints

- `POST /api/report/understand` — Body: `{ reportText: string }` → extraction, explanation, validation, questions
- `POST /api/report/understand-stream` — Same, SSE stream
- `POST /api/chat` — Body: `{ message: string, context: string, history?: { role, text }[] }` → `{ reply: string }`
- `GET /api/health` — Server health

No data is persisted (no data leaks).
