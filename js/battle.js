/**
 * Battle System - Combat mechanics
 */
import { Enemy } from './character.js';
import {
    ENEMY_DATA, WEAPON_DAMAGE, WEAPON_DROPS, SPECIAL_ITEM_DROPS, SPELLS,
    getEnemySprite, getDefeatedEnemySprite, getWeaponSprite, getItemSprite, getShieldSprite
} from './constants.js';

/**
 * Create an enemy from type
 */
export function createEnemy(enemyType) {
    const data = ENEMY_DATA[enemyType];
    if (!data) {
        console.error(`Unknown enemy type: ${enemyType}`);
        return new Enemy(enemyType, { name: "Monster", hp: 20, attack: 5, defense: 2, xp: 30, gold: 15, isBoss: false });
    }
    return new Enemy(enemyType, data);
}

/**
 * Calculate damage for an attack
 */
export function calculateDamage(attacker, defender, isPlayer = true) {
    let baseDamage;

    if (isPlayer) {
        // Player attacking
        baseDamage = attacker.getWeaponDamage();

        // Leviathan Gauntlets bonus
        if (attacker.hasLeviathanGauntlets) {
            baseDamage += 4;
        }

        // Champion's Gauntlets 15% damage increase
        if (attacker.hasChampionGauntlets) {
            baseDamage = Math.floor(baseDamage * 1.15);
        }

        // Pendulum Blade alternating damage
        if (attacker.hasPendulumBlade) {
            if (attacker.pendulumTurn % 2 === 0) {
                baseDamage = Math.floor(baseDamage * 1.2);
            } else {
                baseDamage = Math.floor(baseDamage * 0.8);
            }
            attacker.pendulumTurn++;
        }

        // Legacy Blade bonus
        if (attacker.hasLegacyBlade && attacker.legacyBladeKills > 0) {
            baseDamage += attacker.legacyBladeKills;
        }
    } else {
        // Enemy attacking
        baseDamage = attacker.attack;
    }

    // Add random variation (0-2)
    const variation = Math.floor(Math.random() * 3);
    let damage = baseDamage + variation;

    // Critical hit check (player only)
    let isCritical = false;
    if (isPlayer) {
        let critChance = 0.2;  // 20% base
        if (attacker.hasGhostweaveCloak) {
            critChance += 0.15;
        }
        if (Math.random() < critChance) {
            isCritical = true;
            damage = Math.floor(damage * 2);  // Double damage on crit
        }
    }

    // Apply defense reduction (except on crits)
    if (!isCritical) {
        const defenderDefense = isPlayer ? defender.defense : defender.getTotalDefense();
        damage = Math.max(WEAPON_DAMAGE[attacker.weapon] || 3, damage - defenderDefense);
    }

    // Shark Amulet doubles damage
    let amuletUsed = false;
    if (isPlayer && attacker.hasSharkAmulet && !attacker.sharkAmuletUsed) {
        damage *= 2;
        attacker.sharkAmuletUsed = true;
        amuletUsed = true;
    }

    // Echo Blade double strike
    let echoTriggered = false;
    if (isPlayer && attacker.hasEchoBlade && Math.random() < 0.20) {
        echoTriggered = true;
    }

    return {
        damage,
        isCritical,
        amuletUsed,
        echoTriggered,
        pendulumHigh: attacker.hasPendulumBlade ? (attacker.pendulumTurn - 1) % 2 === 0 : null
    };
}

/**
 * Battle class - manages a single battle
 */
export class Battle {
    constructor(terminal, character, enemyType) {
        this.terminal = terminal;
        this.character = character;
        this.enemyType = enemyType;
        this.enemy = createEnemy(enemyType);
        this.isBossBattle = this.enemy.isBoss;
    }

    /**
     * Display battle stats
     */
    displayStats() {
        this.terminal.separator();
        const bossMarker = this.enemy.isBoss ? ' [bold][red][BOSS][/red][/bold]' : '';
        this.terminal.print(`${this.enemy.name}${bossMarker}: HP ${this.terminal.healthText(this.enemy.hp, this.enemy.maxHp)}`);
        this.terminal.print(`You: HP ${this.terminal.healthText(this.character.hp, this.character.maxHp)} | Level [cyan]${this.character.level}[/cyan]`);
        this.terminal.print(`Weapon: [yellow]${this.character.weapon}[/yellow] | Shield: [cyan]${this.character.shield}[/cyan]`);

        // Show special items if any
        const items = this.character.getSpecialItems();
        if (items.length > 0) {
            this.terminal.print(`Items: [green]${items.join(', ')}[/green]`);
        }
        this.terminal.separator();
    }

    /**
     * Show player's turn menu and get choice
     */
    async playerTurn() {
        this.terminal.print("\n[bold]Your turn![/bold]");

        // Build menu options
        const options = ['1. Attack', '2. Defend (reduce damage by 50%)'];
        let optionNum = 3;

        if (this.character.potions > 0) {
            options.push(`${optionNum}. Use Health Potion (${this.character.potions} remaining)`);
            optionNum++;
        }

        if (this.character.superiorPotions > 0) {
            options.push(`${optionNum}. Use Superior Potion (${this.character.superiorPotions} remaining)`);
            optionNum++;
        }

        const availableSpells = this.character.getAvailableSpells();
        if (availableSpells.length > 0) {
            options.push(`${optionNum}. Cast Spell`);
        }

        this.terminal.print("\nChoose an action:");
        for (const opt of options) {
            this.terminal.print(`  ${opt}`);
        }

        const choice = await this.terminal.prompt();

        // Secret instant-win command
        if (choice === ';' || choice === "'") {
            this.enemy.hp = 0;
            this.terminal.print("\n[yellow]*** SECRET COMMAND ACTIVATED ***[/yellow]");
            this.terminal.print(`You unleash your secret power and instantly defeat the ${this.enemy.name}!`);
            return 'win';
        }

        // Process choice
        if (choice === '1') {
            return await this.performAttack();
        } else if (choice === '2') {
            return this.performDefend();
        } else if (choice === '3' && this.character.potions > 0) {
            return this.usePotion();
        } else if ((choice === '3' && this.character.potions <= 0 && this.character.superiorPotions > 0) ||
                   (choice === '4' && this.character.superiorPotions > 0)) {
            return this.useSuperiorPotion();
        } else {
            const spellOptionNum = options.findIndex(o => o.includes('Cast Spell'));
            if (spellOptionNum !== -1 && choice === String(spellOptionNum + 1)) {
                return await this.castSpell();
            }
        }

        this.terminal.print("Invalid choice. Try again.");
        return await this.playerTurn();
    }

    /**
     * Perform attack action
     */
    async performAttack() {
        const result = calculateDamage(this.character, this.enemy, true);

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

        if (result.isCritical) {
            this.terminal.print("\n[critical]CRITICAL HIT![/critical] Your attack pierces through their defenses!");
        }

        if (result.amuletUsed) {
            this.terminal.print("\n[yellow]*** SHARK TOOTH AMULET ACTIVATED! ***[/yellow]");
            this.terminal.print("Your attack power DOUBLES!");
        }

        this.enemy.takeDamage(result.damage);
        this.terminal.print(`${message} and deal ${this.terminal.damageText(result.damage, result.isCritical)} damage!`);

        // Echo Blade second attack
        if (result.echoTriggered && this.enemy.hp > 0) {
            const echoDamage = Math.floor(result.damage / 2);
            this.terminal.print("\n[cyan]*** ECHO BLADE RESONATES! ***[/cyan]");
            this.terminal.print(`Your Echo Blade vibrates and strikes again for ${echoDamage} damage!`);
            this.enemy.takeDamage(echoDamage);
        }

        // Store for Eternal Champion mechanics
        this.character.lastAction = 'attack';
        this.character.lastDamage = result.damage;

        // Chronometer Pendant extra turn
        if (this.character.hasChronoPendant && Math.random() < 0.15 && this.enemy.hp > 0) {
            this.terminal.print("\n[magenta]*** CHRONOMETER PENDANT ACTIVATES! ***[/magenta]");
            this.terminal.print("Time bends to your will, granting you an additional turn!");
            await this.terminal.delay(1000);
            return await this.performAttack();
        }

        return 'continue';
    }

    /**
     * Perform defend action
     */
    performDefend() {
        this.character.defending = true;
        this.terminal.print("\nYou take a defensive stance, preparing to block the next attack!");
        return 'continue';
    }

    /**
     * Use health potion
     */
    usePotion() {
        const healAmount = this.character.usePotion();
        this.terminal.print(`\nYou drink a Health Potion and recover [green]${healAmount}[/green] HP!`);
        this.terminal.print(`You are now at full health: ${this.character.hp}/${this.character.maxHp} HP`);
        return 'continue';
    }

    /**
     * Use superior potion
     */
    useSuperiorPotion() {
        const healAmount = this.character.useSuperiorPotion();
        this.terminal.print(`\nYou drink a Superior Health Potion and recover [green]${healAmount}[/green] HP!`);
        this.terminal.print("Your maximum HP is temporarily increased by 10 for this battle!");
        this.terminal.print(`You are now at full health: ${this.character.hp}/${this.character.maxHp} HP`);
        return 'continue';
    }

    /**
     * Cast a spell
     */
    async castSpell() {
        const available = this.character.getAvailableSpells();

        this.terminal.print("\nAvailable Spells:");
        available.forEach((spell, i) => {
            const spellData = SPELLS[spell];
            this.terminal.print(`  ${i + 1}. ${spell} - ${spellData.description}`);
        });
        this.terminal.print("  b. Back");

        const choice = await this.terminal.prompt();

        if (choice.toLowerCase() === 'b') {
            return await this.playerTurn();
        }

        const idx = parseInt(choice) - 1;
        if (idx < 0 || idx >= available.length) {
            this.terminal.print("Invalid choice.");
            return await this.castSpell();
        }

        const spellName = available[idx];
        const spell = SPELLS[spellName];
        this.character.usedSpells.push(spellName);

        if (spell.type === 'attack') {
            const damage = this.character.attack + spell.damageBonus;
            this.enemy.takeDamage(damage);
            this.terminal.print(`\nYou cast [magenta]${spellName}[/magenta]!`);
            this.terminal.print(`Magical energy hits the ${this.enemy.name} for [red]${damage}[/red] damage!`);
            this.character.lastAction = 'spell';
            this.character.lastSpell = spellName;
            this.character.lastDamage = damage;
        } else if (spell.type === 'heal') {
            const healAmount = this.character.maxHp - this.character.hp;
            this.character.hp = this.character.maxHp;
            this.terminal.print(`\nYou cast [magenta]${spellName}[/magenta]!`);
            this.terminal.print(`Restorative energy heals you for [green]${healAmount}[/green] HP!`);
            this.character.lastAction = 'spell';
            this.character.lastSpell = spellName;
            this.character.lastHealAmount = healAmount;
        } else if (spell.type === 'extraTurn') {
            this.terminal.print(`\nYou cast [magenta]${spellName}[/magenta]!`);
            this.terminal.print("Time freezes as you prepare your next action!");
            this.character.lastAction = 'spell';
            this.character.lastSpell = spellName;
            return await this.playerTurn();
        } else if (spell.type === 'damageAndHeal') {
            const damage = spell.damage;
            this.enemy.takeDamage(damage);
            const healAmount = Math.min(damage, this.character.maxHp - this.character.hp);
            this.character.hp += healAmount;
            this.terminal.print(`\nYou cast [magenta]${spellName}[/magenta]!`);
            this.terminal.print(`Dark tendrils drain ${this.enemy.name} for [red]${damage}[/red] damage!`);
            this.terminal.print(`You heal for [green]${healAmount}[/green] HP!`);
            this.character.lastAction = 'spell';
            this.character.lastSpell = spellName;
            this.character.lastDamage = damage;
        }

        return 'continue';
    }

    /**
     * Enemy's turn
     */
    async enemyTurn() {
        this.terminal.print(`\n[red]${this.enemy.name}'s turn![/red]`);

        // Miss chance
        let missChance = 0.2;
        if (this.enemyType === 'wizard' || this.enemyType === 'lake_monster') {
            missChance = 0.25;
        }

        if (Math.random() < missChance) {
            this.terminal.print(`The ${this.enemy.name} fumbles their attack and misses!`);
            return 'continue';
        }

        // Calculate damage
        let damage = this.enemy.attack + Math.floor(Math.random() * 3) - 1;

        // Boss critical hit
        let isCritical = false;
        if (this.isBossBattle) {
            let critChance = 0.25;
            let critMultiplier = 2.0;

            if (this.enemy.name === "Kraken") {
                critChance = 0.10;
                critMultiplier = 1.5;
            } else if (this.enemy.name === "The Clockmaker") {
                critChance = 0.15;
                critMultiplier = 1.75;
            }

            if (Math.random() < critChance) {
                isCritical = true;
                damage = Math.floor(damage * critMultiplier);
                this.terminal.print(`[critical]CRITICAL HIT![/critical] ${this.enemy.name}'s attack is devastating!`);
            }
        }

        // Apply player defense
        damage = Math.max(1, damage - this.character.getTotalDefense());

        // Defending reduces damage by 50%
        if (this.character.defending) {
            damage = Math.floor(damage / 2);
            this.terminal.print("Your defensive stance reduces the incoming damage!");
            this.character.defending = false;
        }

        // Gear Shield reflection
        if (this.character.hasGearShield && Math.random() < 0.20) {
            const reflectDamage = Math.floor(damage / 2);
            this.terminal.print("\n[cyan]*** GEAR SHIELD ACTIVATES! ***[/cyan]");
            this.terminal.print(`Your Gear Shield reflects ${reflectDamage} damage back at ${this.enemy.name}!`);
            if (this.enemy.takeDamage(reflectDamage)) {
                this.terminal.print(`Your Gear Shield reflection defeated ${this.enemy.name}!`);
                return 'win';
            }
        }

        // Apply damage
        this.terminal.print(`The ${this.enemy.name} attacks you for [red]${damage}[/red] damage!`);
        const isDead = this.character.takeDamage(damage);

        // Gladiator Shield counter
        if (this.character.hasGladiatorShield && Math.random() < 0.25 && !isDead) {
            const counterDamage = Math.floor(damage / 2);
            this.terminal.print("\n[yellow]*** GLADIATOR'S SHIELD COUNTER-ATTACK! ***[/yellow]");
            this.terminal.print(`Your shield strikes back for ${counterDamage} damage!`);
            if (this.enemy.takeDamage(counterDamage)) {
                this.terminal.print(`Your counter-attack defeated ${this.enemy.name}!`);
                return 'win';
            }
        }

        // Ethereal Shield regeneration
        if (this.character.hasEtherealShield && !isDead) {
            const healAmount = Math.min(3, this.character.maxHp - this.character.hp);
            if (healAmount > 0) {
                this.character.hp += healAmount;
                this.terminal.print(`\nYour Ethereal Shield shimmers, restoring [green]${healAmount}[/green] HP!`);
            }
        }

        if (isDead) {
            return 'lose';
        }

        return 'continue';
    }

    /**
     * Handle victory rewards and drops
     */
    async handleVictory() {
        // Show defeated sprite
        this.terminal.showSprite(getDefeatedEnemySprite(this.enemyType), `${this.enemy.name} Defeated`);
        this.terminal.victoryBanner();
        this.terminal.print(`You defeated the [red]${this.enemy.name}[/red]!`);
        await this.terminal.waitForEnter();

        // XP and gold rewards
        this.terminal.print(`You gained ${this.terminal.xpText(this.enemy.xpReward)}!`);
        const levelUps = this.character.gainXp(this.enemy.xpReward);

        // Handle level ups
        for (const levelUp of levelUps) {
            this.terminal.levelUpBanner();
            this.terminal.print(`You are now level [magenta]${levelUp.newLevel}[/magenta]!`);
            this.terminal.print(`HP increased by [green]+${levelUp.hpGain}[/green]`);
            this.terminal.print(`Attack increased by [red]+${levelUp.attackGain}[/red]`);
            this.terminal.print(`Defense increased by [cyan]+${levelUp.defenseGain}[/cyan]`);

            if (levelUp.newSpell) {
                this.terminal.print(`\nYou learned a new spell: [magenta]${levelUp.newSpell.name}[/magenta]!`);
                this.terminal.print(levelUp.newSpell.description);
            }
            await this.terminal.waitForEnter();
        }

        this.character.gold += this.enemy.goldReward;
        this.terminal.print(`You found ${this.terminal.goldText(this.enemy.goldReward)}!`);

        // Handle special item drops
        const specialDrop = SPECIAL_ITEM_DROPS[this.enemyType];
        if (specialDrop) {
            await this.handleSpecialItemDrop(specialDrop);
        }

        // Handle weapon drops
        const weaponDrop = WEAPON_DROPS[this.enemyType];
        if (weaponDrop && !specialDrop) {
            await this.handleWeaponDrop(weaponDrop);
        }

        // Always drop a health potion
        this.character.potions++;
        this.terminal.print("\nYou found a [green]Health Potion[/green]!");
        this.terminal.showSprite(getItemSprite('health_potion'), 'Health Potion');
        await this.terminal.waitForEnter();

        // Handle shark amulet consumption
        if (this.character.sharkAmuletUsed) {
            this.terminal.separator();
            this.terminal.print("[yellow]*** SHARK TOOTH AMULET CONSUMED ***[/yellow]");
            this.terminal.print("The amulet crumbles to dust, its magical power spent.");
            this.terminal.separator();
            this.character.hasSharkAmulet = false;
            this.character.sharkAmuletUsed = false;
            await this.terminal.delay(1500);
        }

        // Temp effect removal message
        const hadTempHp = this.character.resetTempEffects();
        if (hadTempHp) {
            this.terminal.print("\nThe temporary HP boost from your Superior Health Potion has worn off.");
        }

        // Legacy Blade kill tracking
        if (this.character.hasLegacyBlade) {
            this.character.legacyBladeKills++;
            this.terminal.print(`\nYour Legacy Blade absorbs the essence of ${this.enemy.name}!`);
            this.terminal.print(`Legacy Blade power: [green]+${this.character.legacyBladeKills}[/green] damage`);
        }
    }

    /**
     * Handle special item drops
     */
    async handleSpecialItemDrop(drop) {
        this.terminal.print(`\nThe ${this.enemy.name} dropped something special!`);

        // Show appropriate sprite
        if (drop.becomesShield) {
            this.terminal.showSprite(getShieldSprite(drop.becomesShield), drop.name);
        } else if (drop.becomesWeapon) {
            this.terminal.showSprite(getWeaponSprite(drop.becomesWeapon), drop.name);
        } else {
            // Try to find item sprite
            const itemName = drop.name.toLowerCase().replace(/['\s]/g, '_');
            this.terminal.showSprite(getItemSprite(itemName), drop.name);
        }

        this.terminal.print(`\n[yellow]*** SPECIAL ITEM: ${drop.name.toUpperCase()} ***[/yellow]`);
        this.terminal.print(drop.description);
        this.terminal.print(`Effect: [green]${drop.effect}[/green]`);

        this.terminal.print("\nWould you like to equip this item? (yes/no)");
        const choice = await this.terminal.prompt();

        if (choice.toLowerCase().startsWith('y')) {
            // Set the attribute
            this.character[drop.attr] = true;

            if (drop.becomesWeapon) {
                this.character.weapon = drop.becomesWeapon;
                this.terminal.print(`\nYou equipped the ${drop.name} as your weapon!`);
            } else if (drop.becomesShield) {
                this.character.shield = drop.becomesShield;
                this.terminal.print(`\nYou equipped the ${drop.name} as your shield!`);
            } else {
                this.terminal.print(`\nYou equipped the ${drop.name}!`);
            }
        } else {
            this.terminal.print(`\nYou leave the ${drop.name} behind.`);
        }
    }

    /**
     * Handle weapon drops
     */
    async handleWeaponDrop(weaponName) {
        const currentDamage = this.character.getWeaponDamage();
        const newDamage = WEAPON_DAMAGE[weaponName] || 3;

        this.terminal.print(`\nThe ${this.enemy.name} dropped a ${weaponName}!`);
        this.terminal.showSprite(getWeaponSprite(weaponName), weaponName);

        this.terminal.print(`Your current weapon: ${this.character.weapon} (${currentDamage} damage)`);
        this.terminal.print(`New weapon: ${weaponName} (${newDamage} damage)`);

        if (newDamage > currentDamage) {
            this.terminal.print("[green]This weapon is stronger![/green]");
        } else if (newDamage < currentDamage) {
            this.terminal.print("[yellow]This weapon is weaker.[/yellow]");
        }

        this.terminal.print("\nWould you like to:");
        this.terminal.print("1. Take the new weapon");
        this.terminal.print("2. Keep your current weapon");

        const choice = await this.terminal.prompt();

        if (choice === '1') {
            this.character.weapon = weaponName;
            this.terminal.print(`You equip the ${weaponName}!`);
        } else {
            this.terminal.print(`You leave the ${weaponName} behind.`);
        }
    }

    /**
     * Run the battle
     * Returns true if player wins, false if defeated
     */
    async run() {
        // Reset battle state
        this.character.usedSpells = [];

        // Show enemy sprite
        this.terminal.showSprite(getEnemySprite(this.enemyType), this.enemy.name);

        // Boss warning
        if (this.isBossBattle) {
            this.terminal.bossWarning();
            this.terminal.print(`You are facing [red]${this.enemy.name}[/red], a powerful enemy!`);
            this.terminal.print("Be prepared for special attacks!");
        }

        // Show temp boosts
        if (this.character.tempAttackBoost > 0) {
            this.terminal.print(`Your Strength Elixir gives you +${this.character.tempAttackBoost} attack!`);
        }
        if (this.character.tempDefenseBoost > 0) {
            this.terminal.print(`Your Defense Potion gives you +${this.character.tempDefenseBoost} defense!`);
        }

        // Battle loop
        while (true) {
            this.displayStats();

            // Potion reminder
            if (this.character.potions > 0 && this.character.hp < this.character.maxHp * 0.5) {
                this.terminal.print(`[dim]Remember: You have ${this.character.potions} Health Potions.[/dim]`);
            }

            // Player turn
            const playerResult = await this.playerTurn();
            await this.terminal.delay(800);

            if (this.enemy.hp <= 0 || playerResult === 'win') {
                await this.handleVictory();
                return true;
            }

            // Enemy turn
            const enemyResult = await this.enemyTurn();
            await this.terminal.delay(800);

            if (enemyResult === 'win') {
                await this.handleVictory();
                return true;
            }

            if (enemyResult === 'lose') {
                this.terminal.defeatBanner();
                this.terminal.print(`You were defeated by the [red]${this.enemy.name}[/red]!`);
                this.character.resetTempEffects();
                return false;
            }
        }
    }
}
