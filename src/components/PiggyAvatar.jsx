import React, { useEffect, useState } from 'react';
import { usePiggy } from '../context/PiggyContext';
import { cn } from '../utils/cn';

export default function PiggyAvatar({ className }) {
    const { piggyMood } = usePiggy();
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (piggyMood === 'happy') {
            setAnimationClass('animate-bounce');
        } else if (piggyMood === 'excited') {
            setAnimationClass('animate-bounce duration-75'); // Faster bounce
        } else {
            setAnimationClass('');
        }
    }, [piggyMood]);

    const handleClick = () => {
        setAnimationClass('animate-wiggle');
        setTimeout(() => setAnimationClass(''), 500);
    };

    return (
        <div
            className={cn("relative cursor-pointer transition-transform hover:scale-105", animationClass, className)}
            onClick={handleClick}
            role="img"
            aria-label={`Piggy bank is feeling ${piggyMood}`}
        >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
                {/* Body */}
                <ellipse cx="100" cy="110" rx="70" ry="60" fill="#a78bfa" stroke="#5b21b6" strokeWidth="4" />

                {/* Legs */}
                <path d="M60 150 L60 170 L80 170 L80 155" fill="#a78bfa" stroke="#5b21b6" strokeWidth="4" />
                <path d="M120 155 L120 170 L140 170 L140 150" fill="#a78bfa" stroke="#5b21b6" strokeWidth="4" />

                {/* Ears */}
                <path d="M60 70 L50 40 L80 60" fill="#c4b5fd" stroke="#5b21b6" strokeWidth="4" />
                <path d="M140 70 L150 40 L120 60" fill="#c4b5fd" stroke="#5b21b6" strokeWidth="4" />

                {/* Snout */}
                <ellipse cx="100" cy="110" rx="20" ry="15" fill="#c4b5fd" stroke="#5b21b6" strokeWidth="3" />
                <circle cx="94" cy="110" r="3" fill="#5b21b6" />
                <circle cx="106" cy="110" r="3" fill="#5b21b6" />

                {/* Eyes - Dynamic based on mood */}
                {piggyMood === 'neutral' && (
                    <>
                        <circle cx="75" cy="90" r="5" fill="#1e1b4b" />
                        <circle cx="125" cy="90" r="5" fill="#1e1b4b" />
                        {/* Blush */}
                        <circle cx="60" cy="110" r="6" fill="#f472b6" opacity="0.4" />
                        <circle cx="140" cy="110" r="6" fill="#f472b6" opacity="0.4" />
                    </>
                )}

                {piggyMood === 'happy' && (
                    <>
                        {/* Happy Eyes (Arches) */}
                        <path d="M70 90 Q75 85 80 90" fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
                        <path d="M120 90 Q125 85 130 90" fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
                        {/* Mouth */}
                        <path d="M90 130 Q100 135 110 130" fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
                        {/* Blush */}
                        <circle cx="60" cy="110" r="8" fill="#ec4899" opacity="0.6" />
                        <circle cx="140" cy="110" r="8" fill="#ec4899" opacity="0.6" />
                    </>
                )}

                {piggyMood === 'excited' && (
                    <>
                        {/* Star Eyes */}
                        <path d="M72 90 L75 82 L78 90 L86 90 L79 96 L82 104 L75 99 L68 104 L71 96 L64 90 Z" fill="#fbbf24" />
                        <path d="M122 90 L125 82 L128 90 L136 90 L129 96 L132 104 L125 99 L118 104 L121 96 L114 90 Z" fill="#fbbf24" />
                        {/* Mouth Open */}
                        <ellipse cx="100" cy="130" rx="10" ry="8" fill="#be185d" />
                        {/* Blush */}
                        <circle cx="60" cy="110" r="10" fill="#ec4899" opacity="0.7" />
                        <circle cx="140" cy="110" r="10" fill="#ec4899" opacity="0.7" />
                    </>
                )}

                {/* Coin Slot */}
                <rect x="85" y="55" width="30" height="6" rx="3" fill="#4c1d95" />

                {/* Coin (only visible when happy/excited or animating) */}
                {(piggyMood === 'happy' || piggyMood === 'excited') && (
                    <circle cx="100" cy="40" r="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2" className="animate-ping" />
                )}
            </svg>
        </div>
    );
}
