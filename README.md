# For GrandMa

Your medical report, explained simply.

![Demo Image](docs/demo.png)

## Getting Started (A to Z)

### 1. Installation
Install dependencies at the root (frontend) and in the server folder.

```bash
npm install
cd server && npm install && cd ..
```

### 2. Configuration
Create a `.env` file at the root with your Google Gemini API key:
```env
GOOGLE_API_KEY=your_key_here
```

### 3. Running the App
Start both the frontend and the backend with a single command:

```bash
npm run dev
```
The application is accessible at [http://localhost:8080](http://localhost:8080).

---

## Project Structure

- `src/` : Frontend React (Vite)
  - `components/` : UI components (Chat, PDF, Legends)
  - `pages/Index.tsx` : Main page
- `server/` : Backend Node.js (Express)
  - `index.js` : API endpoints
  - `pipeline.js` : Analysis pipeline logic (Gemma 3 27B)
  - `prompts.js` : AI instructions
  - `llm.js` : Google Gemini API communication (Gemma 3 27B)
- `docs/` : Test documents and images for demo
