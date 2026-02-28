import GrandMaLogo from "@/components/GrandMaLogo";
import PdfViewer from "@/components/PdfViewer";
import ChatPanel from "@/components/ChatPanel";

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 bg-card border-b border-border/60 glass-white relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gm-gradient flex items-center justify-center text-primary-foreground shadow-gm animate-gradient">
            <GrandMaLogo className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-display font-bold text-foreground tracking-tight leading-tight">
              For <span className="text-gm-gradient">GrandMa</span>
            </h1>
            <p className="text-[11px] text-muted-foreground font-medium tracking-wide">Votre rapport, expliqué simplement</p>
          </div>
        </div>
      </header>

      {/* Main layout: 50% PDF | 50% Chat */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
        <div className="overflow-hidden border-r border-border/40">
          <PdfViewer />
        </div>
        <div className="overflow-hidden">
          <ChatPanel />
        </div>
      </main>
    </div>
  );
};

export default Index;
