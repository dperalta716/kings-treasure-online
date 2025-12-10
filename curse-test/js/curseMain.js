/**
 * Curse Test - Main entry point
 * Initializes the test environment and runs the battle sequence
 */

import { Terminal } from '../../js/terminal.js';
import { Character } from '../../js/character.js';
import { Companion } from './companion.js';
import { GroupBattle } from './groupBattle.js';
import { CurseSidebar } from './curseSidebar.js';
import { BATTLE_SEQUENCE } from './curseConstants.js';

/**
 * Create a pre-configured test character
 * Level 4 Warrior with endgame gear
 */
function createTestCharacter() {
    const character = new Character("Hero");
    character.initializeClass('male', 'warrior');

    // Level 4 stats
    character.level = 4;
    character.baseMaxHp = 65;
    character.maxHp = 65;
    character.hp = 65;
    character.attack = 12;
    character.defense = 5;  // Level 4 warrior base defense

    // Endgame gear
    character.weapon = "Legacy Blade";
    character.shield = "Gladiator's Shield";
    character.hasLegacyBlade = true;
    character.hasGladiatorShield = true;
    character.legacyBladeKills = 5;  // +5 damage from kills

    // Spells (including boss drops)
    character.spells = ['Arcane Blast', 'Energy Surge', 'Astral Strike', 'Thunderbolt', 'Time Freeze'];

    // Inventory
    character.potions = 3;
    character.superiorPotions = 2;
    character.gold = 200;

    return character;
}

/**
 * Main curse test game class
 */
class CurseTest {
    constructor() {
        // Initialize terminal
        const outputEl = document.getElementById('output');
        const inputEl = document.getElementById('command-input');
        const spriteEl = document.getElementById('current-sprite');
        const spriteLabelEl = document.getElementById('sprite-label');

        this.terminal = new Terminal(outputEl, inputEl, spriteEl, spriteLabelEl);
        this.curseSidebar = new CurseSidebar();

        this.character = null;
        this.companion = null;
        this.currentBattle = 0;
        this.curseTurnCount = 0;  // Persists between battles
    }

    /**
     * Initialize the test
     */
    async init() {
        // Create test character first (needed for sidebar)
        this.character = createTestCharacter();
        this.terminal.sidebar.updateHero(this.character);

        // Show the cursed warrior intro image
        this.terminal.showSprite('../assets/sprites/Kings Curse/characters/cursed_warrior_intro.webp', '');

        this.terminal.print("[bold]═══════════════════════════════════════════════════════════[/bold]");
        this.terminal.print("[magenta][bold]              THE KING'S CURSE[/bold][/magenta]");
        this.terminal.print("[bold]═══════════════════════════════════════════════════════════[/bold]");
        this.terminal.print("");
        this.terminal.print("[purple]A searing pain tears through your body.[/purple]");
        this.terminal.print("");
        this.terminal.print("Purple veins crawl beneath your skin as an ancient");
        this.terminal.print("curse takes hold. You fall to your knees, crying out");
        this.terminal.print("in agony as corruption spreads through your flesh.");
        this.terminal.print("");
        this.terminal.print("[dim]The curse will consume you... unless you find the source.[/dim]");
        this.terminal.print("");

        await this.terminal.waitForEnter("Press Enter to continue...");

        // Fade to black, then to the first battle
        const firstBattle = BATTLE_SEQUENCE[0];
        await this.terminal.slowFadeSprite(firstBattle.sprite, firstBattle.name, 2000);

        this.terminal.clear();
        this.terminal.print("[bold]═══════════════════════════════════════════════════════════[/bold]");
        this.terminal.print("[magenta][bold]        THE KING'S CURSE - BATTLE TEST MODE[/bold][/magenta]");
        this.terminal.print("[bold]═══════════════════════════════════════════════════════════[/bold]");
        this.terminal.print("");

        this.terminal.print("[bold]Your Character:[/bold]");
        this.terminal.print(`  Level ${this.character.level} Warrior`);
        this.terminal.print(`  HP: ${this.character.hp}/${this.character.maxHp}`);
        this.terminal.print(`  Weapon: ${this.character.weapon} (+${this.character.legacyBladeKills} Legacy)`);
        this.terminal.print(`  Shield: ${this.character.shield}`);
        this.terminal.print(`  Spells: ${this.character.spells.join(', ')}`);
        this.terminal.print("");

        // Run battle sequence (companion chosen after battle 2)
        await this.runBattleSequence();
    }

    /**
     * Let player choose their companion
     */
    async chooseCompanion() {
        this.terminal.print("[bold]Choose your companion:[/bold]");
        this.terminal.print("");
        this.terminal.print("  [cyan]1. Kira, the Wounded Healer[/cyan]");
        this.terminal.print("     Role: Healer");
        this.terminal.print("     HP: 55 | ATK: 12 | DEF: 4");
        this.terminal.print("     Abilities: Healing Touch (25 HP), Strike");
        this.terminal.print("");
        this.terminal.print("  [yellow]2. Auren, the Fallen Angel[/yellow]");
        this.terminal.print("     Role: Angel");
        this.terminal.print("     HP: 70 | ATK: 15 | DEF: 7");
        this.terminal.print("     Abilities: Smite, Divine Shield");
        this.terminal.print("");

        while (true) {
            const choice = await this.terminal.prompt();

            if (choice === '1') {
                this.companion = new Companion('kira');
                this.terminal.print(`\n[cyan]Kira joins your side![/cyan]`);
                this.terminal.print('"Together, we will find the cure."');
                break;
            } else if (choice === '2') {
                this.companion = new Companion('auren');
                this.terminal.print(`\n[yellow]Auren joins your side![/yellow]`);
                this.terminal.print('"I will protect you with my life."');
                break;
            } else {
                this.terminal.print("Please choose 1 or 2.");
            }
        }

        this.curseSidebar.updateCompanion(this.companion);
        await this.terminal.waitForEnter();
    }

    /**
     * Run through all battles in sequence
     */
    async runBattleSequence() {
        for (let i = 0; i < BATTLE_SEQUENCE.length; i++) {
            const battleInfo = BATTLE_SEQUENCE[i];
            this.currentBattle = i + 1;

            // After battle 2 (Rescue), choose companion
            if (i === 2 && !this.companion) {
                await this.chooseCompanion();
            }

            // Before battle 10 (Wraith Self), companion leaves
            if (battleInfo.companionLeaves && this.companion) {
                await this.companionLeavesScene();
            }

            this.terminal.print("");
            this.terminal.print("[bold]═══════════════════════════════════════════════════════════[/bold]");
            this.terminal.print(`[bold]BATTLE ${this.currentBattle}/${BATTLE_SEQUENCE.length}: ${battleInfo.name}[/bold]`);
            this.terminal.print("[bold]═══════════════════════════════════════════════════════════[/bold]");
            this.terminal.print(battleInfo.description);

            // Show battle format
            const format = battleInfo.isSolo ? "[yellow](SOLO)[/yellow]" : "[cyan](With Companion)[/cyan]";
            this.terminal.print(`Enemies: ${battleInfo.enemies.length} ${format}`);
            await this.terminal.waitForEnter("Press Enter to begin battle...");

            // Run the battle (pass null companion for solo battles)
            const companionForBattle = battleInfo.isSolo ? null : this.companion;
            const battle = new GroupBattle(
                this.terminal,
                this.character,
                companionForBattle,
                battleInfo.enemies,
                this.curseSidebar,
                battleInfo.sprite || null,
                battleInfo.battleSprite || null,
                this.curseTurnCount  // Pass persistent turn count
            );

            const result = await battle.run();
            const victory = result.victory;
            this.curseTurnCount = result.turnCount;  // Save turn count for next battle

            if (!victory) {
                this.terminal.print("\n[red][bold]GAME OVER[/bold][/red]");
                this.terminal.print(`You made it through ${i} of ${BATTLE_SEQUENCE.length} battles.`);
                this.terminal.print("\nRefresh the page to try again.");
                return;
            }

            // Handle drops
            await this.handleDrops(battleInfo);

            // Heal between battles
            const healAmount = 20;
            const healed = Math.min(healAmount, this.character.maxHp - this.character.hp);
            this.character.hp += healed;
            if (healed > 0) {
                this.terminal.print(`\n[dim]You rest briefly and recover ${healed} HP.[/dim]`);
            }

            // Companion heals between battles too (15 HP)
            if (this.companion && this.companion.isConscious && !battleInfo.isSolo) {
                const companionHealAmount = 15;
                const companionHealed = Math.min(companionHealAmount, this.companion.maxHp - this.companion.hp);
                this.companion.hp += companionHealed;
                if (companionHealed > 0) {
                    this.terminal.print(`[dim]${this.companion.name} recovers ${companionHealed} HP.[/dim]`);
                }
            }

            this.terminal.sidebar.updateHero(this.character);
            if (this.companion && !battleInfo.isSolo) {
                this.curseSidebar.updateCompanion(this.companion);
            }
        }

        // Victory!
        await this.showVictory();
    }

    /**
     * Companion leaves before final solo battles
     */
    async companionLeavesScene() {
        this.terminal.print("");
        this.terminal.print("[bold]═══════════════════════════════════════════════════════════[/bold]");
        this.terminal.print("[yellow][bold]\"You must face this alone.\"[/bold][/yellow]");
        this.terminal.print("[bold]═══════════════════════════════════════════════════════════[/bold]");
        this.terminal.print("");
        this.terminal.print(`${this.companion.name} stops at the threshold of the void.`);
        this.terminal.print("");

        if (this.companion.type === 'kira') {
            this.terminal.print(`[cyan]"${this.character.name}... I cannot follow where you must go.`);
            this.terminal.print(`The curse within me would only make things worse.`);
            this.terminal.print(`You must face your darkness alone. I believe in you."[/cyan]`);
        } else {
            this.terminal.print(`[yellow]"${this.character.name}... This is your battle now.`);
            this.terminal.print(`The void rejects my light. I cannot protect you here.`);
            this.terminal.print(`Face what you must become, and destroy it."[/yellow]`);
        }

        this.terminal.print("");
        this.curseSidebar.hideCombat();
        await this.terminal.waitForEnter();
    }

    /**
     * Handle battle drops
     */
    async handleDrops(battleInfo) {
        if (!battleInfo.drops) return;

        this.terminal.print("\n[bold]Rewards:[/bold]");

        // Potion drops
        if (battleInfo.drops.potion === 'health') {
            this.character.potions++;
            this.terminal.print("  Found: [green]Health Potion[/green]");
        } else if (battleInfo.drops.potion === 'superior') {
            this.character.superiorPotions++;
            this.terminal.print("  Found: [magenta]Superior Health Potion[/magenta]");
        }

        // Weapon drops
        if (battleInfo.drops.weapon) {
            const weaponData = this.getWeaponData(battleInfo.drops.weapon);
            if (weaponData) {
                this.character.weapon = weaponData.name;
                this.terminal.print(`  Found: [red]${weaponData.name}[/red] (Damage: ${weaponData.damage})`);
            }
        }

        // Shield drops
        if (battleInfo.drops.shield) {
            const shieldData = this.getShieldData(battleInfo.drops.shield);
            if (shieldData) {
                this.character.shield = shieldData.name;
                this.terminal.print(`  Found: [cyan]${shieldData.name}[/cyan] (Defense: ${shieldData.defense})`);
            }
        }

        // Other item drops (actually add to inventory)
        if (battleInfo.drops.item) {
            const itemName = this.formatItemName(battleInfo.drops.item);
            this.terminal.print(`  Found: [yellow]${itemName}[/yellow]`);

            // Add item to inventory
            switch (battleInfo.drops.item) {
                case 'strength_elixir':
                    this.character.strengthElixirs++;
                    break;
                case 'defense_potion':
                    this.character.defenseElixirs++;
                    break;
                case 'master_strength_elixir':
                    this.character.masterStrengthElixirs++;
                    break;
                case 'ultimate_defense_potion':
                    this.character.ultimateDefensePotions++;
                    break;
            }
        }

        this.terminal.sidebar.updateHero(this.character);
    }

    /**
     * Get weapon data from constants
     */
    getWeaponData(weaponKey) {
        const weapons = {
            'curse_reaver': { name: "Curse Reaver", damage: 16 },
            'shadows_edge': { name: "Shadow's Edge", damage: 18 },
            'soul_render': { name: "Soul Render", damage: 20 }
        };
        return weapons[weaponKey];
    }

    /**
     * Get shield data from constants
     */
    getShieldData(shieldKey) {
        const shields = {
            'void_touched_shield': { name: "Void-Touched Shield", defense: 6 },
            'wardens_barrier': { name: "Warden's Barrier", defense: 7 },
            'celestial_shield': { name: "Celestial Shield", defense: 8 }
        };
        return shields[shieldKey];
    }

    /**
     * Format item name for display
     */
    formatItemName(itemKey) {
        const names = {
            'strength_elixir': 'Strength Elixir',
            'defense_potion': 'Defense Potion'
        };
        return names[itemKey] || itemKey;
    }

    /**
     * Show final victory
     */
    async showVictory() {
        this.terminal.print("");
        this.terminal.print("[bold]═══════════════════════════════════════════════════════════[/bold]");
        this.terminal.print("[victory][bold]        CURSE BROKEN! YOU WIN![/bold][/victory]");
        this.terminal.print("[bold]═══════════════════════════════════════════════════════════[/bold]");
        this.terminal.print("");
        this.terminal.print("You have defeated all enemies and broken the curse!");
        this.terminal.print("");
        this.terminal.print("[bold]Final Stats:[/bold]");
        this.terminal.print(`  Level: ${this.character.level}`);
        this.terminal.print(`  HP: ${this.character.hp}/${this.character.maxHp}`);
        this.terminal.print(`  Gold: ${this.character.gold}`);
        if (this.companion) {
            this.terminal.print(`  Companion: ${this.companion.name} (${this.companion.hp}/${this.companion.maxHp} HP)`);
        }
        this.terminal.print("");
        this.terminal.print("[dim]Battle skeleton test complete![/dim]");
        this.terminal.print("[dim]Refresh the page to play again.[/dim]");
    }
}

// Start the test when page loads
window.addEventListener('DOMContentLoaded', async () => {
    const test = new CurseTest();
    await test.init();
});
