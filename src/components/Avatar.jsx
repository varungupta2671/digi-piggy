import { usePiggy } from '../context/PiggyContext';
import { getCharacterById } from '../data/characters';
import { getItemById } from '../data/items';
import { cn } from '../utils/cn';

export default function Avatar({ className, showItems = true, size = 'md' }) {
    const { avatarConfig } = usePiggy();
    const character = getCharacterById(avatarConfig?.characterId);

    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-32 h-32',
        lg: 'w-48 h-48',
        xl: 'w-64 h-64'
    };

    // SVG Item Definitions
    const items = {
        // HEAD
        hat_cowboy: (
            <g transform="translate(100, 30)">
                <path d="M-60 15 Q-60 0 0 0 Q60 0 60 15 L60 25 Q0 35 -60 25 Z" fill="#78350f" />
                <path d="M-35 15 L-35 -15 Q-35 -30 0 -30 Q35 -30 35 -15 L35 15 Z" fill="#92400e" stroke="#451a03" strokeWidth="2" />
                <rect x="-35" y="0" width="70" height="5" fill="#451a03" />
            </g>
        ),
        crown_gold: (
            <g transform="translate(100, 35)">
                <path d="M-40 0 L-50 -30 L-25 -15 L0 -40 L25 -15 L50 -30 L40 0 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                <circle cx="0" cy="-40" r="4" fill="#ef4444" />
                <circle cx="-50" cy="-30" r="3" fill="#3b82f6" />
                <circle cx="50" cy="-30" r="3" fill="#3b82f6" />
                <rect x="-40" y="0" width="80" height="8" fill="#d97706" opacity="0.5" />
            </g>
        ),
        cap_blue: (
            <g transform="translate(100, 45)">
                <path d="M-40 0 Q-40 -35 0 -35 Q40 -35 40 0 Z" fill="#2563eb" />
                <path d="M-40 0 L-65 10 Q-30 20 40 0 Z" fill="#1d4ed8" />
                <circle cx="0" cy="-35" r="3" fill="#1e40af" />
            </g>
        ),
        hat_party: (
            <g transform="translate(100, 40)">
                <path d="M-30 0 L0 -60 L30 0 Z" fill="#ec4899" stroke="#be185d" strokeWidth="2" />
                <circle cx="0" cy="-65" r="8" fill="white" className="animate-pulse" />
                <circle cx="-10" cy="-20" r="3" fill="white" />
                <circle cx="10" cy="-35" r="3" fill="#fbcfe8" />
                <circle cx="0" cy="-10" r="3" fill="#fce7f3" />
            </g>
        ),

        // EYES
        glasses_sun: (
            <g transform="translate(100, 95)">
                <rect x="-65" y="-15" width="55" height="30" rx="10" fill="#0f172a" />
                <rect x="10" y="-15" width="55" height="30" rx="10" fill="#0f172a" />
                <path d="M-10 0 L10 0" stroke="#0f172a" strokeWidth="6" />
                <path d="M-65 -5 Q-75 -5 -80 -20" fill="none" stroke="#0f172a" strokeWidth="4" />
                <path d="M65 -5 Q75 -5 80 -20" fill="none" stroke="#0f172a" strokeWidth="4" />
                <rect x="-55" y="-10" width="20" height="5" rx="2" fill="white" opacity="0.2" />
            </g>
        ),
        glasses_nerd: (
            <g transform="translate(100, 95)">
                <rect x="-60" y="-18" width="50" height="36" rx="4" fill="none" stroke="#334155" strokeWidth="6" />
                <rect x="10" y="-18" width="50" height="36" rx="4" fill="none" stroke="#334155" strokeWidth="6" />
                <path d="M-10 0 L10 0" stroke="#334155" strokeWidth="4" />
            </g>
        ),
        monocle: (
            <g transform="translate(128, 90)">
                <circle r="18" fill="none" stroke="#d97706" strokeWidth="4" />
                <circle r="15" fill="#3b82f6" opacity="0.2" />
                <path d="M18 0 L35 40" stroke="#451a03" strokeWidth="2" fill="none" />
            </g>
        ),

        // BODY
        tie_bow: (
            <g transform="translate(100, 155)">
                <circle r="6" fill="#ef4444" />
                <path d="M-5 -5 L-25 -15 L-25 15 L-5 5 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
                <path d="M5 -5 L25 -15 L25 15 L5 5 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
            </g>
        ),
        scarf_winter: (
            <g transform="translate(100, 150)">
                <rect x="-50" y="-5" width="100" height="20" rx="10" fill="#2563eb" stroke="#1e40af" strokeWidth="2" />
                <path d="M30 15 L30 50" stroke="#1d4ed8" strokeWidth="15" strokeCap="round" />
                <line x1="25" y1="45" x2="35" y2="45" stroke="white" strokeWidth="2" />
            </g>
        ),
        cape_hero: (
            <g transform="translate(100, 120)">
                <path d="M-60 20 Q-100 100 0 110 Q100 100 60 20 Z" fill="#dc2626" className="animate-pulse" />
                <path d="M-60 20 L-80 0 L80 0 L60 20" fill="#b91c1c" />
            </g>
        ),

        // HAND
        wand_magic: (
            <g transform="translate(160, 160) rotate(15)">
                <rect x="-2" y="0" width="4" height="60" rx="2" fill="#451a03" />
                <rect x="-2" y="0" width="4" height="15" rx="2" fill="white" />
                <path d="M0 -15 L3 -5 L12 -5 L5 2 L8 12 L0 5 L-8 12 L-5 2 L-12 -5 L-3 -5 Z" fill="#fbbf24" transform="translate(0, -10) scale(0.8)" />
            </g>
        ),
        bag_money: (
            <g transform="translate(165, 170)">
                <path d="M-20 20 Q-30 0 -15 -10 Q-5 -15 0 -10 Q5 -15 15 -10 Q30 0 20 20 Z" fill="#d6d3d1" stroke="#78716c" strokeWidth="2" />
                <circle cx="0" cy="-5" r="5" fill="#57534e" />
                <text x="0" y="12" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#15803d" style={{ fontFamily: 'serif' }}>$</text>
            </g>
        ),
        diamond: (
            <g transform="translate(170, 165)">
                <path d="M-15 0 L0 -15 L15 0 L0 20 Z" fill="#60a5fa" stroke="#2563eb" strokeWidth="2" />
                <path d="M-15 0 L15 0 M0 -15 L0 20" stroke="white" opacity="0.4" />
                <circle cx="-5" cy="-5" r="2" fill="white" className="animate-pulse" />
            </g>
        )
    };

    // Helper to render an item if it exists
    const renderItem = (slot) => {
        if (!showItems || !avatarConfig?.equipped?.[slot]) return null;
        const itemId = avatarConfig.equipped[slot];
        if (!items[itemId]) return null;

        // Custom layering for Hero Cape (Back) handled in SVG structure
        if (slot === 'BODY' && itemId === 'cape_hero') return null;

        return (
            <g className="transition-all duration-500">
                {items[itemId]}
            </g>
        );
    };

    // Piggy SVG Construction
    // Responsive to baseColor
    return (
        <div className={cn("relative flex items-center justify-center group perspective-1000", sizeClasses[size], className)}>

            {/* Dynamic Shadow */}
            <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-6 bg-black/20 dark:bg-black/40 blur-xl rounded-[100%] transition-all duration-500 group-hover:w-3/4 group-hover:opacity-70 group-hover:blur-2xl"
                style={{ zIndex: 0 }}
            />

            {/* Base Piggy Container with 3D tilt */}
            <div className="relative w-full h-full transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) group-hover:rotate-x-6 group-hover:rotate-y-12 group-hover:-translate-y-4 group-hover:scale-110">

                {/* Piggy Body SVG */}
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl overflow-visible" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id={`grad-body-${character.id}`} cx="40%" cy="40%" r="50%" fx="30%" fy="30%">
                            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                            <stop offset="100%" stopColor={character.baseColor} stopOpacity="0" />
                        </radialGradient>

                        <radialGradient id={`grad-depth-${character.id}`} cx="50%" cy="50%" r="50%">
                            <stop offset="60%" stopColor={character.baseColor} />
                            <stop offset="100%" stopColor={character.accentColor} />
                        </radialGradient>

                        <filter id="inner-shadow">
                            <feOffset dx="0" dy="4" />
                            <feGaussianBlur stdDeviation="4" result="offset-blur" />
                            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                            <feFlood floodColor="black" floodOpacity="0.2" result="color" />
                            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                        </filter>
                    </defs>

                    {/* BACK LAYERED ITEMS */}
                    {avatarConfig?.equipped?.BODY === 'cape_hero' && items.cape_hero}

                    {/* Ears */}
                    <path
                        d="M40 50 L60 20 L90 50 Z"
                        fill={character.baseColor}
                        stroke={character.accentColor}
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M160 50 L140 20 L110 50 Z"
                        fill={character.baseColor}
                        stroke={character.accentColor}
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    {/* Head/Body Base */}
                    <circle
                        cx="100"
                        cy="110"
                        r="80"
                        fill={`url(#grad-depth-${character.id})`}
                        stroke={character.accentColor}
                        strokeWidth="2"
                    />

                    {/* 3D Highlight/Shine Overlay */}
                    <circle
                        cx="100"
                        cy="110"
                        r="80"
                        fill={`url(#grad-body-${character.id})`}
                        pointerEvents="none"
                    />

                    {/* Snout */}
                    <ellipse
                        cx="100"
                        cy="125"
                        rx="35"
                        ry="25"
                        fill={character.accentColor}
                        className="opacity-90"
                    />
                    <circle cx="88" cy="125" r="4" fill="#333" className="opacity-40" />
                    <circle cx="112" cy="125" r="4" fill="#333" className="opacity-40" />

                    {/* Eyes (if no glasses) */}
                    {!avatarConfig?.equipped?.EYES && (
                        <g className="transition-all duration-300">
                            {/* Eye Sockets */}
                            <circle cx="72" cy="90" r="10" fill="white" className="opacity-20" />
                            <circle cx="128" cy="90" r="10" fill="white" className="opacity-20" />

                            {/* Pupils */}
                            <circle cx="75" cy="90" r="7" fill="#1e293b" />
                            <circle cx="125" cy="90" r="7" fill="#1e293b" />

                            {/* Shine */}
                            <circle cx="78" cy="87" r="3" fill="white" />
                            <circle cx="128" cy="87" r="3" fill="white" />
                        </g>
                    )}

                    {/* Feet */}
                    <path d="M55 175 Q60 200 75 195 L85 180" fill={character.accentColor} />
                    <path d="M145 175 Q140 200 125 195 L115 180" fill={character.accentColor} />

                    {/* ITEM OVERLAYS */}
                    {renderItem('BODY')}
                    {renderItem('EYES')}
                    {renderItem('HEAD')}
                    {renderItem('HAND')}
                </svg>
            </div>
        </div>
    );
}
