/**
 * Curse Constants - Enemy data, drops, and battle configuration
 */

// =============================================================================
// ENEMY DATA (Scaled from Treasure Guardian baseline: 115 HP, 18 ATK, 8 DEF)
// =============================================================================

export const CURSE_ENEMY_DATA = {
    // Battle 1: Curse Shades (1v2 SOLO) - Target 18 total (9 each)
    'curse_shade': {
        name: "Curse Shade",
        hp: 55,
        attack: 20,      // 20 - 11 DEF = 9 damage each (18 total)
        defense: 4,
        xp: 50,
        gold: 20,
        isBoss: false
    },

    // Battle 2: Rescue Companion (1v1 SOLO) - Target 20 total
    'curse_captor': {
        name: "Curse Captor",
        hp: 110,
        attack: 31,      // 31 - 11 DEF = 20 damage
        defense: 5,
        xp: 120,
        gold: 40,
        isBoss: false
    },

    // Battle 3: Fork A (2v2) - Total 160 HP, 46 ATK
    'void_crawler': {
        name: "Void Crawler",
        hp: 70,
        attack: 21,
        defense: 5,
        xp: 70,
        gold: 30,
        isBoss: false
    },
    'shadow_stalker': {
        name: "Shadow Stalker",
        hp: 90,
        attack: 25,
        defense: 5,
        xp: 70,
        gold: 30,
        isBoss: false
    },

    // Battle 4: Fork B-1 (2v2) - Total 170 HP, 48 ATK
    'corrupted_miner': {
        name: "Corrupted Miner",
        hp: 75,
        attack: 22,
        defense: 6,
        xp: 80,
        gold: 35,
        isBoss: false
    },
    'void_spitter': {
        name: "Void Spitter",
        hp: 95,
        attack: 26,
        defense: 6,
        xp: 80,
        gold: 35,
        isBoss: false
    },

    // Battle 5: Fork B-2 (2v1 Big Monster) - Boss with crits
    'depth_horror': {
        name: "Depth Horror",
        hp: 180,
        attack: 38,
        defense: 7,
        xp: 200,
        gold: 60,
        isBoss: true
    },

    // Battle 6: Final Fork 1 (2v3 Swarm) - Target 28 total (~9 each)
    'curse_spawn': {
        name: "Curse Spawn",
        hp: 55,
        attack: 22,      // 22 - 13 DEF = 9 damage each (27 total)
        defense: 4,
        xp: 60,
        gold: 20,
        isBoss: false
    },

    // Battle 7: Final Fork 2 (2v2 Elite) - Total 190 HP, 56 ATK
    'void_knight': {
        name: "Void Knight",
        hp: 85,
        attack: 26,
        defense: 7,
        xp: 90,
        gold: 45,
        isBoss: false
    },
    'cursed_sentinel': {
        name: "Cursed Sentinel",
        hp: 105,
        attack: 30,
        defense: 7,
        xp: 90,
        gold: 45,
        isBoss: false
    },

    // Battle 8: Final Fork Boss (2v1 + 1 minion) - Total 210 HP, 28 damage vs 15 DEF
    'path_boss': {
        name: "Serpent Lord",
        hp: 150,
        attack: 31,      // 31 - 15 DEF = 16 damage
        defense: 9,
        xp: 250,
        gold: 100,
        isBoss: true     // 25% crit chance
    },
    'serpent_minion': {
        name: "Serpent Guard",
        hp: 60,
        attack: 27,      // 27 - 15 DEF = 12 damage
        defense: 4,
        xp: 40,
        gold: 15,
        isBoss: false    // No crits
    },

    // Battle 9: Cursed King (2v1 - LAST with companion) - Target 34 total
    'cursed_king': {
        name: "The Cursed King",
        hp: 200,
        attack: 47,      // 47 - 13 DEF = 34 damage
        defense: 8,
        xp: 300,
        gold: 150,
        isBoss: true
    },

    // Battle 10: Wraith Self (1v1 SOLO)
    'wraith_self': {
        name: "Your Wraith Self",
        hp: 220,
        attack: 50,
        defense: 8,
        xp: 350,
        gold: 0,
        isBoss: true
    },

    // Battle 11: Malachar (1v1 SOLO - Final Boss) - Target 38 total
    'malachar': {
        name: "Malachar, The Demon King",
        hp: 250,
        attack: 52,      // 52 - 14 DEF = 38 damage
        defense: 12,
        xp: 500,
        gold: 0,
        isBoss: true
    }
};

// =============================================================================
// NEW WEAPONS (Part 2 drops)
// =============================================================================

export const CURSE_WEAPONS = {
    'curse_reaver': {
        name: "Curse Reaver",
        damage: 16,
        description: "A blade forged to cut through cursed flesh."
    },
    'shadows_edge': {
        name: "Shadow's Edge",
        damage: 18,
        description: "Darkness made steel. Strikes true against corruption."
    },
    'soul_render': {
        name: "Soul Render",
        damage: 20,
        description: "Torn from your wraith self. The ultimate curse-slayer."
    }
};

// =============================================================================
// NEW SHIELDS (Part 2 drops)
// =============================================================================

export const CURSE_SHIELDS = {
    'void_touched_shield': {
        name: "Void-Touched Shield",
        defense: 6,
        description: "Absorbs curse energy to protect the bearer."
    },
    'wardens_barrier': {
        name: "Warden's Barrier",
        defense: 7,
        description: "Carried by the guardians of the deep."
    },
    'celestial_shield': {
        name: "Celestial Shield",
        defense: 8,
        description: "Blessed by divine light. Maximum protection."
    }
};

// =============================================================================
// NEW SPELLS (Level 5, 6, 7)
// =============================================================================

export const CURSE_SPELLS = {
    'void_bolt': {
        name: "Void Bolt",
        damage: 15,
        isAoE: false,
        description: "A concentrated blast of void energy."
    },
    'chain_lightning': {
        name: "Chain Lightning",
        damage: 10,
        isAoE: true,
        description: "Lightning arcs between all enemies."
    },
    'cursed_wave': {
        name: "Cursed Wave",
        damage: 12,
        isAoE: true,
        description: "A wave of cursed energy hits all foes."
    }
};

// =============================================================================
// BATTLE SEQUENCE (11 battles with solo/companion transitions)
// =============================================================================

export const BATTLE_SEQUENCE = [
    // === SOLO BATTLES (No Companion) ===
    {
        name: "Curse Shades",
        description: "The curse manifests as shadows that attack!",
        enemies: ['curse_shade', 'curse_shade'],
        isBoss: false,
        isSolo: true,
        sprite: '../assets/sprites/Kings Curse/enemies/curse_shades.webp',
        battleSprite: '../assets/sprites/Kings Curse/enemies/curse_shades_battle.webp',
        drops: { potion: 'health' }
    },
    {
        name: "Rescue the Prisoner",
        description: "A figure is held captive by a curse-touched creature.",
        enemies: ['curse_captor'],
        isBoss: false,
        isSolo: true,
        sprite: '../assets/sprites/Kings Curse/enemies/curse_captor.webp',
        drops: { potion: 'health', shield: 'void_touched_shield' }
    },

    // === WITH COMPANION ===
    {
        name: "Into the Depths",
        description: "Together, you descend into the cursed realm.",
        enemies: ['void_crawler', 'shadow_stalker'],
        isBoss: false,
        isSolo: false,
        sprite: '../assets/sprites/Kings Curse/enemies/void_crawler_shadow_stalker.webp',
        drops: { potion: 'health', weapon: 'curse_reaver' }
    },
    {
        name: "Corrupted Passage",
        description: "The curse has twisted these creatures beyond recognition.",
        enemies: ['corrupted_miner', 'void_spitter'],
        isBoss: false,
        isSolo: false,
        sprite: '../assets/sprites/Kings Curse/enemies/corrupted_miner_void_spitter.webp',
        drops: { potion: 'health', item: 'strength_elixir' }
    },
    {
        name: "The Depth Horror",
        description: "A massive creature blocks your path!",
        enemies: ['depth_horror'],
        isBoss: false,
        isSolo: false,
        sprite: '../assets/sprites/Kings Curse/enemies/depth_horror.webp',
        drops: { potion: 'health', shield: 'wardens_barrier' }
    },
    {
        name: "Curse Swarm",
        description: "Smaller creatures attack in numbers!",
        enemies: ['curse_spawn', 'curse_spawn', 'curse_spawn'],
        isBoss: false,
        isSolo: false,
        sprite: '../assets/sprites/Kings Curse/enemies/curse_spawn_swarm.webp',
        drops: { potion: 'health', item: 'defense_potion' }
    },
    {
        name: "Elite Guard",
        description: "The path's guardians stand before you.",
        enemies: ['void_knight', 'cursed_sentinel'],
        isBoss: false,
        isSolo: false,
        sprite: '../assets/sprites/Kings Curse/enemies/void_knight_cursed_sentinel.webp',
        drops: { potion: 'health' }
    },
    {
        name: "The Serpent Lord",
        description: "The path boss guards the way forward!",
        enemies: ['path_boss', 'serpent_minion'],
        isBoss: true,
        isSolo: false,
        sprite: '../assets/sprites/Kings Curse/enemies/serpent_lord.webp',
        drops: { potion: 'superior', weapon: 'shadows_edge' }
    },
    {
        name: "The Cursed King",
        description: "The first victim of the curse begs for release.",
        enemies: ['cursed_king'],
        isBoss: true,
        isSolo: false,  // LAST battle with companion
        sprite: '../assets/sprites/Kings Curse/enemies/cursed_king.webp',
        drops: { potion: 'superior', shield: 'celestial_shield' }
    },

    // === SOLO AGAIN ("You must face this alone") ===
    {
        name: "Your Wraith Self",
        description: "You face what you could become. Your companion cannot follow.",
        enemies: ['wraith_self'],
        isBoss: true,
        isSolo: true,
        companionLeaves: true,  // Marks transition point
        sprite: '../assets/sprites/Kings Curse/enemies/wraith_self.webp',
        drops: { potion: 'superior', weapon: 'soul_render' }
    },
    {
        name: "Malachar, The Demon King",
        description: "The Demon King awaits.",
        enemies: ['malachar'],
        isBoss: true,
        isSolo: true,
        sprite: '../assets/sprites/Kings Curse/enemies/malachar.webp',
        drops: { potion: 'superior' }
    }
];

// =============================================================================
// CURSE CONFIGURATION
// =============================================================================

export const CURSE_CONFIG = {
    drainInterval: 3,      // Drain HP every 3 turns
    drainAmount: 10,       // Drain 10 HP per tick
    drainMessage: "The curse pulses through you..."
};
