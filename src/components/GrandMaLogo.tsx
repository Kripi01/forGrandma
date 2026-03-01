import logo4GM from "@/assets/logo4GM.png";

const GrandMaLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <img
    src={logo4GM}
    alt="For GrandMa"
    className={className}
    aria-hidden
  />
);

export default GrandMaLogo;
