"use client";

interface OriginStoryProps {
  className?: string;
}

export function OriginStory({ className = "" }: OriginStoryProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 400 520"
        className="w-full h-full"
        aria-label="From Bangkok, Thailand to New Orleans, Louisiana"
      >
        {/* Thailand silhouette - background */}
        <g className="text-accent" opacity="0.25">
          <path
            d="M120 40
               C140 35, 160 30, 180 35
               C200 40, 210 50, 215 70
               C220 90, 210 110, 200 125
               C190 140, 175 150, 170 170
               C165 190, 170 210, 165 230
               C160 250, 150 260, 145 280
               C140 300, 145 320, 140 340
               C135 360, 125 375, 120 390
               C115 405, 120 415, 125 420
               C130 425, 140 420, 145 410
               C150 400, 155 385, 160 370
               C165 355, 175 345, 180 330
               C185 315, 180 300, 175 285
               C170 270, 160 260, 155 245
               C150 230, 155 215, 165 200
               C175 185, 190 175, 200 160
               C210 145, 225 135, 235 120
               C245 105, 250 85, 245 65
               C240 45, 225 35, 205 30
               C185 25, 165 30, 145 35
               C125 40, 115 45, 120 40
               Z"
            fill="currentColor"
          />
        </g>

        {/* Bangkok marker */}
        <circle cx="185" cy="120" r="6" fill="#22c55e" />

        {/* "Bangkok" label */}
        <text
          x="200"
          y="90"
          className="fill-white font-medium"
          style={{ fontSize: "18px", fontFamily: "var(--font-display)" }}
        >
          Bangkok
        </text>

        {/* Traveling cat illustration */}
        <g transform="translate(140, 200)">
          {/* Cat body */}
          <ellipse cx="60" cy="45" rx="35" ry="28" fill="currentColor" className="text-accent" />

          {/* Cat head */}
          <ellipse cx="60" cy="25" rx="22" ry="18" fill="currentColor" className="text-accent" />

          {/* Ears */}
          <path d="M42 15 L48 0 L54 15 Z" fill="currentColor" className="text-accent" />
          <path d="M66 15 L72 0 L78 15 Z" fill="currentColor" className="text-accent" />
          <path d="M45 14 L48 5 L51 14 Z" fill="#ff6b9d" />
          <path d="M69 14 L72 5 L75 14 Z" fill="#ff6b9d" />

          {/* Eyes */}
          <ellipse cx="52" cy="22" rx="5" ry="6" fill="#22c55e" />
          <ellipse cx="68" cy="22" rx="5" ry="6" fill="#22c55e" />
          <ellipse cx="52" cy="22" rx="2.5" ry="4" fill="black" />
          <ellipse cx="68" cy="22" rx="2.5" ry="4" fill="black" />
          <circle cx="50" cy="20" r="1.5" fill="white" />
          <circle cx="66" cy="20" r="1.5" fill="white" />

          {/* Nose */}
          <path d="M60 28 L57 32 L63 32 Z" fill="#ff6b9d" />

          {/* Tail - curved upward happily */}
          <path
            d="M95 45 Q115 30, 110 10 Q108 0, 100 5"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            className="text-accent"
          />

          {/* Front legs */}
          <rect x="45" y="65" width="8" height="20" rx="4" fill="currentColor" className="text-accent" />
          <rect x="58" y="65" width="8" height="20" rx="4" fill="currentColor" className="text-accent" />

          {/* Back legs */}
          <rect x="68" y="62" width="10" height="23" rx="5" fill="currentColor" className="text-accent" />
          <rect x="80" y="62" width="10" height="23" rx="5" fill="currentColor" className="text-accent" />
        </g>

        {/* Dotted journey path */}
        <path
          d="M200 300 C200 330, 220 360, 250 380"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="6 4"
          fill="none"
          opacity="0.4"
        />

        {/* Louisiana silhouette - background */}
        <g className="text-accent" transform="translate(200, 350)" opacity="0.25">
          <path
            d="M10 10
               C20 5, 40 5, 60 8
               C80 11, 100 10, 120 15
               C125 17, 128 22, 125 30
               C122 38, 115 45, 110 55
               C105 65, 108 75, 115 85
               C122 95, 130 100, 135 110
               C140 120, 138 130, 130 135
               C122 140, 110 138, 100 140
               C90 142, 80 148, 70 155
               C60 162, 50 165, 40 160
               C30 155, 25 145, 20 135
               C15 125, 10 115, 8 105
               C6 95, 8 85, 5 75
               C2 65, 0 55, 5 45
               C10 35, 8 25, 10 10
               Z"
            fill="currentColor"
          />
        </g>

        {/* New Orleans marker */}
        <circle cx="295" cy="480" r="6" fill="#22c55e" />

        {/* "New Orleans" label */}
        <text
          x="200"
          y="510"
          className="fill-white font-medium"
          style={{ fontSize: "18px", fontFamily: "var(--font-display)" }}
        >
          New Orleans
        </text>
      </svg>
    </div>
  );
}

// Alternative: Side by side version for different layouts
export function OriginStoryHorizontal({ className = "" }: OriginStoryProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 600 280"
        className="w-full h-full"
        aria-label="From Bangkok, Thailand to New Orleans, Louisiana"
      >
        {/* Thailand silhouette */}
        <g className="text-accent" transform="translate(20, 10) scale(0.55)">
          <path
            d="M120 40
               C140 35, 160 30, 180 35
               C200 40, 210 50, 215 70
               C220 90, 210 110, 200 125
               C190 140, 175 150, 170 170
               C165 190, 170 210, 165 230
               C160 250, 150 260, 145 280
               C140 300, 145 320, 140 340
               C135 360, 125 375, 120 390
               C115 405, 120 415, 125 420
               C130 425, 140 420, 145 410
               C150 400, 155 385, 160 370
               C165 355, 175 345, 180 330
               C185 315, 180 300, 175 285
               C170 270, 160 260, 155 245
               C150 230, 155 215, 165 200
               C175 185, 190 175, 200 160
               C210 145, 225 135, 235 120
               C245 105, 250 85, 245 65
               C240 45, 225 35, 205 30
               C185 25, 165 30, 145 35
               C125 40, 115 45, 120 40
               Z"
            fill="currentColor"
            opacity="0.85"
          />
          {/* Bangkok marker */}
          <circle cx="185" cy="120" r="12" fill="black" />
          <circle cx="185" cy="120" r="7" fill="#22c55e" />
        </g>

        {/* Bangkok label */}
        <text
          x="100"
          y="270"
          textAnchor="middle"
          className="fill-white font-medium"
          style={{ fontSize: "16px", fontFamily: "var(--font-display)" }}
        >
          Bangkok
        </text>

        {/* Journey arrow */}
        <g transform="translate(220, 120)">
          <line
            x1="0"
            y1="0"
            x2="140"
            y2="0"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="8 6"
            opacity="0.3"
          />
          <polygon
            points="150,0 135,-8 135,8"
            fill="white"
            opacity="0.4"
          />
        </g>

        {/* Louisiana silhouette */}
        <g className="text-accent" transform="translate(380, 30) scale(1.3)">
          <path
            d="M10 10
               C20 5, 40 5, 60 8
               C80 11, 100 10, 120 15
               C125 17, 128 22, 125 30
               C122 38, 115 45, 110 55
               C105 65, 108 75, 115 85
               C122 95, 130 100, 135 110
               C140 120, 138 130, 130 135
               C122 140, 110 138, 100 140
               C90 142, 80 148, 70 155
               C60 162, 50 165, 40 160
               C30 155, 25 145, 20 135
               C15 125, 10 115, 8 105
               C6 95, 8 85, 5 75
               C2 65, 0 55, 5 45
               C10 35, 8 25, 10 10
               Z"
            fill="currentColor"
            opacity="0.85"
          />
          {/* New Orleans marker */}
          <circle cx="95" cy="130" r="10" fill="black" />
          <circle cx="95" cy="130" r="6" fill="#22c55e" />
        </g>

        {/* New Orleans label */}
        <text
          x="500"
          y="270"
          textAnchor="middle"
          className="fill-white font-medium"
          style={{ fontSize: "16px", fontFamily: "var(--font-display)" }}
        >
          New Orleans
        </text>
      </svg>
    </div>
  );
}
