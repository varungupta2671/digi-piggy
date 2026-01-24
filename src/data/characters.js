export const CHARACTERS = [
    {
        id: 'classic',
        name: 'Classic Piggy',
        description: 'The original savings companion.',
        baseColor: '#fcb6c1', // Pink
        accentColor: '#f9a2b0'
    },
    {
        id: 'robo',
        name: 'Robo Pig',
        description: 'Advanced tech for advanced savings.',
        baseColor: '#94a3b8', // Slate 400
        accentColor: '#64748b' // Slate 500
    },
    {
        id: 'ninja',
        name: 'Ninja Pig',
        description: 'Silent saver, swift growth.',
        baseColor: '#1e293b', // Slate 800
        accentColor: '#0f172a' // Slate 900
    },
    {
        id: 'golden',
        name: 'Royal Pig',
        description: 'For those with exquisite taste.',
        baseColor: '#fbbf24', // Amber 400
        accentColor: '#f59e0b' // Amber 500
    }
];

export const getCharacterById = (id) => CHARACTERS.find(c => c.id === id) || CHARACTERS[0];
