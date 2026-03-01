import { useRef, useState, useEffect } from "react";
import type { LegendAnnotation } from "@/types/report";

interface ImageWithLegendsProps {
  imageUrl: string;
  legendes: LegendAnnotation[];
  alt?: string;
  className?: string;
}

/** Affiche une image avec overlay SVG : flèches et labels (coordonnées normalisées 0–1). */
const ImageWithLegends = ({ imageUrl, legendes, alt = "Image légendée", className = "" }: ImageWithLegendsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const img = el.querySelector("img");
      if (img) {
        const w = img.clientWidth;
        const h = img.clientHeight;
        if (w !== size.width || h !== size.height) setSize({ width: w, height: h });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [imageUrl, size.width, size.height]);

  const arrowheadSize = 8;

  return (
    <div ref={containerRef} className={`relative inline-block max-w-full ${className}`}>
      <img
        src={imageUrl}
        alt={alt}
        className="max-w-full h-auto object-contain block rounded-lg"
        draggable={false}
      />
      {size.width > 0 && size.height > 0 && legendes.length > 0 && (
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          width={size.width}
          height={size.height}
          style={{ overflow: "visible" }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth={arrowheadSize}
              markerHeight={arrowheadSize}
              refX={arrowheadSize}
              refY={arrowheadSize / 2}
              orient="auto"
            >
              <polygon
                points={`0 0, ${arrowheadSize} ${arrowheadSize / 2}, 0 ${arrowheadSize}`}
                fill="hsl(var(--primary))"
              />
            </marker>
          </defs>
          {legendes.map((leg, i) => {
            const x1 = leg.fleche.x1 * size.width;
            const y1 = leg.fleche.y1 * size.height;
            const x2 = leg.fleche.x2 * size.width;
            const y2 = leg.fleche.y2 * size.height;
            const labelOffset = 8;
            /* Texte au niveau du point de départ de la flèche (x1, y1), pas à l’arrivée */
            const tx = x1 + labelOffset;
            const ty = y1 + 4;
            const pad = 4;
            const approxLabelWidth = Math.min(leg.label.length * 7, size.width * 0.4);
            const boxW = approxLabelWidth + pad * 2;
            const boxH = 18;
            const boxX = tx - pad;
            const boxY = ty - 14;
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  markerEnd="url(#arrowhead)"
                />
                <rect
                  x={boxX}
                  y={boxY}
                  width={boxW}
                  height={boxH}
                  rx={4}
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1}
                  opacity={0.95}
                />
                <text
                  x={tx}
                  y={ty}
                  fill="hsl(var(--foreground))"
                  fontSize={11}
                  fontWeight={600}
                >
                  {leg.label.length > 25 ? leg.label.slice(0, 24) + "…" : leg.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
};

export default ImageWithLegends;
