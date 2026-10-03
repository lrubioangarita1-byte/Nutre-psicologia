import type { InstrumentIcon } from "@/lib/instruments";

export function InstrumentIconSvg({ icon }: { icon: InstrumentIcon }) {
  const common = { width: 72, height: 72, viewBox: "0 0 72 72", "aria-hidden": true } as const;
  switch (icon) {
    case "heart":
      return (
        <svg {...common}>
          <path d="M36 58C20 46 10 36 10 24C10 14 18 8 26 8C31 8 35 11 36 16C37 11 41 8 46 8C54 8 62 14 62 24C62 36 52 46 36 58Z" fill="var(--rose)" />
          <path d="M12 30 Q22 18 32 30 T52 30" stroke="var(--olive)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "waves":
      return (
        <svg {...common}>
          <circle cx="36" cy="36" r="29" fill="var(--rose-soft)" />
          <path d="M16 38 Q26 26 36 38 T56 38" stroke="var(--olive)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M16 48 Q26 36 36 48 T56 48" stroke="var(--coral)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.75" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="36" cy="36" r="29" fill="var(--rose-soft)" />
          <circle cx="36" cy="36" r="14" fill="none" stroke="var(--olive)" strokeWidth="3" />
          <circle cx="36" cy="36" r="4" fill="var(--coral)" />
        </svg>
      );
    case "circles":
      return (
        <svg {...common}>
          <circle cx="36" cy="20" r="14" fill="var(--rose)" opacity="0.85" />
          <circle cx="18" cy="44" r="14" fill="var(--olive)" opacity="0.7" />
          <circle cx="54" cy="44" r="14" fill="var(--coral)" opacity="0.7" />
          <circle cx="27" cy="58" r="10" fill="var(--rose)" opacity="0.55" />
          <circle cx="45" cy="58" r="10" fill="var(--olive)" opacity="0.55" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <circle cx="36" cy="36" r="29" fill="none" stroke="var(--rose)" strokeWidth="3" />
          <path d="M36 19 L40 31 L53 31 L42 39 L46 51 L36 43 L26 51 L30 39 L19 31 L32 31 Z" fill="var(--coral)" />
        </svg>
      );
    case "letter":
      return (
        <svg {...common}>
          <rect x="10" y="10" width="52" height="52" rx="10" fill="var(--rose-soft)" />
          <text x="36" y="47" fontFamily="Playfair Display, serif" fontSize="32" fontWeight="700" fill="var(--coral)" textAnchor="middle">X</text>
        </svg>
      );
  }
}
