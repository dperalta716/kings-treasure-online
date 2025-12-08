/**
 * GroupBattle - Multi-combatant battle system
 * Player + Companion vs Multiple Enemies
 */

import { Enemy } from '../../js/character.js';
import { calculateDamage } from '../../js/battle.js';
import { SPELLS } from '../../js/constants.js';
import { CURSE_ENEMY_DATA, CURSE_CONFIG } from './curseConstants.js';

/**
 * Create an enemy from curse enemy data
 */
export function createCurseEnemy(enemyType) {
    const data = CURSE_ENEMY_DATA[enemyType];
    if (!data) {
        console.error(`Unknown curse enemy type: ${enemyType}`);
        return new Enemy(enemyType, {
            name: "Unknown", hp: 30, attack: 8, defense: 3, xp: 30, gold: 15, isBoss: false
        });
    }
    return new Enemy(enemyType, data);
}

/**
 * GroupBattle class - manages multi-combatant battles
 */
export class GroupBattle {
    constructor(terminal, character, companion, enemyTypes, curseSidebar, sprite = null, battleSprite = null) {
        this.terminal = terminal;
        this.character = character;
        this.companion = companion;
        this.enemies = enemyTypes.map(type => createCurseEnemy(type));
        this.curseSidebar = curseSidebar;
        this.sprite = sprite;
        this.battleSprite = battleSprite || sprite;  // Fall back to idle sprite if no battle sprite

        // Curse drain tracking
        this.turnCount = 0;
        this.curseDrainInterval = CURSE_CONFIG.drainInterval;
        this.curseDrainAmount = CURSE_CONFIG.drainAmount;

        // Battle state
        this.isBossBattle = this.enemies.some(e => e.isBoss);
        this.showedBattleSprite = false;  // Track if we've transitioned to battle sprite
    }

    /**
     * Get number for enemy index (1, 2, 3, etc.)
     */
    getEnemyNumber(index) {
        return String(index + 1);
    }

    /**
     * Update sidebar with current battle state
     */
    updateSidebar() {
        this.terminal.sidebar.updateHero(this.character);
        if (this.companion) {
            this.curseSidebar.updateCompanion(this.companion);
        }
        this.curseSidebar.updateEnemies(this.enemies);
        this.curseSidebar.updateCurseTurns(this.curseDrainInterval - (this.turnCount % this.curseDrainInterval));
    }

    /**
     * Display living enemies with number labels
     */
    displayEnemies() {
        const living = this.enemies.filter(e => e.hp > 0);
        this.terminal.print("\n[bold]Enemies:[/bold]");
        living.forEach((enemy, idx) => {
            const num = this.getEnemyNumber(this.enemies.indexOf(enemy));
            const hpPercent = Math.round((enemy.hp / enemy.maxHp) * 100);
            let hpColor = 'green';
            if (hpPercent <= 30) hpColor = 'red';
            else if (hpPercent <= 60) hpColor = 'yellow';
            this.terminal.print(`  ${num}. ${enemy.name}: [${hpColor}]${enemy.hp}/${enemy.maxHp}[/${hpColor}] HP`);
        });
    }

    /**
     * Player selects a target from living enemies
     */
    async selectTarget(prompt = "Select target") {
        const living = this.enemies.filter(e => e.hp > 0);
        if (living.length === 1) {
            return living[0];  // Auto-select if only one
        }

        this.terminal.print(`\n${prompt}:`);
        living.forEach((enemy, idx) => {
            const num = this.getEnemyNumber(this.enemies.indexOf(enemy));
            this.terminal.print(`  ${num}. ${enemy.name} (${enemy.hp}/${enemy.maxHp} HP)`);
        });

        while (true) {
            const choice = await this.terminal.prompt();

            // Find enemy by number
            for (let i = 0; i < this.enemies.length; i++) {
                if (this.getEnemyNumber(i) === choice && this.enemies[i].hp > 0) {
                    return this.enemies[i];
                }
            }

            this.terminal.print("Invalid target. Try again.");
        }
    }

    /**
     * Player's turn
     */
    async playerTurn() {
        this.terminal.print("\n[bold]Your turn![/bold]");

        // Check available actions - include all potion/elixir types
        const hasPotions = this.character.potions > 0 ||
                          this.character.superiorPotions > 0 ||
                          this.character.strengthElixirs > 0 ||
                          this.character.defenseElixirs > 0 ||
                          this.character.masterStrengthElixirs > 0 ||
                          this.character.ultimateDefensePotions > 0;
        const hasSpells = this.character.getAvailableSpells().length > 0;

        // Check if player is charged (must attack) or has used charge this battle
        const isCharged = this.character.charged;
        const chargeUsed = this.character.chargeUsedThisBattle;

        this.terminal.print("\nChoose an action:");
        this.terminal.print("  1. Attack");

        // Defend - strikethrough if charge already used this battle
        if (chargeUsed) {
            this.terminal.print("  [strike]2. Defend (used)[/strike]");
        } else {
            this.terminal.print("  2. Defend (block 50% + charge 1.5x)");
        }

        // Potion - strikethrough if charged (must attack)
        if (hasPotions) {
            if (isCharged) {
                this.terminal.print("  [strike]3. Use Potion[/strike]");
            } else {
                this.terminal.print("  3. Use Potion");
            }
        }

        // Spell - strikethrough if charged (must attack)
        const spellOptionNum = hasPotions ? 4 : 3;
        if (hasSpells) {
            if (isCharged) {
                this.terminal.print(`  [strike]${spellOptionNum}. Cast Spell[/strike]`);
            } else {
                this.terminal.print(`  ${spellOptionNum}. Cast Spell`);
            }
        }

        const choice = await this.terminal.prompt();

        // Secret instant-win command
        if (choice === ';' || choice === "'") {
            for (const enemy of this.enemies) {
                enemy.hp = 0;
            }
            this.terminal.print("\n[yellow]*** SECRET COMMAND ACTIVATED ***[/yellow]");
            this.terminal.print("You unleash your secret power and instantly defeat all enemies!");
            return 'win';
        }

        if (choice === '1') {
            return await this.playerAttack();
        } else if (choice === '2') {
            // Defend blocked if charge already used
            if (chargeUsed) {
                this.terminal.print("\n[dim]You cannot defend again this battle![/dim]");
                return await this.playerTurn();
            }
            return this.playerDefend();
        } else if (choice === '3' && hasPotions) {
            // Potion blocked if charged
            if (isCharged) {
                this.terminal.print("\n[dim]You must use your charged attack![/dim]");
                return await this.playerTurn();
            }
            return await this.playerUsePotion();
        } else if ((choice === '4' && hasPotions && hasSpells) || (choice === '3' && !hasPotions && hasSpells)) {
            // Spell blocked if charged
            if (isCharged) {
                this.terminal.print("\n[dim]You must use your charged attack![/dim]");
                return await this.playerTurn();
            }
            return await this.playerCastSpell();
        }

        this.terminal.print("Invalid choice.");
        return await this.playerTurn();
    }

    /**
     * Player attack action
     */
    async playerAttack() {
        const target = await this.selectTarget("Attack which enemy?");
        const result = calculateDamage(this.character, target, true);

        // Apply charge multiplier if charged
        let isPowerAttack = false;
        if (this.character.charged) {
            result.damage = Math.floor(result.damage * 1.5);
            this.character.charged = false;
            isPowerAttack = true;
        }

        // Build attack message with item bonuses
        let message = `You attack with your ${this.character.weapon}`;
        if (this.character.hasLeviathanGauntlets) {
            message += ' (enhanced by Leviathan Gauntlets +4)';
        }
        if (this.character.hasChampionGauntlets) {
            message += ' (+15% Champion Gauntlets)';
        }
        if (result.pendulumHigh !== null) {
            message += result.pendulumHigh ? ' (Pendulum: 120% power)' : ' (Pendulum: 80% power)';
        }

        // Power attack message
        if (isPowerAttack) {
            this.terminal.print("\n[yellow]*** POWER ATTACK! ***[/yellow]");
            this.terminal.print("You unleash your charged strike with devastating force!");
        }

        if (result.isCritical) {
            this.terminal.print("\n[critical]CRITICAL HIT![/critical] Your attack pierces through their defenses!");
        }

        // Shark Amulet activation message
        if (result.amuletUsed) {
            this.terminal.print("\n[yellow]*** SHARK TOOTH AMULET ACTIVATED! ***[/yellow]");
            this.terminal.print("Your attack power DOUBLES!");
        }

        target.takeDamage(result.damage);
        this.terminal.print(`${message} and deal ${this.terminal.damageText(result.damage, result.isCritical || isPowerAttack)} damage!`);

        if (target.hp <= 0) {
            this.terminal.print(`[green]${target.name} defeated![/green]`);
        }

        // Echo Blade double strike
        if (result.echoTriggered && target.hp > 0) {
            const echoDamage = Math.floor(result.damage / 2);
            this.terminal.print("\n[cyan]*** ECHO BLADE RESONATES! ***[/cyan]");
            this.terminal.print(`Your Echo Blade vibrates and strikes again for ${echoDamage} damage!`);
            target.takeDamage(echoDamage);
            if (target.hp <= 0) {
                this.terminal.print(`[green]${target.name} defeated by Echo Blade![/green]`);
            }
        }

        // Chronometer Pendant extra turn (15% chance)
        if (this.character.hasChronoPendant && Math.random() < 0.15 && this.enemies.some(e => e.hp > 0)) {
            this.terminal.print("\n[magenta]*** CHRONOMETER PENDANT ACTIVATES! ***[/magenta]");
            this.terminal.print("Time bends to your will, granting you an additional turn!");
            await this.terminal.delay(1000);
            return await this.playerAttack();
        }

        return 'continue';
    }

    /**
     * Player defend action
     */
    playerDefend() {
        if (this.character.chargeUsedThisBattle) {
            this.terminal.print("\n[dim]You've already used your charge this battle![/dim]");
            return 'retry';
        }

        this.character.defending = true;
        this.character.charged = true;
        this.character.chargeUsedThisBattle = true;

        this.terminal.print("\n[yellow]*** CHARGING POWER! ***[/yellow]");
        this.terminal.print("You brace yourself. Next attack deals 1.5x damage!");

        return 'continue';
    }

    /**
     * Player use potion - Full menu with all potion/elixir types
     */
    async playerUsePotion() {
        this.terminal.print("\n[bold]Available Potions:[/bold]");
        const potionOptions = [];
        let optNum = 1;

        if (this.character.potions > 0) {
            potionOptions.push({ key: optNum, type: 'health' });
            this.terminal.print(`  ${optNum}. Health Potion (${this.character.potions}) - Restore 25 HP`);
            optNum++;
        }
        if (this.character.superiorPotions > 0) {
            potionOptions.push({ key: optNum, type: 'superior' });
            this.terminal.print(`  ${optNum}. Superior Health Potion (${this.character.superiorPotions}) - Restore 45 HP`);
            optNum++;
        }
        if (this.character.strengthElixirs > 0) {
            potionOptions.push({ key: optNum, type: 'strength' });
            this.terminal.print(`  ${optNum}. Strength Elixir (${this.character.strengthElixirs}) - +2 attack this battle`);
            optNum++;
        }
        if (this.character.defenseElixirs > 0) {
            potionOptions.push({ key: optNum, type: 'defense' });
            this.terminal.print(`  ${optNum}. Defense Potion (${this.character.defenseElixirs}) - +2 defense this battle`);
            optNum++;
        }
        if (this.character.masterStrengthElixirs > 0) {
            potionOptions.push({ key: optNum, type: 'masterStrength' });
            this.terminal.print(`  ${optNum}. Master's Strength Elixir (${this.character.masterStrengthElixirs}) - +5 attack this battle`);
            optNum++;
        }
        if (this.character.ultimateDefensePotions > 0) {
            potionOptions.push({ key: optNum, type: 'ultimateDefense' });
            this.terminal.print(`  ${optNum}. Ultimate Defense Potion (${this.character.ultimateDefensePotions}) - +5 defense this battle`);
            optNum++;
        }
        this.terminal.print("  b. Back");

        const choice = await this.terminal.prompt();

        if (choice.toLowerCase() === 'b') {
            return await this.playerTurn();
        }

        const choiceNum = parseInt(choice);
        const selectedPotion = potionOptions.find(p => p.key === choiceNum);

        if (!selectedPotion) {
            this.terminal.print("Invalid choice.");
            return await this.playerUsePotion();
        }

        switch (selectedPotion.type) {
            case 'health':
                const healedH = this.character.usePotion();
                this.terminal.print(`\nYou drink a Health Potion and recover [green]${healedH}[/green] HP!`);
                return 'continue';
            case 'superior':
                const healedS = this.character.useSuperiorPotion();
                this.terminal.print(`\nYou drink a Superior Health Potion and recover [green]${healedS}[/green] HP!`);
                return 'continue';
            case 'strength':
                this.character.strengthElixirs--;
                this.character.tempAttackBoost += 2;
                this.terminal.print("\nYou drink a Strength Elixir!");
                this.terminal.print("[green]+2 attack[/green] for the rest of this battle!");
                return 'continue';
            case 'defense':
                this.character.defenseElixirs--;
                this.character.tempDefenseBoost += 2;
                this.terminal.print("\nYou drink a Defense Potion!");
                this.terminal.print("[green]+2 defense[/green] for the rest of this battle!");
                return 'continue';
            case 'masterStrength':
                this.character.masterStrengthElixirs--;
                this.character.tempAttackBoost += 5;
                this.terminal.print("\nYou drink a Master's Strength Elixir!");
                this.terminal.print("[green]+5 attack[/green] for the rest of this battle!");
                return 'continue';
            case 'ultimateDefense':
                this.character.ultimateDefensePotions--;
                this.character.tempDefenseBoost += 5;
                this.terminal.print("\nYou drink an Ultimate Defense Potion!");
                this.terminal.print("[green]+5 defense[/green] for the rest of this battle!");
                return 'continue';
        }

        return await this.playerUsePotion();
    }

    /**
     * Player cast spell
     */
    async playerCastSpell() {
        const available = this.character.getAvailableSpells();

        this.terminal.print("\nAvailable Spells:");
        available.forEach((spell, i) => {
            const spellData = SPELLS[spell];
            let tag = "";
            if (spellData?.isAoE) tag = " [cyan](AoE)[/cyan]";
            else if (spellData?.type === 'heal') tag = " [green](Heal)[/green]";
            this.terminal.print(`  ${i + 1}. ${spell}${tag}`);
        });
        this.terminal.print("  b. Back");

        const choice = await this.terminal.prompt();

        if (choice.toLowerCase() === 'b') {
            return await this.playerTurn();
        }

        const idx = parseInt(choice) - 1;
        if (isNaN(idx) || idx < 0 || idx >= available.length) {
            return await this.playerCastSpell();
        }

        const spellName = available[idx];
        const spellData = SPELLS[spellName];
        this.character.usedSpells.push(spellName);

        // Handle different spell types
        if (spellData?.type === 'heal') {
            // Heal spell (Energy Surge)
            const oldHp = this.character.hp;
            this.character.hp = this.character.maxHp;
            const healed = this.character.hp - oldHp;
            this.terminal.print(`\nYou cast [magenta]${spellName}[/magenta]!`);
            this.terminal.print(`Your HP is fully restored! [green]+${healed} HP[/green]`);
            return 'continue';
        }

        if (spellData?.type === 'damageAndHeal') {
            // Soul Drain - damage and heal
            const target = await this.selectTarget("Target which enemy?");
            const damage = spellData.damage || 15;
            target.takeDamage(damage);
            const healed = this.character.heal(damage);
            this.terminal.print(`\nYou cast [magenta]${spellName}[/magenta] on [bold]${target.name}[/bold]!`);
            this.terminal.print(`You drain [red]${damage}[/red] damage and heal [green]${healed}[/green] HP!`);
            if (target.hp <= 0) {
                this.terminal.print(`[green]${target.name} defeated![/green]`);
            }
            return 'continue';
        }

        if (spellData?.isAoE) {
            // AoE spell (Chain Lightning, Cursed Wave)
            return await this.castAoESpell(spellName, spellData);
        }

        if (spellData?.type === 'attackAndFreeze') {
            // Time Freeze - attack one target and freeze ALL enemies
            const target = await this.selectTarget("Target which enemy?");
            const damage = this.character.attack + 10;  // Base attack damage
            target.takeDamage(damage);

            // Freeze ALL living enemies
            const livingEnemies = this.enemies.filter(e => e.hp > 0);
            for (const enemy of livingEnemies) {
                enemy.frozen = true;
            }

            this.terminal.print(`\nYou cast [magenta]${spellName}[/magenta]!`);
            this.terminal.print(`[cyan]*** TIME STOPS! ***[/cyan]`);
            this.terminal.print(`You strike [bold]${target.name}[/bold] for [red]${damage}[/red] damage!`);
            if (livingEnemies.length > 1) {
                this.terminal.print(`All ${livingEnemies.length} enemies are [cyan]FROZEN[/cyan] and will skip their next turn!`);
            } else {
                this.terminal.print(`${target.name} is [cyan]FROZEN[/cyan] and will skip their next turn!`);
            }
            if (target.hp <= 0) {
                this.terminal.print(`[green]${target.name} defeated![/green]`);
            }
            return 'continue';
        }

        // Single target attack spell
        const target = await this.selectTarget("Target which enemy?");
        const damage = this.getSpellDamage(spellName, spellData);
        target.takeDamage(damage);

        this.terminal.print(`\nYou cast [magenta]${spellName}[/magenta] on [bold]${target.name}[/bold]!`);

        // Show Mage bonus message if applicable
        const spellBonus = this.character.getSpellDamageBonus ? this.character.getSpellDamageBonus() : 0;
        if (spellBonus > 0) {
            this.terminal.print(`[cyan]Your arcane mastery amplifies the spell![/cyan]`);
        }

        this.terminal.print(`Magical energy deals [red]${damage}[/red] damage!`);

        if (target.hp <= 0) {
            this.terminal.print(`[green]${target.name} defeated![/green]`);
        }

        return 'continue';
    }

    /**
     * Get spell damage (ATK + damageBonus + Mage bonus)
     */
    getSpellDamage(spellName, spellData) {
        if (!spellData) spellData = SPELLS[spellName];

        // AoE spells use totalDamage (split among enemies)
        if (spellData?.isAoE) {
            return spellData.totalDamage || 20;
        }

        // Attack spells use ATK + damageBonus
        const bonus = spellData?.damageBonus || 10;
        let damage = this.character.attack + bonus;

        // Apply Mage spell damage bonus (+25%)
        const spellBonus = this.character.getSpellDamageBonus ? this.character.getSpellDamageBonus() : 0;
        if (spellBonus > 0) {
            damage = Math.floor(damage * (1 + spellBonus));
        }

        return damage;
    }

    /**
     * Cast an AoE spell that hits all enemies
     */
    async castAoESpell(spellName, spellData) {
        const livingEnemies = this.enemies.filter(e => e.hp > 0);
        const totalDamage = spellData?.totalDamage || 20;
        const damagePerEnemy = Math.floor(totalDamage / livingEnemies.length);

        this.terminal.print(`\nYou cast [magenta]${spellName}[/magenta]!`);

        if (livingEnemies.length === 1) {
            this.terminal.print(`[cyan]Magical energy strikes ${livingEnemies[0].name}![/cyan]`);
        } else {
            this.terminal.print(`[cyan]Magical energy arcs between all ${livingEnemies.length} enemies![/cyan]`);
        }

        for (const enemy of livingEnemies) {
            enemy.takeDamage(damagePerEnemy);
            this.terminal.print(`  ${enemy.name} takes [red]${damagePerEnemy}[/red] damage!`);

            if (enemy.hp <= 0) {
                this.terminal.print(`  [green]${enemy.name} defeated![/green]`);
            }
        }

        return 'continue';
    }

    /**
     * Companion turn - automatic AI, no player choice
     */
    async companionTurn() {
        if (!this.companion.isConscious) {
            this.terminal.print(`\n[dim]${this.companion.name} is unconscious...[/dim]`);
            return 'continue';
        }

        this.terminal.print(`\n[bold][magenta]${this.companion.name}'s turn![/magenta][/bold]`);

        // AI decides what to do
        const decision = this.companion.decideAction(this.character, this.enemies);

        if (decision.action === 'heal') {
            const healed = this.companion.healPlayer(this.character);
            const healsLeft = this.companion.maxHealsPerBattle - this.companion.healsUsedThisBattle;
            this.terminal.print(`\n${this.companion.name} casts [cyan]Healing Touch[/cyan]!`);
            this.terminal.print(`You recover [green]${healed}[/green] HP! [dim](${healsLeft} heals remaining)[/dim]`);
        } else if (decision.action === 'attack' && decision.target) {
            const result = this.companion.attackEnemy(decision.target);
            if (result.isCritical) {
                this.terminal.print(`\n[critical]CRITICAL HIT![/critical]`);
            }
            this.terminal.print(`${this.companion.name} attacks [bold]${decision.target.name}[/bold] for ${this.terminal.damageText(result.damage, result.isCritical)} damage!`);
            if (decision.target.hp <= 0) {
                this.terminal.print(`[green]${decision.target.name} defeated![/green]`);
            }
        }

        return 'continue';
    }

    /**
     * All enemies take their turns
     */
    async enemiesTurn() {
        const livingEnemies = this.enemies.filter(e => e.hp > 0);

        for (const enemy of livingEnemies) {
            // Check if enemy is frozen (Time Freeze)
            if (enemy.frozen) {
                this.terminal.print(`\n[cyan]${enemy.name} is frozen in time and cannot act![/cyan]`);
                enemy.frozen = false;  // Unfreeze after skipping turn
                await this.terminal.delay(1500);
                continue;
            }

            // Flash to battle sprite on first enemy attack, then flash white on subsequent attacks
            if (this.battleSprite) {
                if (!this.showedBattleSprite) {
                    await this.terminal.showBattleSprite(this.battleSprite, enemy.name);
                    this.showedBattleSprite = true;
                } else {
                    // Flash white effect (same sprite, just the flash)
                    await this.terminal.showBattleSprite(this.battleSprite, enemy.name);
                }
            }

            this.terminal.print(`\n[red][bold]${enemy.name}'s turn![/bold][/red]`);

            // Miss chance
            if (Math.random() < 0.2) {
                this.terminal.print(`${enemy.name} fumbles and misses!`);
                await this.terminal.delay(1500);  // Pause between enemy actions
                continue;
            }

            // Choose target based on companion role (if companion is present and conscious)
            let target = this.character;
            if (this.companion && this.companion.isConscious) {
                // Targeting AI: Angel draws 70% of attacks, Healer draws 30%
                const targetPlayerChance = this.companion.role === 'Angel' ? 0.3 : 0.7;
                target = Math.random() < targetPlayerChance ? this.character : this.companion;
            }

            // If companion is protecting player and enemy targeted player, redirect
            if (target === this.character && this.companion && this.companion.isProtecting && this.companion.isConscious) {
                target = this.companion;
                this.companion.isProtecting = false;
                this.terminal.print(`[cyan]${this.companion.name} intercepts the attack![/cyan]`);
            }

            // Calculate damage
            let damage = enemy.attack + Math.floor(Math.random() * 3) - 1;

            // Boss critical hit (25% chance, 1.5x damage)
            let isCritical = false;
            if (enemy.isBoss && Math.random() < 0.25) {
                isCritical = true;
                damage = Math.floor(damage * 1.5);
                this.terminal.print(`[critical]CRITICAL HIT![/critical] [bold]${enemy.name}[/bold]'s attack is devastating!`);
            }

            if (target === this.character) {
                // Player defense
                damage = Math.max(1, damage - this.character.getTotalDefense());

                if (this.character.defending) {
                    damage = Math.floor(damage / 2);
                    this.terminal.print("Your defensive stance reduces the damage!");
                    this.character.defending = false;
                }

                // Gear Shield reflection (20% chance, before damage applied)
                if (this.character.hasGearShield && Math.random() < 0.20) {
                    const reflectDamage = Math.floor(damage / 2);
                    this.terminal.print("\n[cyan]*** GEAR SHIELD ACTIVATES! ***[/cyan]");
                    this.terminal.print(`Your Gear Shield reflects ${reflectDamage} damage back at [bold]${enemy.name}[/bold]!`);
                    if (enemy.takeDamage(reflectDamage)) {
                        this.terminal.print(`Your Gear Shield reflection defeated [bold]${enemy.name}[/bold]!`);
                        // Check if all enemies defeated
                        if (this.checkVictory()) {
                            return 'victory';
                        }
                    }
                }

                this.terminal.print(`${enemy.name} attacks you for [red]${damage}[/red] damage!`);
                const isDead = this.character.takeDamage(damage);

                // Gladiator Shield counter-attack (25% chance)
                if (this.character.hasGladiatorShield && Math.random() < 0.25 && !isDead && enemy.hp > 0) {
                    const counterDamage = Math.floor(damage / 2);
                    this.terminal.print(`[yellow]*** GLADIATOR'S SHIELD COUNTER-ATTACK! ***[/yellow]`);
                    this.terminal.print(`Your shield strikes back for [red]${counterDamage}[/red] damage!`);
                    if (enemy.takeDamage(counterDamage)) {
                        this.terminal.print(`[green]${enemy.name} defeated by counter-attack![/green]`);
                        // Check if all enemies defeated
                        if (this.checkVictory()) {
                            return 'victory';
                        }
                    }
                }

                // Ethereal Shield regeneration (+3 HP after being hit)
                if (this.character.hasEtherealShield && !isDead) {
                    const healAmount = Math.min(3, this.character.maxHp - this.character.hp);
                    if (healAmount > 0) {
                        this.character.hp += healAmount;
                        this.terminal.print(`\nYour Ethereal Shield shimmers, restoring [green]${healAmount}[/green] HP!`);
                    }
                }

                if (isDead) {
                    return 'defeat';
                }
            } else {
                // Companion takes damage
                const fainted = this.companion.takeDamage(damage);
                this.terminal.print(`${enemy.name} attacks ${this.companion.name} for [red]${damage}[/red] damage!`);

                if (fainted) {
                    this.terminal.print(`[yellow]${this.companion.name} collapses![/yellow]`);
                }
            }

            // Pause between enemy attacks (1.5 seconds)
            await this.terminal.delay(1500);
        }

        return 'continue';
    }

    /**
     * Apply curse HP drain
     */
    applyCurseDrain() {
        this.terminal.print(`\n[magenta]${CURSE_CONFIG.drainMessage}[/magenta]`);
        this.terminal.print(`You lose [red]${this.curseDrainAmount}[/red] HP from the curse!`);
        const isDead = this.character.takeDamage(this.curseDrainAmount);

        if (isDead) {
            this.terminal.print("\n[red]The curse has consumed you...[/red]");
            return true;
        }
        return false;
    }

    /**
     * Check if all enemies defeated
     */
    checkVictory() {
        return this.enemies.every(e => e.hp <= 0);
    }

    /**
     * Check if player defeated
     */
    checkDefeat() {
        return this.character.hp <= 0;
    }

    /**
     * Handle victory
     */
    async handleVictory() {
        this.terminal.victoryBanner();

        // Calculate total rewards
        let totalXp = 0;
        let totalGold = 0;
        for (const enemy of this.enemies) {
            totalXp += enemy.xpReward;
            totalGold += enemy.goldReward;
        }

        this.character.gold += totalGold;
        this.terminal.print(`You gained ${this.terminal.xpText(totalXp)} and ${this.terminal.goldText(totalGold)}!`);

        // Legacy Blade kill tracking
        if (this.character.hasLegacyBlade) {
            const killCount = this.enemies.length;
            this.character.legacyBladeKills += killCount;
            this.terminal.print(`\nYour [yellow]Legacy Blade[/yellow] absorbs the essence of ${killCount} foe${killCount > 1 ? 's' : ''}!`);
            this.terminal.print(`Legacy Blade power: [green]+${this.character.legacyBladeKills}[/green] damage`);
        }

        const levelUps = this.character.gainXp(totalXp);
        for (const levelUp of levelUps) {
            this.terminal.levelUpBanner();
            this.terminal.print(`You are now level [magenta]${levelUp.newLevel}[/magenta]!`);
            if (levelUp.newSpell) {
                this.terminal.print(`You learned a new spell: [magenta]${levelUp.newSpell.name}[/magenta]!`);
            }
        }

        // Handle Shark Amulet consumption if used during battle
        if (this.character.sharkAmuletUsed) {
            this.terminal.separator();
            this.terminal.print("[yellow]*** SHARK TOOTH AMULET CONSUMED ***[/yellow]");
            this.terminal.print("The amulet crumbles to dust, its magical power spent.");
            this.terminal.separator();
            this.character.hasSharkAmulet = false;
            this.character.sharkAmuletUsed = false;
        }

        // Reset temporary effects (attack/defense boosts, defending state, charge)
        const hadTempHp = this.character.resetTempEffects();
        if (hadTempHp) {
            this.terminal.print("\nThe temporary HP boost from your Superior Health Potion has worn off.");
        }

        // Companion recovery (if companion exists)
        if (this.companion) {
            this.companion.recoverAfterBattle();
        }

        await this.terminal.waitForEnter();
    }

    /**
     * Run the battle
     * Returns true if player wins, false if defeated
     */
    async run() {
        // Reset battle state
        this.character.usedSpells = [];
        this.character.defending = false;
        this.character.charged = false;
        this.character.chargeUsedThisBattle = false;
        this.turnCount = 0;

        // Show battle sprite if available
        if (this.sprite) {
            this.terminal.showSprite(this.sprite, this.enemies[0].name);
        }

        // Show initial state
        this.curseSidebar.showCombat();
        this.updateSidebar();
        this.displayEnemies();

        if (this.isBossBattle) {
            this.terminal.bossWarning();
        }

        // Battle loop
        while (true) {
            this.turnCount++;
            this.updateSidebar();

            // Player turn
            let result = await this.playerTurn();
            while (result === 'retry') {
                result = await this.playerTurn();
            }
            this.updateSidebar();
            await this.terminal.delay(500);

            if (this.checkVictory()) {
                await this.handleVictory();
                this.curseSidebar.hideCombat();
                return true;
            }

            // Companion turn (only if companion exists and is conscious)
            if (this.companion && this.companion.isConscious) {
                await this.companionTurn();
                this.updateSidebar();
                await this.terminal.delay(500);

                if (this.checkVictory()) {
                    await this.handleVictory();
                    this.curseSidebar.hideCombat();
                    return true;
                }
            }

            // Enemy turns
            const enemyResult = await this.enemiesTurn();
            this.updateSidebar();

            if (enemyResult === 'defeat' || this.checkDefeat()) {
                this.terminal.defeatBanner();
                this.terminal.print("You have been defeated!");
                this.curseSidebar.hideCombat();
                return false;
            }

            // Check victory after enemy turn (Gladiator Shield/Gear Shield can kill last enemy)
            if (enemyResult === 'victory' || this.checkVictory()) {
                await this.handleVictory();
                this.curseSidebar.hideCombat();
                return true;
            }

            // Curse drain check
            if (this.turnCount % this.curseDrainInterval === 0) {
                if (this.applyCurseDrain()) {
                    this.terminal.defeatBanner();
                    this.terminal.print("[red]The curse has fully consumed you. You are now a Wraith forever...[/red]");
                    this.curseSidebar.hideCombat();
                    return false;
                }
                this.updateSidebar();
            }

            await this.terminal.delay(300);
        }
    }
}
