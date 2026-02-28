import { useState, useRef } from "react";
import { FileText, Upload, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

const PdfViewer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setPdfUrl(URL.createObjectURL(selected));
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span className="font-medium truncate max-w-[200px]">
            {file ? file.name : "Aucun document"}
          </span>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-gm-gradient text-primary-foreground hover:opacity-90 transition-opacity shadow-gm"
        >
          <Upload className="w-3.5 h-3.5" />
          Charger un PDF
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-gm-gradient-soft">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title="PDF Viewer"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center shadow-gm-soft">
              <FileText className="w-10 h-10 text-accent" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Chargez votre rapport médical</p>
              <p className="text-xs mt-1">Format PDF accepté</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-gm-gradient text-primary-foreground hover:opacity-90 transition-opacity shadow-gm animate-float-up"
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Sélectionner un fichier
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
