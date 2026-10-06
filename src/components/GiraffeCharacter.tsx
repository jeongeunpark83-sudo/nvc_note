import React from 'react';

interface GiraffeCharacterProps {
  mood?: 'happy' | 'listening' | 'thinking' | 'celebrate' | 'caring';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GiraffeCharacter: React.FC<GiraffeCharacterProps> = ({
  mood = 'happy',
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        {/* Soft aura/background circle */}
        <circle cx="100" cy="100" r="92" fill="#FEF3C7" fillOpacity="0.45" />

        {/* Giraffe Long Neck */}
        <path
          d="M85 130 Q82 170 80 195 L120 195 Q118 170 115 130 Z"
          fill="#FBBF24"
        />
        {/* Neck Spots */}
        <ellipse cx="94" cy="155" rx="6" ry="8" fill="#D97706" />
        <ellipse cx="107" cy="175" rx="7" ry="6" fill="#D97706" />

        {/* Giraffe Ears */}
        {/* Left Ear */}
        <path
          d="M60 75 C45 65 50 45 65 60 C68 64 68 70 65 74 Z"
          fill="#F59E0B"
        />
        <path
          d="M60 72 C52 65 54 53 64 63 Z"
          fill="#FDE68A"
        />
        {/* Right Ear */}
        <path
          d="M140 75 C155 65 150 45 135 60 C132 64 132 70 135 74 Z"
          fill="#F59E0B"
        />
        <path
          d="M140 72 C148 65 146 53 136 63 Z"
          fill="#FDE68A"
        />

        {/* Giraffe Horns (Ossicones) */}
        {/* Left horn stem */}
        <rect x="79" y="32" width="7" height="28" rx="3.5" fill="#D97706" />
        <circle cx="82.5" cy="30" r="8" fill="#B45309" />
        {/* Right horn stem */}
        <rect x="114" y="32" width="7" height="28" rx="3.5" fill="#D97706" />
        <circle cx="117.5" cy="30" r="8" fill="#B45309" />

        {/* Giraffe Head Base */}
        <ellipse cx="100" cy="85" rx="38" ry="42" fill="#FBBF24" />

        {/* Head Spots */}
        <ellipse cx="78" cy="70" rx="6" ry="5" fill="#D97706" />
        <ellipse cx="122" cy="70" rx="5" ry="6" fill="#D97706" />

        {/* Giraffe Snout / Muzzle */}
        <ellipse cx="100" cy="106" rx="28" ry="20" fill="#FDE68A" />

        {/* Nostrils */}
        <ellipse cx="92" cy="104" rx="2.5" ry="3.5" fill="#92400E" />
        <ellipse cx="108" cy="104" rx="2.5" ry="3.5" fill="#92400E" />

        {/* Cheeks (Blushing pink) */}
        <circle cx="76" cy="98" r="7" fill="#F87171" fillOpacity="0.45" />
        <circle cx="124" cy="98" r="7" fill="#F87171" fillOpacity="0.45" />

        {/* Eyes & Expressions according to mood */}
        {mood === 'happy' && (
          <>
            {/* Curved smiling eye arches */}
            <path
              d="M82 82 Q88 74 94 82"
              stroke="#78350F"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M106 82 Q112 74 118 82"
              stroke="#78350F"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cheerful smiling mouth */}
            <path
              d="M93 113 Q100 121 107 113"
              stroke="#78350F"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {mood === 'listening' && (
          <>
            {/* Attentive round open eyes */}
            <circle cx="88" cy="80" r="5.5" fill="#78350F" />
            <circle cx="89.5" cy="78.5" r="2" fill="#FFFFFF" />
            <circle cx="112" cy="80" r="5.5" fill="#78350F" />
            <circle cx="113.5" cy="78.5" r="2" fill="#FFFFFF" />
            {/* Gentle attentive mouth */}
            <path
              d="M95 113 Q100 117 105 113"
              stroke="#78350F"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Sound/listening sparkle */}
            <path
              d="M48 68 Q43 75 48 82"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M152 68 Q157 75 152 82"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {mood === 'thinking' && (
          <>
            {/* Thoughtful eyes looking slightly up */}
            <circle cx="87" cy="78" r="5" fill="#78350F" />
            <circle cx="88.5" cy="76.5" r="1.8" fill="#FFFFFF" />
            <circle cx="113" cy="78" r="5" fill="#78350F" />
            <circle cx="114.5" cy="76.5" r="1.8" fill="#FFFFFF" />
            {/* Curious little 'o' mouth */}
            <ellipse cx="100" cy="114" rx="3.5" ry="4.5" fill="#78350F" />
            {/* Thought bubble icon */}
            <circle cx="138" cy="46" r="3" fill="#F59E0B" />
            <circle cx="145" cy="38" r="5" fill="#F59E0B" />
          </>
        )}

        {mood === 'celebrate' && (
          <>
            {/* Joyful wink/sparkle eyes */}
            <path
              d="M81 83 Q88 74 95 83"
              stroke="#78350F"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="113" cy="80" r="5" fill="#78350F" />
            <circle cx="114.5" cy="78.5" r="1.8" fill="#FFFFFF" />
            {/* Open happy open mouth */}
            <path
              d="M92 111 Q100 123 108 111 Z"
              fill="#EF4444"
              stroke="#78350F"
              strokeWidth="2"
            />
            {/* Heart above head */}
            <path
              d="M100 24 C100 24 96 18 90 20 C83 23 83 31 100 40 C117 31 117 23 110 20 C104 18 100 24 100 24 Z"
              fill="#EF4444"
            />
          </>
        )}

        {mood === 'caring' && (
          <>
            {/* Gentle, loving, comforting eyes */}
            <path
              d="M83 80 Q88 76 93 80"
              stroke="#78350F"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M107 80 Q112 76 117 80"
              stroke="#78350F"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M95 113 Q100 118 105 113"
              stroke="#78350F"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Heart symbol on chest */}
            <path
              d="M100 152 C100 152 94 144 87 147 C80 151 80 160 100 170 C120 160 120 151 113 147 C106 144 100 152 100 152 Z"
              fill="#F43F5E"
            />
          </>
        )}
      </svg>
    </div>
  );
};
