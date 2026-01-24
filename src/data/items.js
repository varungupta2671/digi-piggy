export const ITEMS = [
    // HEAD
    { id: 'hat_cowboy', name: 'Cowboy Hat', type: 'HEAD', icon: '🤠', rarity: 'common', description: 'Yeehaw! Savings!' },
    { id: 'crown_gold', name: 'Golden Crown', type: 'HEAD', icon: '👑', rarity: 'legendary', description: 'Fit for a savings king.' },
    { id: 'cap_blue', name: 'Blue Cap', type: 'HEAD', icon: '🧢', rarity: 'common', description: 'Casual savings vibe.' },
    { id: 'hat_party', name: 'Party Hat', type: 'HEAD', icon: '🎉', rarity: 'rare', description: 'Celebrate every deposit.' },

    // EYES
    { id: 'glasses_sun', name: 'Sunglasses', type: 'EYES', icon: '😎', rarity: 'rare', description: 'The future is bright.' },
    { id: 'glasses_nerd', name: 'Smart Glasses', type: 'EYES', icon: '👓', rarity: 'common', description: 'Calculated savings.' },
    { id: 'monocle', name: 'Monocle', type: 'EYES', icon: '🧐', rarity: 'epic', description: 'Classy.' },

    // BODY / HAND (Simplified to just 'ACCESSORY' for now or keep specific)
    { id: 'tie_bow', name: 'Bow Tie', type: 'BODY', icon: '🎀', rarity: 'common', description: 'Dressed to impress.' },
    { id: 'scarf_winter', name: 'Winter Scarf', type: 'BODY', icon: '🧣', rarity: 'rare', description: 'Warm and cozy.' },
    { id: 'cape_hero', name: 'Hero Cape', type: 'BODY', icon: '🦸', rarity: 'legendary', description: 'Super saver!' },

    // HAND
    { id: 'wand_magic', name: 'Magic Wand', type: 'HAND', icon: '🪄', rarity: 'epic', description: 'Multiply those funds.' },
    { id: 'bag_money', name: 'Money Bag', type: 'HAND', icon: '💰', rarity: 'rare', description: 'Secure the bag.' },
    { id: 'diamond', name: 'Diamond', type: 'HAND', icon: '💎', rarity: 'legendary', description: 'Diamond hands.' }
];

export const getItemById = (id) => ITEMS.find(i => i.id === id);

export const getRandomItem = () => ITEMS[Math.floor(Math.random() * ITEMS.length)];
