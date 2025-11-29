/**
 * Game Constants - All game data centralized for easy balancing
 */

// =============================================================================
// ENEMY DATA
// =============================================================================
// Format: enemy_type -> { name, hp, attack, defense, xp, gold, isBoss, art }

export const ENEMY_DATA = {
    // Early Game (Player Level 1-2, HP 30-40) - Keep similar, balanced for new players
    skeleton_bandits: { name: "Skeleton Bandits", hp: 22, attack: 6, defense: 1, xp: 55, gold: 20, isBoss: false },
    wizard: { name: "Evil Wizard", hp: 28, attack: 8, defense: 0, xp: 65, gold: 25, isBoss: false },
    shark: { name: "Ferocious Shark", hp: 22, attack: 6, defense: 1, xp: 55, gold: 20, isBoss: false },
    lake_monster: { name: "Lake Monster", hp: 28, attack: 8, defense: 0, xp: 65, gold: 25, isBoss: false },

    // Castle guardians - Faced at Level 1
    bear_rider: { name: "Savage Bear Rider", hp: 32, attack: 8, defense: 2, xp: 70, gold: 28, isBoss: false },
    dragon_knight: { name: "Dragon Knight", hp: 38, attack: 10, defense: 3, xp: 80, gold: 32, isBoss: false },

    // Mid Game - Hidden Passages (Player Level 2-3) - MAJOR BUFFS to counter high defense
    stone_golem: { name: "Stone Golem", hp: 40, attack: 14, defense: 5, xp: 75, gold: 30, isBoss: false },
    giant_spider: { name: "Giant Spider", hp: 42, attack: 14, defense: 2, xp: 70, gold: 28, isBoss: false },
    ancient_guardian: { name: "Ancient Guardian", hp: 42, attack: 15, defense: 4, xp: 80, gold: 32, isBoss: false },
    cursed_mummy: { name: "Cursed Mummy", hp: 45, attack: 16, defense: 1, xp: 75, gold: 30, isBoss: false },

    // Convergence Paths (Player Level 3, HP 50-60)
    // Crystal Palace
    crystal_guardian: { name: "Crystal Guardian", hp: 45, attack: 14, defense: 3, xp: 85, gold: 35, isBoss: false },
    crystal_queen: { name: "Crystal Queen", hp: 55, attack: 18, defense: 4, xp: 95, gold: 42, isBoss: true },

    // Volcanic Forge
    fire_elemental: { name: "Fire Elemental", hp: 42, attack: 15, defense: 2, xp: 80, gold: 35, isBoss: false },
    forge_master: { name: "Forge Master", hp: 58, attack: 20, defense: 5, xp: 100, gold: 45, isBoss: true },

    // Sunken Ruins
    merfolk_warrior: { name: "Merfolk Warrior", hp: 44, attack: 14, defense: 3, xp: 85, gold: 35, isBoss: false },
    kraken: { name: "Kraken", hp: 60, attack: 22, defense: 4, xp: 105, gold: 48, isBoss: true },

    // Grand Finale (Player Level 4+, HP 60-70)
    // Phantom Citadel
    spectral_sentinel: { name: "Spectral Sentinel", hp: 48, attack: 17, defense: 4, xp: 90, gold: 40, isBoss: false },
    phantom_knight: { name: "Phantom Knight", hp: 55, attack: 19, defense: 5, xp: 100, gold: 45, isBoss: false },
    lord_of_echoes: { name: "Lord of Echoes", hp: 70, attack: 24, defense: 6, xp: 115, gold: 55, isBoss: true },

    // Clockwork Nexus
    automaton_soldier: { name: "Automaton Soldier", hp: 50, attack: 18, defense: 5, xp: 92, gold: 42, isBoss: false },
    clockmaker: { name: "The Clockmaker", hp: 58, attack: 20, defense: 5, xp: 105, gold: 48, isBoss: false },
    time_warden: { name: "Time Warden", hp: 72, attack: 26, defense: 7, xp: 120, gold: 58, isBoss: true },

    // Forgotten Coliseum
    gladiator_shade: { name: "Gladiator Shade", hp: 55, attack: 18, defense: 5, xp: 95, gold: 44, isBoss: false },
    arena_master: { name: "Arena Master", hp: 65, attack: 20, defense: 6, xp: 108, gold: 50, isBoss: false },
    eternal_champion: { name: "The Eternal Champion", hp: 75, attack: 28, defense: 8, xp: 125, gold: 62, isBoss: true },

    // Final Guardian (after Grand Finale bosses)
    treasures_guardian: { name: "The Treasure's Guardian", hp: 115, attack: 30, defense: 10, xp: 150, gold: 0, isBoss: true }
};

// =============================================================================
// WEAPON DATA
// =============================================================================
// Format: weapon_name -> damage

export const WEAPON_DAMAGE = {
    // Class starting weapons
    "Soldier's Blade": 3,   // Warrior (same as Rusty Sword)
    "Mystic Wand": 2,       // Mage
    "Twin Daggers": 4,      // Rogue

    // Starting and early game weapons
    "Rusty Sword": 3,
    "Iron Dagger": 5,
    "Bronze Mace": 6,
    "Steel Sword": 6,
    "Battle Axe": 7,
    "Knight's Blade": 7,
    "Enchanted Sword": 8,
    "Dragonslayer": 10,

    // Hidden Passages weapons
    "Stone Crusher": 7,
    "Venomfang Dagger": 8,
    "Guardian's Glaive": 9,
    "Pharaoh's Khopesh": 8,

    // Final path weapons
    "Crystal Shard": 8,
    "Crystal Blade": 11,
    "Ember Dagger": 9,
    "Magma Hammer": 12,
    "Coral Spear": 10,
    "Trident of the Depths": 13,

    // Shop weapons
    "Obsidian Blade": 12,
    "Dragonfire Bow": 13,
    "Fine Bow": 8,

    // Special item weapons
    "Echo Blade": 10,
    "Pendulum Blade": 11,
    "Legacy Blade": 15
};

// =============================================================================
// SHIELD DATA
// =============================================================================
// Format: shield_name -> defense

export const SHIELD_DEFENSE = {
    // Class starting shields
    "Infantry Shield": 1,   // Warrior (same as Wooden Buckler)
    "Leather Bracer": 0,    // Rogue (no defense, thematic)

    "Wooden Buckler": 1,
    "Wooden Shield": 2,
    "Steel Shield": 3,
    "Knight's Shield": 4,
    "Adamantine Shield": 5,
    "Ethereal Shield": 4,
    "Gear Shield": 3,
    "Gladiator's Shield": 4
};

// =============================================================================
// WEAPON DROPS
// =============================================================================
// Format: enemy_type -> weapon_name

export const WEAPON_DROPS = {
    skeleton_bandits: "Iron Dagger",
    wizard: "Knight's Blade",
    bear_rider: "Bronze Mace",
    dragon_knight: "Enchanted Sword",
    shark: "Steel Sword",
    lake_monster: "Dragonslayer",
    stone_golem: "Stone Crusher",
    giant_spider: "Venomfang Dagger",
    ancient_guardian: "Guardian's Glaive",
    cursed_mummy: "Pharaoh's Khopesh",
    crystal_guardian: "Crystal Shard",
    crystal_queen: "Crystal Blade",
    fire_elemental: "Ember Dagger",
    forge_master: "Magma Hammer",
    merfolk_warrior: "Coral Spear",
    kraken: "Trident of the Depths"
};

// =============================================================================
// SPECIAL ITEM DROPS
// =============================================================================
// Format: enemy_type -> { attr, name, description, effect }

export const SPECIAL_ITEM_DROPS = {
    shark: {
        attr: "hasSharkAmulet",
        name: "Shark Tooth Amulet",
        description: "This ancient amulet is made from the tooth of a legendary lake beast.",
        effect: "Doubles your damage for one battle!"
    },
    lake_monster: {
        attr: "hasLeviathanGauntlets",
        name: "Leviathan Scale Gauntlets",
        description: "These mystical gauntlets, forged from ancient lake beast scales, enhance your strength.",
        effect: "Permanently increases your damage by +4 with any weapon!"
    },
    spectral_sentinel: {
        attr: "hasGhostweaveCloak",
        name: "Ghostweave Cloak",
        description: "This shimmering cloak is woven from spectral energies.",
        effect: "Increases your critical hit chance by 15%!"
    },
    phantom_knight: {
        attr: "hasEtherealShield",
        name: "Ethereal Shield",
        description: "A shield that phases between realms, protecting you from harm.",
        effect: "Grants +3 HP regeneration at the start of each turn!",
        becomesShield: "Ethereal Shield"
    },
    lord_of_echoes: {
        attr: "hasEchoBlade",
        name: "Echo Blade",
        description: "This blade resonates with echoes of past battles.",
        effect: "20% chance to attack twice in one turn!",
        becomesWeapon: "Echo Blade"
    },
    automaton_soldier: {
        attr: "hasGearShield",
        name: "Gear Shield",
        description: "A mechanical shield with spinning gears.",
        effect: "20% chance to reflect damage back at attackers!",
        becomesShield: "Gear Shield"
    },
    clockmaker: {
        attr: "hasChronoPendant",
        name: "Chronometer Pendant",
        description: "A mystical timepiece that bends the flow of battle.",
        effect: "15% chance to take an extra turn!"
    },
    time_warden: {
        attr: "hasPendulumBlade",
        name: "Pendulum Blade",
        description: "A blade that swings with devastating precision.",
        effect: "Damage alternates between 120% and 80% with each hit!",
        becomesWeapon: "Pendulum Blade"
    },
    gladiator_shade: {
        attr: "hasChampionGauntlets",
        name: "Champion's Gauntlets",
        description: "Gauntlets worn by champions of ages past.",
        effect: "Increases all damage dealt by 15%!"
    },
    arena_master: {
        attr: "hasGladiatorShield",
        name: "Gladiator's Shield",
        description: "A battle-worn shield that inspires counterattacks.",
        effect: "25% chance to counter-attack when hit!",
        becomesShield: "Gladiator's Shield"
    },
    eternal_champion: {
        attr: "hasLegacyBlade",
        name: "Legacy Blade",
        description: "A legendary blade that grows stronger with each victory.",
        effect: "Gains +1 permanent damage for each enemy defeated while equipped!",
        becomesWeapon: "Legacy Blade"
    }
};

// =============================================================================
// XP REQUIREMENTS
// =============================================================================

export const XP_REQUIREMENTS = {
    1: 100,
    2: 150,
    3: 225,
    4: 300,
    5: 450,
    6: 675,
    7: 1012,
    8: 1518,
    9: 2277,
    10: 3416
};

export function getXpForLevel(level) {
    if (XP_REQUIREMENTS[level]) {
        return XP_REQUIREMENTS[level];
    }
    // For levels beyond 10, calculate using 1.5x multiplier
    return Math.floor(getXpForLevel(level - 1) * 1.5);
}

// =============================================================================
// SHOP DATA
// =============================================================================

export const SHOP_WEAPONS = {
    "Steel Sword": { price: 30, damage: 6 },
    "Battle Axe": { price: 45, damage: 7 },
    "Fine Bow": { price: 60, damage: 8 }
};

export const SHOP_SHIELDS = {
    "Wooden Shield": { price: 25, defense: 2 },
    "Steel Shield": { price: 40, defense: 3 },
    "Knight's Shield": { price: 55, defense: 4 }
};

export const SHOP_POTIONS = {
    "Health Potion": { price: 15, effect: "Restores 25 HP" },
    "Strength Elixir": { price: 20, effect: "+2 attack for one battle" },
    "Defense Potion": { price: 20, effect: "+2 defense for one battle" }
};

// Advanced shop items
export const ADVANCED_SHOP_WEAPONS = {
    "Obsidian Blade": { price: 100, damage: 12 },
    "Dragonfire Bow": { price: 115, damage: 13 }
};

export const ADVANCED_SHOP_SHIELDS = {
    "Adamantine Shield": { price: 65, defense: 5 }
};

export const ADVANCED_SHOP_POTIONS = {
    "Superior Health Potion": { price: 45, effect: "Restores 45 HP" },
    "Master's Strength Elixir": { price: 45, effect: "+5 attack for one battle" },
    "Ultimate Defense Potion": { price: 45, effect: "+5 defense for one battle" }
};

export const SHOP_SPELLS = {
    "Thunderbolt": { price: 70, description: "Call lightning (Attack + 15 damage)" },
    "Time Freeze": { price: 85, description: "Attack and enemy skips next turn" },
    "Soul Drain": { price: 80, description: "Deal 15 damage and heal same amount" }
};

// =============================================================================
// SPELL DATA
// =============================================================================

export const SPELLS = {
    // Mage-only starting spell
    "Mana Bolt": {
        unlockLevel: null,  // Mage class only, not level-unlocked
        type: "attack",
        damageBonus: 4,
        description: "A focused burst of arcane energy (Attack + 4 damage)"
    },
    "Arcane Blast": {
        unlockLevel: 2,
        type: "attack",
        damageBonus: 5,
        description: "A burst of arcane energy (Attack + 5 damage)"
    },
    "Energy Surge": {
        unlockLevel: 3,
        type: "heal",
        healAmount: "full",
        description: "Fully restores your HP"
    },
    "Astral Strike": {
        unlockLevel: 4,
        type: "attack",
        damageBonus: 10,
        description: "A devastating astral blow (Attack + 10 damage)"
    },
    "Thunderbolt": {
        unlockLevel: null,  // Shop only
        type: "attack",
        damageBonus: 15,
        description: "Calls down lightning (Attack + 15 damage)"
    },
    "Time Freeze": {
        unlockLevel: null,  // Shop only
        type: "attackAndFreeze",
        description: "Attack and enemy skips their next turn"
    },
    "Soul Drain": {
        unlockLevel: null,  // Shop only
        type: "damageAndHeal",
        damage: 15,
        healPercent: 100,
        description: "Deal 15 damage and heal for same amount"
    }
};

// =============================================================================
// LEVEL UP BONUSES
// =============================================================================

export const LEVEL_UP_BONUSES = {
    hp: 10,
    attack: 2,
    defense: 1
};

// =============================================================================
// SPRITE PATHS
// =============================================================================

export function getSpritePath(type, name) {
    // Convert name to filename format (lowercase, underscores)
    const filename = name.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_');
    return `assets/sprites/${type}/${filename}.webp`;
}

export function getEnemySprite(enemyType) {
    return `assets/sprites/enemies/${enemyType}.webp`;
}

export function getDefeatedEnemySprite(enemyType) {
    return `assets/sprites/enemies/${enemyType}_defeated.webp`;
}

export function getEnemyBattleSprite(enemyType) {
    return `assets/sprites/enemies/${enemyType}_battle.webp`;
}

export function getWeaponSprite(weaponName) {
    const filename = weaponName.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_');
    return `assets/sprites/weapons/${filename}.webp`;
}

export function getShieldSprite(shieldName) {
    const filename = shieldName.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_');
    return `assets/sprites/shields/${filename}.webp`;
}

export function getItemSprite(itemName) {
    const filename = itemName.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_');
    return `assets/sprites/items/${filename}.webp`;
}

export function getLocationSprite(locationName) {
    const filename = locationName.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_');
    return `assets/sprites/locations/${filename}.webp`;
}

export function getCharacterSprite(spriteName) {
    // spriteName can be 'gender_selection', 'male_warrior', 'female_mage', etc.
    return `assets/sprites/characters/${spriteName}.webp`;
}

// =============================================================================
// CHARACTER CLASSES
// =============================================================================

export const CHARACTER_CLASSES = {
    warrior: {
        name: "Warrior",
        description: "A battle-hardened soldier - the classic experience",
        hp: 30,
        attack: 5,
        defense: 2,
        weapon: "Soldier's Blade",
        shield: "Infantry Shield",
        passives: {},
        startingSpells: []
    },
    mage: {
        name: "Mage",
        description: "A wielder of arcane power with devastating spells",
        hp: 25,
        attack: 6,
        defense: 1,
        weapon: "Mystic Wand",
        shield: null,
        passives: { spellDamageBonus: 0.25 },
        startingSpells: ["Mana Bolt"]
    },
    rogue: {
        name: "Rogue",
        description: "A cunning fighter who strikes with deadly precision",
        hp: 28,
        attack: 5,
        defense: 1,
        weapon: "Twin Daggers",
        shield: "Leather Bracer",
        passives: { critChanceBonus: 0.15 },
        startingSpells: []
    }
};
