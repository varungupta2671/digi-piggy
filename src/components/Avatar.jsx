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

    // Helper to render an item if it exists
    const renderItem = (slot) => {
        if (!showItems || !avatarConfig?.equipped?.[slot]) return null;
        const itemId = avatarConfig.equipped[slot];
        const item = getItemById(itemId);
        if (!item) return null;

        // Positioning logic based on slot
        // Ideally this would use SVGs that overlay perfectly.
        // For now, we will use absolute positioning with emojis/icons to demonstrate.

        let positionClass = '';
        if (slot === 'HEAD') positionClass = '-top-4 left-1/2 -translate-x-1/2 text-4xl';
        if (slot === 'EYES') positionClass = 'top-8 left-1/2 -translate-x-1/2 text-3xl z-20';
        if (slot === 'BODY') positionClass = 'bottom-0 left-1/2 -translate-x-1/2 text-4xl z-10';
        if (slot === 'HAND') positionClass = 'bottom-4 -right-4 text-3xl rotate-12';

        return (
            <div className={cn("absolute select-none pointer-events-none filter drop-shadow-md", positionClass)}>
                {item.icon}
            </div>
        );
    };

    // Piggy SVG Construction
    // Responsive to baseColor
    return (
        <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>

            {/* Base Piggy Container */}
            <div className="relative w-full h-full transition-transform hover:scale-105 duration-300">
                {/* HEAD ITEMS */}
                {renderItem('HEAD')}

                {/* Piggy Body SVG */}
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
                    {/* Ears */}
                    <path d="M40 50 L60 20 L90 50 Z" fill={character.baseColor} stroke={character.accentColor} strokeWidth="4" />
                    <path d="M160 50 L140 20 L110 50 Z" fill={character.baseColor} stroke={character.accentColor} strokeWidth="4" />

                    {/* Head/Body */}
                    <circle cx="100" cy="110" r="80" fill={character.baseColor} stroke={character.accentColor} strokeWidth="4" />

                    {/* Snout */}
                    <ellipse cx="100" cy="120" rx="30" ry="20" fill={character.accentColor} opacity="0.8" />
                    <circle cx="90" cy="120" r="5" fill="#333" opacity="0.6" />
                    <circle cx="110" cy="120" r="5" fill="#333" opacity="0.6" />

                    {/* Eyes (if no glasses) */}
                    {!avatarConfig?.equipped?.EYES && (
                        <>
                            <circle cx="75" cy="90" r="8" fill="#333" />
                            <circle cx="125" cy="90" r="8" fill="#333" />
                            <circle cx="78" cy="88" r="3" fill="white" />
                            <circle cx="128" cy="88" r="3" fill="white" />
                        </>
                    )}

                    {/* Feet */}
                    <path d="M60 180 L60 200 L80 200 L80 185 Z" fill={character.accentColor} />
                    <path d="M120 180 L120 200 L140 200 L140 185 Z" fill={character.accentColor} />
                </svg>

                {/* OTHER ITEMS Overlay */}
                {renderItem('EYES')}
                {renderItem('BODY')}
                {renderItem('HAND')}
            </div>
        </div>
    );
}
