import { useState, useEffect } from 'react';

export default function Confetti() {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const colors = ['#FFD700', '#FF00FF', '#00FF41', '#FFFFFF', '#00FFFF'];
        const newParticles = [];

        for (let i = 0; i < 50; i++) {
            newParticles.push({
                id: i,
                x: 50, // Start from center
                y: 50,
                color: colors[Math.floor(Math.random() * colors.length)],
                angle: Math.random() * 360,
                velocity: 5 + Math.random() * 10,
                size: 4 + Math.random() * 6,
                rotation: Math.random() * 360,
                rotationSpeed: -10 + Math.random() * 20
            });
        }
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {particles.map((p, i) => (
                <div
                    key={p.id}
                    className="absolute rounded-sm"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        transform: `rotate(${p.rotation}deg)`,
                        animation: `confetti-explode-${i % 3} 1s ease-out forwards` // Using 3 variations
                    }}
                >
                    <style>{`
                        @keyframes confetti-explode-${i % 3} {
                            0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
                            100% { 
                                transform: translate(${Math.cos(p.angle * Math.PI / 180) * 500}px, ${Math.sin(p.angle * Math.PI / 180) * 500}px) rotate(${p.rotation + 720}deg); 
                                opacity: 0;
                            }
                        }
                    `}</style>
                </div>
            ))}
        </div>
    );
}
