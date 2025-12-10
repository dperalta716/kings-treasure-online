/**
 * Character - Player character class
 */
import { WEAPON_DAMAGE, SHIELD_DEFENSE, getXpForLevel, LEVEL_UP_BONUSES, SPELLS, CHARACTER_CLASSES } from './constants.js';

export class Character {
    constructor(name = "Hero") {
        this.name = name;
        this.level = 1;
        this.baseMaxHp = 30;
        this.maxHp = 30;
        this.hp = 30;
        this.attack = 5;
        this.defense = 2;
        this.xp = 0;
        this.gold = 0;

        // Character creation choices
        this.gender = null;           // 'male' or 'female'
        this.characterClass = null;   // 'warrior', 'mage', 'rogue'

        // Equipment
        this.weapon = "Rusty Sword";
        this.shield = "Wooden Buckler";

        // Inventory
        this.potions = 0;
        this.superiorPotions = 0;
        this.strengthElixirs = 0;
        this.defenseElixirs = 0;
        this.masterStrengthElixirs = 0;
        this.ultimateDefensePotions = 0;
        this.spells = [];
        this.usedSpells = [];

        // Temporary boosts (reset after battle)
        this.tempHpBoost = 0;
        this.tempAttackBoost = 0;
        this.tempDefenseBoost = 0;
        this.defending = false;

        // Charge-up defense mechanic
        this.charged = false;              // Next attack deals 2x damage
        this.chargeUsedThisBattle = false; // Can only charge once per battle

        // Special items (flags)
        this.hasLeviathanGauntlets = false;
        this.hasSharkAmulet = false;
        this.sharkAmuletUsed = false;
        this.hasGhostweaveCloak = false;
        this.hasEtherealShield = false;
        this.hasEchoBlade = false;
        this.hasGearShield = false;
        this.hasChronoPendant = false;
        this.hasPendulumBlade = false;
        this.hasChampionGauntlets = false;
        this.hasGladiatorShield = false;
        this.hasLegacyBlade = false;
        this.legacyBladeKills = 0;
        this.pendulumTurn = 0;

        // Combat tracking
        this.lastAction = null;
        this.lastDamage = 0;
        this.lastSpell = null;
        this.lastHealAmount = 0;
    }

    /**
     * Get weapon damage value
     */
    getWeaponDamage() {
        return WEAPON_DAMAGE[this.weapon] || 3;
    }

    /**
     * Get shield defense value
     */
    getShieldDefense() {
        return SHIELD_DEFENSE[this.shield] || 1;
    }

    /**
     * Initialize character with class-specific stats and equipment
     */
    initializeClass(gender, className) {
        const classData = CHARACTER_CLASSES[className];
        if (!classData) return;

        this.gender = gender;
        this.characterClass = className;

        // Set stats from class
        this.baseMaxHp = classData.hp;
        this.maxHp = classData.hp;
        this.hp = classData.hp;
        this.attack = classData.attack;
        this.defense = classData.defense;

        // Set starting equipment
        this.weapon = classData.weapon;
        this.shield = classData.shield;

        // Add starting spells (e.g., Mage gets Mana Bolt)
        if (classData.startingSpells && classData.startingSpells.length > 0) {
            this.spells = [...classData.startingSpells];
        }
    }

    /**
     * Get crit chance (base 20% + class bonus)
     */
    getCritChance() {
        let critChance = 0.20;
        const classData = CHARACTER_CLASSES[this.characterClass];
        if (classData && classData.passives.critChanceBonus) {
            critChance += classData.passives.critChanceBonus;
        }
        return critChance;
    }

    /**
     * Get spell damage bonus multiplier (0 for non-mages)
     */
    getSpellDamageBonus() {
        const classData = CHARACTER_CLASSES[this.characterClass];
        if (classData && classData.passives.spellDamageBonus) {
            return classData.passives.spellDamageBonus;
        }
        return 0;
    }

    /**
     * Get total defense (base + shield + temp boost)
     */
    getTotalDefense() {
        return this.defense + this.getShieldDefense() + this.tempDefenseBoost;
    }

    /**
     * Gain XP and check for level up
     */
    gainXp(amount) {
        this.xp += amount;
        return this.checkLevelUp();
    }

    /**
     * Check if character can level up
     * Returns array of level up info if leveled up
     */
    checkLevelUp() {
        const levelUps = [];
        let xpNeeded = getXpForLevel(this.level);

        while (this.xp >= xpNeeded) {
            this.level++;
            this.xp -= xpNeeded;

            // Store old values for display
            const oldMaxHp = this.baseMaxHp;

            // Apply bonuses (level 4+ gets +15 HP, others get +10)
            const hpGain = this.level >= 4 ? 15 : LEVEL_UP_BONUSES.hp;
            this.baseMaxHp += hpGain;
            this.maxHp = this.baseMaxHp + this.tempHpBoost;
            this.hp = this.maxHp;  // Full heal on level up
            this.attack += LEVEL_UP_BONUSES.attack;
            this.defense += LEVEL_UP_BONUSES.defense;

            const levelUpInfo = {
                newLevel: this.level,
                hpGain: hpGain,
                attackGain: LEVEL_UP_BONUSES.attack,
                defenseGain: LEVEL_UP_BONUSES.defense,
                newSpell: null
            };

            // Check for new spells
            if (this.level === 2) {
                this.spells.push("Arcane Blast");
                levelUpInfo.newSpell = SPELLS["Arcane Blast"];
                levelUpInfo.newSpell.name = "Arcane Blast";
            } else if (this.level === 3) {
                this.spells.push("Energy Surge");
                levelUpInfo.newSpell = SPELLS["Energy Surge"];
                levelUpInfo.newSpell.name = "Energy Surge";
            } else if (this.level === 4) {
                this.spells.push("Astral Strike");
                levelUpInfo.newSpell = SPELLS["Astral Strike"];
                levelUpInfo.newSpell.name = "Astral Strike";
            } else if (this.level === 5) {
                // Part 2 spells
                this.spells.push("Void Bolt");
                levelUpInfo.newSpell = SPELLS["Void Bolt"];
                levelUpInfo.newSpell.name = "Void Bolt";
            } else if (this.level === 6) {
                this.spells.push("Chain Lightning");
                levelUpInfo.newSpell = SPELLS["Chain Lightning"];
                levelUpInfo.newSpell.name = "Chain Lightning";
            } else if (this.level === 7) {
                this.spells.push("Cursed Wave");
                levelUpInfo.newSpell = SPELLS["Cursed Wave"];
                levelUpInfo.newSpell.name = "Cursed Wave";
            }

            levelUps.push(levelUpInfo);
            xpNeeded = getXpForLevel(this.level);
        }

        return levelUps;
    }

    /**
     * Use a health potion (heals 25 HP, not full)
     */
    usePotion() {
        if (this.potions <= 0) return false;

        this.potions--;
        const healAmount = Math.min(25, this.maxHp - this.hp);
        this.hp = Math.min(this.maxHp, this.hp + 25);
        return healAmount;
    }

    /**
     * Use a superior health potion (heals 45 HP)
     */
    useSuperiorPotion() {
        if (this.superiorPotions <= 0) return false;

        this.superiorPotions--;
        const healAmount = Math.min(45, this.maxHp - this.hp);
        this.hp = Math.min(this.maxHp, this.hp + 45);
        return healAmount;
    }

    /**
     * Take damage
     */
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        return this.hp <= 0;  // Returns true if dead
    }

    /**
     * Heal
     */
    heal(amount) {
        const actualHeal = Math.min(amount, this.maxHp - this.hp);
        this.hp += actualHeal;
        return actualHeal;
    }

    /**
     * Reset temporary effects after battle
     */
    resetTempEffects() {
        this.tempAttackBoost = 0;
        this.tempDefenseBoost = 0;
        this.defending = false;
        this.charged = false;
        this.chargeUsedThisBattle = false;
        this.usedSpells = [];
        this.sharkAmuletUsed = false;

        // Reset temporary HP boost
        if (this.tempHpBoost > 0) {
            this.maxHp = this.baseMaxHp;
            if (this.hp > this.maxHp) {
                this.hp = this.maxHp;
            }
            this.tempHpBoost = 0;
            return true;  // Indicate that temp HP was removed
        }
        return false;
    }

    /**
     * Get available spells (not yet used this battle)
     */
    getAvailableSpells() {
        return this.spells.filter(spell => !this.usedSpells.includes(spell));
    }

    /**
     * Check if character has any special items
     */
    getSpecialItems() {
        const items = [];
        if (this.hasLeviathanGauntlets) items.push("Leviathan Gauntlets (+4 dmg)");
        if (this.hasSharkAmulet) items.push("Shark Amulet (2x DMG)");
        if (this.hasGhostweaveCloak) items.push("Ghostweave Cloak (+15% crit)");
        if (this.hasEtherealShield) items.push("Ethereal Shield (+3 HP/turn)");
        if (this.hasEchoBlade) items.push("Echo Blade (20% double strike)");
        if (this.hasGearShield) items.push("Gear Shield (20% reflect)");
        if (this.hasChronoPendant) items.push("Chrono Pendant (15% extra turn)");
        if (this.hasPendulumBlade) items.push("Pendulum Blade (120%/80% dmg)");
        if (this.hasChampionGauntlets) items.push("Champion Gauntlets (+15% dmg)");
        if (this.hasGladiatorShield) items.push("Gladiator Shield (25% counter)");
        if (this.hasLegacyBlade) items.push(`Legacy Blade (+${this.legacyBladeKills} dmg)`);
        return items;
    }

    /**
     * Serialize character for saving
     */
    toJSON() {
        return {
            name: this.name,
            level: this.level,
            hp: this.hp,
            maxHp: this.maxHp,
            baseMaxHp: this.baseMaxHp,
            attack: this.attack,
            defense: this.defense,
            xp: this.xp,
            gold: this.gold,
            // Character creation
            gender: this.gender,
            characterClass: this.characterClass,
            // Equipment
            weapon: this.weapon,
            shield: this.shield,
            potions: this.potions,
            superiorPotions: this.superiorPotions,
            strengthElixirs: this.strengthElixirs,
            defenseElixirs: this.defenseElixirs,
            masterStrengthElixirs: this.masterStrengthElixirs,
            ultimateDefensePotions: this.ultimateDefensePotions,
            spells: [...this.spells],
            // Special items
            hasLeviathanGauntlets: this.hasLeviathanGauntlets,
            hasSharkAmulet: this.hasSharkAmulet,
            hasGhostweaveCloak: this.hasGhostweaveCloak,
            hasEtherealShield: this.hasEtherealShield,
            hasEchoBlade: this.hasEchoBlade,
            hasGearShield: this.hasGearShield,
            hasChronoPendant: this.hasChronoPendant,
            hasPendulumBlade: this.hasPendulumBlade,
            hasChampionGauntlets: this.hasChampionGauntlets,
            hasGladiatorShield: this.hasGladiatorShield,
            hasLegacyBlade: this.hasLegacyBlade,
            legacyBladeKills: this.legacyBladeKills
        };
    }

    /**
     * Load character from saved data
     */
    static fromJSON(data) {
        const char = new Character(data.name);
        char.level = data.level;
        char.hp = data.hp;
        char.maxHp = data.maxHp;
        char.baseMaxHp = data.baseMaxHp || data.maxHp;
        char.attack = data.attack;
        char.defense = data.defense;
        char.xp = data.xp;
        char.gold = data.gold;
        // Character creation
        char.gender = data.gender || null;
        char.characterClass = data.characterClass || null;
        // Equipment
        char.weapon = data.weapon;
        char.shield = data.shield;
        char.potions = data.potions;
        char.superiorPotions = data.superiorPotions || 0;
        char.strengthElixirs = data.strengthElixirs || 0;
        char.defenseElixirs = data.defenseElixirs || 0;
        char.masterStrengthElixirs = data.masterStrengthElixirs || 0;
        char.ultimateDefensePotions = data.ultimateDefensePotions || 0;
        char.spells = data.spells || [];

        // Special items
        char.hasLeviathanGauntlets = data.hasLeviathanGauntlets || false;
        char.hasSharkAmulet = data.hasSharkAmulet || false;
        char.hasGhostweaveCloak = data.hasGhostweaveCloak || false;
        char.hasEtherealShield = data.hasEtherealShield || false;
        char.hasEchoBlade = data.hasEchoBlade || false;
        char.hasGearShield = data.hasGearShield || false;
        char.hasChronoPendant = data.hasChronoPendant || false;
        char.hasPendulumBlade = data.hasPendulumBlade || false;
        char.hasChampionGauntlets = data.hasChampionGauntlets || false;
        char.hasGladiatorShield = data.hasGladiatorShield || false;
        char.hasLegacyBlade = data.hasLegacyBlade || false;
        char.legacyBladeKills = data.legacyBladeKills || 0;

        return char;
    }
}

/**
 * Enemy class
 */
export class Enemy {
    constructor(type, data) {
        this.type = type;
        this.name = data.name;
        this.maxHp = data.hp;
        this.hp = data.hp;
        this.attack = data.attack;
        this.defense = data.defense;
        this.xpReward = data.xp;
        this.goldReward = data.gold;
        this.isBoss = data.isBoss || false;

        // Shield/enrage mechanics (for curse expansion)
        this.shieldsAlly = data.shieldsAlly || null;
        this.enrageOnAllyDeath = data.enrageOnAllyDeath || null;
        this.enrageBonus = data.enrageBonus || 0;
        this.isEnraged = false;
        this.frozen = false;
    }

    /**
     * Take damage
     */
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        return this.hp <= 0;  // Returns true if dead
    }
}
