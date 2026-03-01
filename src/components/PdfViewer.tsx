import { useState, useRef } from "react";
import { FileText, Upload, Sparkles, Camera, Image as ImageIcon } from "lucide-react";
import { extractTextFromPdf } from "@/lib/pdfText";

interface PdfViewerProps {
  onUnderstandReport?: (reportText: string) => void;
  isSubmitting?: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL || "";

const PdfViewer = ({ onUnderstandReport, isSubmitting = false }: PdfViewerProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setExtractError(null);
    if (selected) {
      if (selected.type === "application/pdf") {
        setFile(selected);
        setPdfUrl(URL.createObjectURL(selected));
        setImageUrl(null);
      } else if (selected.type.startsWith("image/")) {
        setFile(selected);
        const url = URL.createObjectURL(selected);
        setImageUrl(url);
        setPdfUrl(null);
      }
    }
  };

  const handleUnderstandReport = async () => {
    if (!file || !onUnderstandReport) return;
    setExtractError(null);
    setExtracting(true);
    try {
      let text = "";
      if (file.type === "application/pdf") {
        text = await extractTextFromPdf(file);
      } else if (file.type.startsWith("image/")) {
        // OCR via Backend
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
        });
        reader.readAsDataURL(file);
        const base64 = await base64Promise;

        const res = await fetch(`${API_BASE}/api/report/ocr`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Erreur lors de l'OCR.");
        }
        const data = await res.json();
        text = data.text;
      }

      if (!text || !text.trim()) {
        setExtractError("Aucun texte n'a pu être extrait de ce document.");
        return;
      }
      onUnderstandReport(text);
    } catch (e) {
      setExtractError(
        e instanceof Error ? e.message : "Impossible d'analyser le document."
      );
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {imageUrl ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          <span className="font-medium truncate max-w-[150px]">
            {file ? file.name : "Aucun document"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => imageInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity border border-border"
          >
            <Camera className="w-3.5 h-3.5" />
            Photo
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-gm-gradient text-primary-foreground hover:opacity-90 transition-opacity shadow-gm"
          >
            <Upload className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Content (scrollable) + bouton fixe en bas */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-auto bg-gm-gradient-soft">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full min-h-[200px] border-0"
              title="PDF Viewer"
            />
          ) : imageUrl ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img src={imageUrl} alt="Rapport" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground p-4">
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center shadow-gm-soft">
                <FileText className="w-10 h-10 text-accent" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Analysez votre rapport médical</p>
                <p className="text-xs mt-1">Prenez une photo ou chargez un PDF</p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="px-5 py-2.5 text-sm font-medium rounded-xl bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity border border-border"
                >
                  <Camera className="w-4 h-4 inline mr-2" />
                  Prendre une photo
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gm-gradient text-primary-foreground hover:opacity-90 transition-opacity shadow-gm"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Sélectionner un PDF
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Bouton fixe en bas, visible dès qu’un document est chargé */}
        {file && (
          <div className="flex-shrink-0 border-t border-border/60 p-4 bg-card">
            {extractError && (
              <p className="text-sm text-destructive mb-3">{extractError}</p>
            )}
            <button
              onClick={handleUnderstandReport}
              disabled={isSubmitting || extracting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gm-gradient text-primary-foreground font-semibold text-sm shadow-gm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <Sparkles className="w-4 h-4" />
              {extracting
                ? (imageUrl ? "Lecture de l'image (IA)..." : "Extraction du texte…")
                : isSubmitting
                  ? "Analyse en cours…"
                  : "Comprendre ce rapport"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
