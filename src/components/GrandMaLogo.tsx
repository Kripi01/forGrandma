const GrandMaLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    {/* Lunettes rondes — icône grand-mère */}
    <circle cx="24" cy="32" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <circle cx="40" cy="32" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <path d="M34 32 L30 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    {/* Sourire */}
    <path d="M22 44 Q32 52 42 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export default GrandMaLogo;
