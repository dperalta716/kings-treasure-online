/**
 * Sidebar - Manages the stats sidebar UI
 */
import { getXpForLevel, CHARACTER_CLASSES } from './constants.js';

export class Sidebar {
    constructor() {
        // Enemy elements
        this.enemySection = document.getElementById('enemy-stats');
        this.enemyName = document.getElementById('enemy-name');
        this.enemyHpBar = document.getElementById('enemy-hp-bar');
        this.enemyHpText = document.getElementById('enemy-hp-text');
        this.enemyAtk = document.getElementById('enemy-atk');
        this.enemyDef = document.getElementById('enemy-def');

        // Hero elements
        this.heroLevel = document.getElementById('hero-level');
        this.heroClass = document.getElementById('hero-class');
        this.heroGold = document.getElementById('hero-gold');
        this.heroHpBar = document.getElementById('hero-hp-bar');
        this.heroHpText = document.getElementById('hero-hp-text');
        this.heroXpBar = document.getElementById('hero-xp-bar');
        this.heroXpText = document.getElementById('hero-xp-text');

        // Equipment elements
        this.weaponName = document.getElementById('weapon-name');
        this.weaponDmg = document.getElementById('weapon-dmg');
        this.shieldName = document.getElementById('shield-name');
        this.shieldDef = document.getElementById('shield-def');

        // Inventory elements
        this.potionCount = document.getElementById('potion-count');
        this.superiorPotionCount = document.getElementById('superior-potion-count');
        this.superiorPotionsRow = document.getElementById('superior-potions-row');
        this.masterPotionCount = document.getElementById('master-potion-count');
        this.masterPotionsRow = document.getElementById('master-potions-row');
        this.strengthElixirCount = document.getElementById('strength-elixir-count');
        this.strengthElixirsRow = document.getElementById('strength-elixirs-row');
        this.defensePotionCount = document.getElementById('defense-potion-count');
        this.defensePotionsRow = document.getElementById('defense-potions-row');
        this.masterStrengthCount = document.getElementById('master-strength-count');
        this.masterStrengthRow = document.getElementById('master-strength-row');
        this.ultimateDefenseCount = document.getElementById('ultimate-defense-count');
        this.ultimateDefenseRow = document.getElementById('ultimate-defense-row');

        // Spells elements
        this.spellsSection = document.getElementById('spells-stats');
        this.spellsList = document.getElementById('spells-list');

        // Special items elements
        this.specialItemsSection = document.getElementById('special-items-stats');
        this.specialItemsList = document.getElementById('special-items-list');

        // Buffs elements
        this.buffsSection = document.getElementById('buffs-stats');
        this.buffsList = document.getElementById('buffs-list');
    }

    /**
     * Update all hero stats
     */
    updateHero(character) {
        // Level and gold
        this.heroLevel.textContent = character.level;
        this.heroGold.textContent = `${character.gold} gold`;

        // Class display
        if (character.characterClass && CHARACTER_CLASSES[character.characterClass]) {
            const classData = CHARACTER_CLASSES[character.characterClass];
            this.heroClass.textContent = classData.name;
            this.heroClass.className = `hero-class class-${character.characterClass}`;
        } else {
            this.heroClass.textContent = '';
        }

        // HP bar
        this.updateHpBar(this.heroHpBar, this.heroHpText, character.hp, character.maxHp);

        // XP bar
        const xpNeeded = getXpForLevel(character.level);
        const xpPercent = Math.min((character.xp / xpNeeded) * 100, 100);
        this.heroXpBar.style.width = `${xpPercent}%`;
        this.heroXpText.textContent = `${character.xp}/${xpNeeded}`;

        // Equipment
        this.weaponName.textContent = character.weapon;
        this.weaponDmg.textContent = `(${character.getWeaponDamage()})`;
        this.shieldName.textContent = character.shield;
        this.shieldDef.textContent = `(${character.getShieldDefense()})`;

        // Inventory
        this.potionCount.textContent = character.potions;

        if (character.superiorPotions > 0) {
            this.superiorPotionsRow.classList.remove('hidden');
            this.superiorPotionCount.textContent = character.superiorPotions;
        } else {
            this.superiorPotionsRow.classList.add('hidden');
        }

        if (character.masterPotions > 0 && this.masterPotionsRow) {
            this.masterPotionsRow.classList.remove('hidden');
            this.masterPotionCount.textContent = character.masterPotions;
        } else if (this.masterPotionsRow) {
            this.masterPotionsRow.classList.add('hidden');
        }

        // Buff potions
        if (character.strengthElixirs > 0) {
            this.strengthElixirsRow.classList.remove('hidden');
            this.strengthElixirCount.textContent = character.strengthElixirs;
        } else {
            this.strengthElixirsRow.classList.add('hidden');
        }

        if (character.defenseElixirs > 0) {
            this.defensePotionsRow.classList.remove('hidden');
            this.defensePotionCount.textContent = character.defenseElixirs;
        } else {
            this.defensePotionsRow.classList.add('hidden');
        }

        if (character.masterStrengthElixirs > 0) {
            this.masterStrengthRow.classList.remove('hidden');
            this.masterStrengthCount.textContent = character.masterStrengthElixirs;
        } else {
            this.masterStrengthRow.classList.add('hidden');
        }

        if (character.ultimateDefensePotions > 0) {
            this.ultimateDefenseRow.classList.remove('hidden');
            this.ultimateDefenseCount.textContent = character.ultimateDefensePotions;
        } else {
            this.ultimateDefenseRow.classList.add('hidden');
        }

        // Spells
        this.updateSpells(character);

        // Special items
        this.updateSpecialItems(character);
    }

    /**
     * Update HP bar with color coding
     */
    updateHpBar(barEl, textEl, current, max) {
        const percent = Math.max(0, (current / max) * 100);
        barEl.style.width = `${percent}%`;
        textEl.textContent = `${current}/${max}`;

        // Color based on percentage - apply to both bar and text
        barEl.classList.remove('medium', 'low');
        textEl.classList.remove('medium', 'low');

        if (percent <= 30) {
            barEl.classList.add('low');
            textEl.classList.add('low');
        } else if (percent <= 60) {
            barEl.classList.add('medium');
            textEl.classList.add('medium');
        }
    }

    /**
     * Show enemy stats (during combat)
     */
    showEnemy(enemy) {
        this.enemySection.classList.remove('hidden');
        this.enemyName.textContent = enemy.name;
        this.enemyName.classList.toggle('boss', enemy.isBoss);
        this.enemyAtk.textContent = enemy.attack;
        this.enemyDef.textContent = enemy.defense;
        this.updateHpBar(this.enemyHpBar, this.enemyHpText, enemy.hp, enemy.maxHp);
    }

    /**
     * Update enemy HP (during combat)
     */
    updateEnemy(enemy) {
        this.updateHpBar(this.enemyHpBar, this.enemyHpText, enemy.hp, enemy.maxHp);
    }

    /**
     * Hide enemy stats (outside combat)
     */
    hideEnemy() {
        this.enemySection.classList.add('hidden');
    }

    /**
     * Update spells list
     */
    updateSpells(character, usedSpells = []) {
        if (character.spells.length === 0) {
            this.spellsSection.classList.add('hidden');
            return;
        }

        this.spellsSection.classList.remove('hidden');
        this.spellsList.innerHTML = '';

        for (const spell of character.spells) {
            const div = document.createElement('div');
            div.className = 'spell-item';
            div.textContent = spell;

            if (usedSpells.includes(spell)) {
                div.classList.add('used');
            }

            this.spellsList.appendChild(div);
        }
    }

    /**
     * Update special items list
     */
    updateSpecialItems(character) {
        const items = [];

        if (character.hasLeviathanGauntlets) items.push('Leviathan Gauntlets');
        if (character.hasSharkAmulet) items.push('Shark Amulet');
        if (character.hasGhostweaveCloak) items.push('Ghostweave Cloak');
        if (character.hasEtherealShield) items.push('Ethereal Shield');
        if (character.hasEchoBlade) items.push('Echo Blade');
        if (character.hasGearShield) items.push('Gear Shield');
        if (character.hasChronoPendant) items.push('Chrono Pendant');
        if (character.hasPendulumBlade) items.push('Pendulum Blade');
        if (character.hasChampionGauntlets) items.push('Champion Gauntlets');
        if (character.hasGladiatorShield) items.push('Gladiator Shield');
        if (character.hasLegacyBlade) items.push(`Legacy Blade (+${character.legacyBladeKills})`);

        if (items.length === 0) {
            this.specialItemsSection.classList.add('hidden');
            return;
        }

        this.specialItemsSection.classList.remove('hidden');
        this.specialItemsList.innerHTML = '';

        for (const item of items) {
            const div = document.createElement('div');
            div.className = 'special-item';
            div.textContent = item;
            this.specialItemsList.appendChild(div);
        }
    }

    /**
     * Show active buffs during combat
     */
    showBuffs(character) {
        const buffs = [];

        if (character.charged) buffs.push('CHARGED (1.5x next attack!)');
        if (character.defending) buffs.push('Defending (50% dmg reduction)');
        if (character.tempAttackBoost > 0) buffs.push(`+${character.tempAttackBoost} Attack`);
        if (character.tempDefenseBoost > 0) buffs.push(`+${character.tempDefenseBoost} Defense`);
        if (character.tempHpBoost > 0) buffs.push(`+${character.tempHpBoost} Max HP`);

        if (buffs.length === 0) {
            this.buffsSection.classList.add('hidden');
            return;
        }

        this.buffsSection.classList.remove('hidden');
        this.buffsList.innerHTML = '';

        for (const buff of buffs) {
            const div = document.createElement('div');
            div.className = 'buff-item';
            div.textContent = buff;
            this.buffsList.appendChild(div);
        }
    }

    /**
     * Hide buffs section
     */
    hideBuffs() {
        this.buffsSection.classList.add('hidden');
    }

    /**
     * Mark a spell as used in the display
     */
    markSpellUsed(spellName) {
        const spellItems = this.spellsList.querySelectorAll('.spell-item');
        for (const item of spellItems) {
            if (item.textContent === spellName) {
                item.classList.add('used');
                break;
            }
        }
    }

    /**
     * Reset spell used status (for new battle)
     */
    resetSpellStatus() {
        const spellItems = this.spellsList.querySelectorAll('.spell-item');
        for (const item of spellItems) {
            item.classList.remove('used');
        }
    }
}
