const GrandMaLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Heart shape */}
    <path
      d="M32 56 C32 56 8 40 8 22 C8 14 14 8 22 8 C27 8 31 11 32 14 C33 11 37 8 42 8 C50 8 56 14 56 22 C56 40 32 56 32 56Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Stethoscope earpiece */}
    <circle cx="32" cy="30" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
    {/* Plus sign inside */}
    <line x1="32" y1="27" x2="32" y2="33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="29" y1="30" x2="35" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Glasses */}
    <ellipse cx="24" cy="18" rx="5" ry="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <ellipse cx="40" cy="18" rx="5" ry="3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M29 18 L35 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default GrandMaLogo;
