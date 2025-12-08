/**
 * Companion - AI companion that fights alongside the player
 */

export const COMPANION_DATA = {
    kira: {
        name: "Kira",
        role: "Healer",
        description: "The Wounded Healer",
        hp: 55,
        maxHp: 55,
        attack: 12,      // Boosted from 8 - should deal ~8-12 damage vs typical enemies
        defense: 4,
        healAmount: 25,  // Boosted from 20
        abilities: {
            heal: { name: "Healing Touch", description: "Restore 25 HP to player" },
            attack: { name: "Strike", description: "Basic attack" },
            protect: { name: "Sacrifice", description: "Take damage meant for player" }
        }
    },
    auren: {
        name: "Auren",
        role: "Angel",
        description: "The Fallen Angel",
        hp: 70,          // Boosted from 60
        maxHp: 70,
        attack: 15,      // Boosted from 10 - should deal ~10-14 damage vs typical enemies
        defense: 7,      // Boosted from 6
        healAmount: 0,
        abilities: {
            attack: { name: "Smite", description: "Holy damage attack" },
            protect: { name: "Divine Shield", description: "Block damage for player" },
            buff: { name: "Radiant Aura", description: "Reduce enemy damage" }
        }
    }
};

export class Companion {
    constructor(type) {
        const data = COMPANION_DATA[type];
        if (!data) {
            throw new Error(`Unknown companion type: ${type}`);
        }

        this.type = type;
        this.name = data.name;
        this.role = data.role;
        this.description = data.description;

        this.maxHp = data.maxHp;
        this.hp = data.hp;
        this.attack = data.attack;
        this.defense = data.defense;
        this.healAmount = data.healAmount;
        this.abilities = data.abilities;

        this.isConscious = true;
        this.isProtecting = false;  // If true, takes next hit for player

        // Kira heal tracking
        this.healsUsedThisBattle = 0;
        this.maxHealsPerBattle = 2;
    }

    /**
     * Take damage, return true if fainted
     */
    takeDamage(amount) {
        const actualDamage = Math.max(1, amount - this.defense);
        this.hp -= actualDamage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isConscious = false;
            return true;  // Fainted
        }
        return false;
    }

    /**
     * Heal the player (tracks heal usage)
     */
    healPlayer(player) {
        if (this.role !== 'Healer') return 0;
        if (this.healsUsedThisBattle >= this.maxHealsPerBattle) return 0;

        const healAmount = Math.min(this.healAmount, player.maxHp - player.hp);
        player.hp += healAmount;
        this.healsUsedThisBattle++;
        return healAmount;
    }

    /**
     * Check if heals are available
     */
    canHeal() {
        return this.role === 'Healer' && this.healsUsedThisBattle < this.maxHealsPerBattle;
    }

    /**
     * Calculate damage for an attack
     * Returns { damage, isCritical }
     */
    calculateAttackDamage(enemy) {
        const variation = Math.floor(Math.random() * 3);
        let damage = this.attack + variation;

        // 15% critical hit chance
        let isCritical = false;
        if (Math.random() < 0.15) {
            isCritical = true;
            damage = Math.floor(damage * 2);  // Double damage on crit
        }

        // Apply enemy defense (except on crits)
        if (!isCritical) {
            damage = Math.max(1, damage - enemy.defense);
        }

        return { damage, isCritical };
    }

    /**
     * Attack an enemy
     * Returns { damage, isCritical }
     */
    attackEnemy(enemy) {
        const result = this.calculateAttackDamage(enemy);
        enemy.takeDamage(result.damage);
        return result;
    }

    /**
     * AI decision making (automatic, no player choice)
     * Kira: Heal if player 30+ HP below max AND has heals, otherwise attack lowest HP enemy
     * Auren: Always attack enemy with highest attack
     * Returns: { action: 'attack'|'heal', target?: enemy, reason: string }
     */
    decideAction(player, enemies) {
        const livingEnemies = enemies.filter(e => e.hp > 0);

        // Kira (Healer): Heal if player is 30+ HP below max and has heals remaining
        if (this.role === 'Healer') {
            const hpMissing = player.maxHp - player.hp;

            if (hpMissing >= 30 && this.canHeal()) {
                return { action: 'heal', reason: 'Healing you!' };
            }

            // Otherwise attack lowest HP enemy
            if (livingEnemies.length > 0) {
                const target = livingEnemies.reduce((a, b) => a.hp < b.hp ? a : b);
                return { action: 'attack', target, reason: `Attacking ${target.name}` };
            }
        }

        // Auren (Angel): Always attack enemy with highest attack
        if (this.role === 'Angel') {
            if (livingEnemies.length > 0) {
                const target = livingEnemies.reduce((a, b) => a.attack > b.attack ? a : b);
                return { action: 'attack', target, reason: `Attacking ${target.name}` };
            }
        }

        // Default: attack first living enemy
        const target = enemies.find(e => e.hp > 0);
        return { action: 'attack', target, reason: 'Attacking' };
    }

    /**
     * Recover after battle (full HP only if fainted, otherwise keep current HP)
     */
    recoverAfterBattle() {
        if (!this.isConscious) {
            this.hp = this.maxHp;  // Full heal only if they fainted
            this.isConscious = true;
        }
        // If conscious, keep current HP - no healing
        this.isProtecting = false;
        this.healsUsedThisBattle = 0;  // Reset heal counter for next battle
    }

    /**
     * Full heal (between major battles or at sanctuaries)
     */
    fullHeal() {
        this.hp = this.maxHp;
        this.isConscious = true;
        this.isProtecting = false;
    }

    /**
     * Serialize for saving
     */
    toJSON() {
        return {
            type: this.type,
            hp: this.hp,
            isConscious: this.isConscious
        };
    }

    /**
     * Load from saved data
     */
    static fromJSON(data) {
        const companion = new Companion(data.type);
        companion.hp = data.hp;
        companion.isConscious = data.isConscious;
        return companion;
    }
}
