/**
 * Game - Main game state machine and story flow
 */
import { Character } from './character.js';
import { Battle } from './battle.js';
import { Shop } from './shop.js';
import { SaveMenu } from './saves.js';
import { getLocationSprite } from './constants.js';

/**
 * Main Game class
 */
export class Game {
    constructor(terminal) {
        this.terminal = terminal;
        this.character = null;
        this.saveMenu = new SaveMenu(terminal);
    }

    /**
     * Start the game
     */
    async start() {
        // Show title
        this.terminal.showSprite(getLocationSprite('title_banner'), "The King's Treasure");
        this.terminal.print("\n[bold]Welcome to The King's Treasure![/bold]");
        this.terminal.print("Your mission is to find the missing treasure.\n");

        // Check for saved games
        const loadResult = await this.saveMenu.showLoadMenu();

        if (loadResult) {
            this.character = loadResult.character;
            this.terminal.print(`\nGame loaded! Resuming from ${loadResult.location.replace(/_/g, ' ')}...`);
            await this.terminal.delay(1000);
            return await this.resumeFromLocation(loadResult.location);
        }

        // New game
        await this.terminal.waitForEnter("Press Enter to start a new adventure...");
        this.character = new Character("Hero");
        return await this.thiefsCrossroads();
    }

    /**
     * Resume game from a saved location
     */
    async resumeFromLocation(location) {
        const handlers = {
            'thiefs_crossroads': () => this.thiefsCrossroads(),
            'hidden_passages': () => this.hiddenPassages(),
            'convergence_paths': () => this.convergencePaths(),
            'crystal_palace': () => this.crystalPalace(),
            'volcanic_forge': () => this.volcanicForge(),
            'sunken_ruins': () => this.sunkenRuins(),
            'grand_finale': () => this.grandFinale(),
            'phantom_citadel': () => this.phantomCitadel(),
            'clockwork_nexus': () => this.clockworkNexus(),
            'forgotten_coliseum': () => this.forgottenColiseum()
        };

        const handler = handlers[location];
        if (handler) {
            return await handler();
        }

        this.terminal.print(`Unknown location: ${location}. Starting from crossroads...`);
        return await this.thiefsCrossroads();
    }

    /**
     * Run a battle
     */
    async runBattle(enemyType) {
        const battle = new Battle(this.terminal, this.character, enemyType);
        return await battle.run();
    }

    /**
     * Visit shop
     */
    async visitShop() {
        const shop = new Shop(this.terminal, this.character);
        await shop.visit();
    }

    /**
     * Visit advanced shop
     */
    async visitAdvancedShop() {
        const shop = new Shop(this.terminal, this.character);
        await shop.visitAdvanced();
    }

    /**
     * Game over handler
     */
    async gameOver(message) {
        this.terminal.print(`\n[red]${message}[/red] Game Over!`);
        this.terminal.showSprite(getLocationSprite('game_over'), 'Game Over');
        await this.terminal.delay(2000);

        this.terminal.print("\nPress Enter to play again or type 'quit' to exit:");
        const choice = await this.terminal.prompt();

        if (choice.toLowerCase() === 'quit') {
            this.terminal.print("\nThanks for playing!");
            return false;
        }

        // Reset and restart
        this.character = new Character("Hero");
        return await this.thiefsCrossroads();
    }

    /**
     * Treasure room - victory ending
     */
    async treasureRoom() {
        this.terminal.showSprite(getLocationSprite('treasure'), "King's Treasure");
        this.terminal.print("\n[victory]Congratulations! You found the King's Treasure![/victory]");
        this.terminal.print("The chamber glitters with gold coins, gems, and ancient artifacts.");

        this.terminal.print("\n[bold]Your final adventure stats:[/bold]");
        this.terminal.print(`Level: ${this.character.level}`);
        this.terminal.print(`HP: ${this.character.hp}/${this.character.maxHp}`);
        this.terminal.print(`Gold: ${this.character.gold}`);
        this.terminal.print(`XP: ${this.character.xp}`);
        this.terminal.print(`Weapon: ${this.character.weapon} (${this.character.getWeaponDamage()} damage)`);
        this.terminal.print(`Shield: ${this.character.shield} (${this.character.getShieldDefense()} defense)`);
        this.terminal.print(`Health Potions: ${this.character.potions}`);
        this.terminal.print(`Spells: ${this.character.spells.join(', ') || 'None'}`);

        const items = this.character.getSpecialItems();
        if (items.length > 0) {
            this.terminal.print(`Special Items: ${items.join(', ')}`);
        }

        this.terminal.print("\nWould you like to play again? (yes/no)");
        const choice = await this.terminal.prompt();

        if (choice.toLowerCase().startsWith('y')) {
            this.character = new Character("Hero");
            this.terminal.print("\nStarting a new adventure...");
            return await this.thiefsCrossroads();
        }

        this.terminal.print("\n[bold]Thanks for playing! Goodbye![/bold]");
        return true;
    }

    // ==========================================================================
    // STORY LOCATIONS
    // ==========================================================================

    /**
     * Starting location - Thief's Crossroads
     */
    async thiefsCrossroads() {
        this.terminal.showSprite(getLocationSprite('thiefs_crossroads'), "Thief's Crossroads");
        this.terminal.print("\nYou've reached [cyan]The Thief's Crossroads[/cyan]. Where do you want to go?");
        this.terminal.print("Type 'left' or 'right'");

        const direction = await this.terminal.prompt();

        // Secret shortcut
        if (direction.toLowerCase() === 'p') {
            return await this.grandFinale();
        }

        if (direction.toLowerCase() === 'left' || direction.toLowerCase() === 'l') {
            return await this.lakePath();
        } else if (direction.toLowerCase() === 'right' || direction.toLowerCase() === 'r') {
            return await this.mountainPath();
        } else {
            this.terminal.print("\n[red]Your hesitation allows hidden traps to activate![/red]");
            return await this.gameOver("Your hesitation allows hidden traps to activate!");
        }
    }

    /**
     * Lake path
     */
    async lakePath() {
        this.terminal.showSprite(getLocationSprite('lake'), 'The Lake');
        this.terminal.print("\nYou arrive at a vast lake. There's a boat tied to a dock.");
        this.terminal.print("Type 'swim' (s) to swim across or 'take' (t) to take the boat.");

        const choice = await this.terminal.prompt();

        if (choice.toLowerCase() === 'swim' || choice.toLowerCase() === 's') {
            this.terminal.print("\nAs you swim across the lake, a ferocious shark appears!");
            if (!await this.runBattle('shark')) {
                return await this.gameOver("You were defeated by the Ferocious Shark!");
            }
            this.terminal.print("\nAfter defeating the shark, you reach the other side of the lake.");
        } else if (choice.toLowerCase() === 'take' || choice.toLowerCase() === 't') {
            this.terminal.print("\nAs you row across the lake, a terrifying lake monster emerges from the depths!");
            if (!await this.runBattle('lake_monster')) {
                return await this.gameOver("You were dragged underwater by the Lake Monster!");
            }
            this.terminal.print("\nAfter defeating the lake monster, the boat takes you safely across.");
        } else {
            return await this.thiefsCrossroads();
        }

        this.terminal.print("In the distance, you can see a large castle.");
        return await this.castle();
    }

    /**
     * Mountain path
     */
    async mountainPath() {
        this.terminal.print("\nYou climb the steep mountain path...");

        if (Math.random() < 0.5) {
            this.terminal.print("\nYou encounter an evil wizard blocking your path!");
            if (!await this.runBattle('wizard')) {
                return await this.gameOver("You were defeated in battle!");
            }
        } else {
            this.terminal.print("\nA group of skeleton bandits ambushes you from behind the rocks!");
            if (!await this.runBattle('skeleton_bandits')) {
                return await this.gameOver("You were defeated in battle!");
            }
        }

        this.terminal.print("\nAfter your victory, you continue along the path and see a castle in the distance.");
        return await this.castle();
    }

    /**
     * Castle
     */
    async castle() {
        this.terminal.showSprite(getLocationSprite('castle'), 'The Castle');
        this.terminal.print("\nYou approach the castle. There are two doors:");
        this.terminal.print("A [red]red door[/red] and a [blue]blue door[/blue].");
        this.terminal.print("Which door do you choose? (red/blue)");

        const choice = await this.terminal.prompt();

        if (choice.toLowerCase() === 'red' || choice.toLowerCase() === 'r') {
            this.terminal.print("\nBehind the red door, you find a savage bear rider guarding the passage!");
            if (!await this.runBattle('bear_rider')) {
                return await this.gameOver("You were defeated by the bear rider!");
            }
        } else if (choice.toLowerCase() === 'blue' || choice.toLowerCase() === 'b') {
            this.terminal.print("\nAs you open the blue door, a fearsome dragon knight challenges you!");
            if (!await this.runBattle('dragon_knight')) {
                return await this.gameOver("You were defeated by the dragon knight!");
            }
        } else {
            this.terminal.print("\n[red]Your indecision costs you dearly. The guardians attack together![/red]");
            return await this.gameOver("Your indecision costs you dearly!");
        }

        // Shop after defeating castle guardian
        this.terminal.print("\nAfter your victory, you notice a merchant's stall nearby.");
        this.terminal.print("Perhaps you should see what they're selling before continuing.");
        await this.visitShop();

        // Offer save
        await this.saveMenu.offerSave(this.character, 'hidden_passages');

        this.terminal.print("\nRested and restocked, you discover a hidden passage.");
        this.terminal.print("The passage splits into two dark corridors...");
        return await this.hiddenPassages();
    }

    /**
     * Hidden Passages
     */
    async hiddenPassages() {
        this.terminal.showSprite(getLocationSprite('hidden_passages'), 'Hidden Passages');
        this.terminal.print("\n== THE HIDDEN PASSAGES ==");
        this.terminal.print("You've discovered secret paths within the castle!");
        this.terminal.print("1. Take the left path (Ancient Caverns)");
        this.terminal.print("2. Take the right path (Forgotten Temple)");

        while (true) {
            const choice = await this.terminal.prompt();

            if (choice === '1') {
                this.terminal.showSprite(getLocationSprite('ancient_caverns'), 'Ancient Caverns');
                this.terminal.print("\nYou enter the Ancient Caverns, where the walls glisten with strange crystals.");
                await this.terminal.waitForEnter();

                if (Math.random() < 0.5) {
                    this.terminal.print("\nA massive figure emerges from the shadows...");
                    if (!await this.runBattle('stone_golem')) {
                        return await this.gameOver("You were defeated in the Ancient Caverns!");
                    }
                } else {
                    this.terminal.print("\nSomething scuttles across the ceiling...");
                    if (!await this.runBattle('giant_spider')) {
                        return await this.gameOver("You were defeated in the Ancient Caverns!");
                    }
                }
                break;
            } else if (choice === '2') {
                this.terminal.showSprite(getLocationSprite('forgotten_temple'), 'Forgotten Temple');
                this.terminal.print("\nYou step into the Forgotten Temple, lined with ancient statues and symbols.");
                await this.terminal.waitForEnter();

                if (Math.random() < 0.5) {
                    this.terminal.print("\nOne of the statues begins to move...");
                    if (!await this.runBattle('ancient_guardian')) {
                        return await this.gameOver("You were defeated in the Forgotten Temple!");
                    }
                } else {
                    this.terminal.print("\nA sarcophagus creaks open...");
                    if (!await this.runBattle('cursed_mummy')) {
                        return await this.gameOver("You were defeated in the Forgotten Temple!");
                    }
                }
                break;
            } else {
                this.terminal.print("Please choose path 1 or 2.");
            }
        }

        await this.saveMenu.offerSave(this.character, 'convergence_paths');
        this.terminal.print("\nAfter your challenging battle, you discover a massive gate that leads to three ornate doorways.");
        return await this.convergencePaths();
    }

    /**
     * Convergence Paths - three doorways
     */
    async convergencePaths() {
        this.terminal.showSprite(getLocationSprite('three_doors'), 'Three Doors');
        this.terminal.print("\nEach doorway seems to lead to a different realm:");
        this.terminal.print("\n1. A doorway encrusted with [cyan]glowing crystals[/cyan]");
        this.terminal.print("2. A doorway radiating [red]intense heat[/red]");
        this.terminal.print("3. A doorway with [blue]water flowing[/blue] around its frame");

        while (true) {
            this.terminal.print("\nWhich doorway will you choose? (1/2/3)");
            const choice = await this.terminal.prompt();

            let result;
            if (choice === '1') {
                result = await this.crystalPalace();
            } else if (choice === '2') {
                result = await this.volcanicForge();
            } else if (choice === '3') {
                result = await this.sunkenRuins();
            } else {
                this.terminal.print("Please choose a doorway (1-3).");
                continue;
            }

            if (result === true) {
                await this.saveMenu.offerSave(this.character, 'grand_finale');
                return await this.grandFinale();
            }
            return result;
        }
    }

    /**
     * Crystal Palace
     */
    async crystalPalace() {
        this.terminal.showSprite(getLocationSprite('crystal_palace'), 'Crystal Palace');
        this.terminal.print("\n=== THE CRYSTAL PALACE ===");
        this.terminal.print("You step through the doorway into a magnificent palace made entirely of glowing crystals.");
        this.terminal.print("The walls shimmer with magical energy, and strange crystalline creatures roam the halls.");
        await this.terminal.waitForEnter();

        this.terminal.print("\nAs you advance, a Crystal Guardian blocks your path!");
        if (!await this.runBattle('crystal_guardian')) {
            return await this.gameOver("You were shattered by the Crystal Guardian!");
        }

        this.terminal.print("\nDeeper into the palace, you find yourself in the throne room.");
        this.terminal.print("The Crystal Queen rises from her throne, shards of crystal floating around her.");
        if (!await this.runBattle('crystal_queen')) {
            return await this.gameOver("The Crystal Queen has frozen you into crystal!");
        }

        this.terminal.print("\nAfter defeating the Crystal Queen, you find a strange portal behind her throne.");
        this.terminal.print("You step through and find yourself in a new chamber of challenges...");
        return true;
    }

    /**
     * Volcanic Forge
     */
    async volcanicForge() {
        this.terminal.showSprite(getLocationSprite('volcanic_forge'), 'Volcanic Forge');
        this.terminal.print("\n=== THE VOLCANIC FORGE ===");
        this.terminal.print("Heat blasts you as you step through the doorway into a scorching forge.");
        this.terminal.print("Rivers of lava flow through channels, and the air is thick with smoke and ash.");
        await this.terminal.waitForEnter();

        this.terminal.print("\nA Fire Elemental forms from the flames and attacks!");
        if (!await this.runBattle('fire_elemental')) {
            return await this.gameOver("You were consumed by the flames!");
        }

        this.terminal.print("\nAt the heart of the forge, you find the legendary Forge Master at work.");
        this.terminal.print("He turns to face you, wielding a hammer of pure flame.");
        if (!await this.runBattle('forge_master')) {
            return await this.gameOver("The Forge Master has hammered you into oblivion!");
        }

        this.terminal.print("\nAs the Forge Master falls, a hidden door opens in the wall of the forge.");
        this.terminal.print("You step through, ready to face whatever challenges lie ahead...");
        return true;
    }

    /**
     * Sunken Ruins
     */
    async sunkenRuins() {
        this.terminal.showSprite(getLocationSprite('sunken_ruins'), 'Sunken Ruins');
        this.terminal.print("\n=== THE SUNKEN RUINS ===");
        this.terminal.print("You step through and find yourself in ancient ruins, protected by a magical air bubble underwater.");
        this.terminal.print("Strange aquatic creatures have made this place their home.");
        await this.terminal.waitForEnter();

        this.terminal.print("\nA Merfolk Warrior swims toward you, trident raised!");
        if (!await this.runBattle('merfolk_warrior')) {
            return await this.gameOver("You were impaled by the Merfolk Warrior's trident!");
        }

        this.terminal.print("\nIn the central chamber of the ruins, you disturb a massive Kraken!");
        this.terminal.print("Its tentacles thrash as it rises to attack!");
        if (!await this.runBattle('kraken')) {
            return await this.gameOver("The Kraken has dragged you into the depths!");
        }

        this.terminal.print("\nWith the Kraken defeated, you discover a strange whirlpool at the back of the chamber.");
        this.terminal.print("You step into the whirlpool and are transported to a new realm...");
        return true;
    }

    /**
     * Grand Finale - three portals
     */
    async grandFinale() {
        this.terminal.showSprite(getLocationSprite('three_portals'), 'Portals of Mystery');
        this.terminal.print("\n=== THE PORTALS OF MYSTERY ===");
        this.terminal.print("You barely made it out alive, only to find yourself standing before three mysterious portals.");
        this.terminal.print("\nThree grand portals stand before you, each with a unique marking:");
        this.terminal.print("1. A portal shrouded in [dim]ghostly mist[/dim]");
        this.terminal.print("2. A portal with [yellow]turning gears[/yellow] and ticking sounds");
        this.terminal.print("3. A portal adorned with [red]ancient weapons[/red]");

        while (true) {
            this.terminal.print("\nWhich portal will you choose? (1/2/3)");
            const choice = await this.terminal.prompt();

            if (choice === '1') {
                return await this.phantomCitadel();
            } else if (choice === '2') {
                return await this.clockworkNexus();
            } else if (choice === '3') {
                return await this.forgottenColiseum();
            } else {
                this.terminal.print("Please choose a portal (1-3).");
            }
        }
    }

    /**
     * Phantom Citadel
     */
    async phantomCitadel() {
        this.terminal.showSprite(getLocationSprite('phantom_citadel'), 'Phantom Citadel');
        this.terminal.print("\n=== THE PHANTOM CITADEL ===");
        this.terminal.print("You step through the misty doorway into a ghostly fortress floating in a void.");
        this.terminal.print("Spectral entities drift through the halls, and the walls seem to shift and change.");
        await this.terminal.waitForEnter();

        this.terminal.print("\nA Spectral Sentinel materializes before you, blocking your path!");
        if (!await this.runBattle('spectral_sentinel')) {
            return await this.gameOver("You were consumed by spectral energy!");
        }

        // Advanced shop
        this.terminal.print("\nAs the Spectral Sentinel fades away, you notice a mysterious merchant appear in the mist.");
        this.terminal.print("'Impressive,' the merchant says. 'Perhaps you'll find these wares useful for the challenges ahead.'");
        await this.visitAdvancedShop();

        this.terminal.print("\nAs you venture deeper into the citadel, you encounter a Phantom Knight guarding the inner chamber.");
        if (!await this.runBattle('phantom_knight')) {
            return await this.gameOver("The Phantom Knight has claimed your soul!");
        }

        this.terminal.print("\nAt the heart of the citadel stands the Lord of Echoes, beckoning you to your demise.");
        this.terminal.print("As you approach, countless voices whisper from within its form.");
        if (!await this.runBattle('lord_of_echoes')) {
            return await this.gameOver("The Lord of Echoes has erased your existence!");
        }

        this.terminal.print("\nWith the Lord of Echoes defeated, the citadel begins to fade away.");
        this.terminal.print("As the spectral walls dissolve, you see the treasure chamber beyond!");
        return await this.treasureRoom();
    }

    /**
     * Clockwork Nexus
     */
    async clockworkNexus() {
        this.terminal.showSprite(getLocationSprite('clockwork_nexus'), 'Clockwork Nexus');
        this.terminal.print("\n=== THE CLOCKWORK NEXUS ===");
        this.terminal.print("You step through the gear-framed doorway into a massive mechanical construct.");
        this.terminal.print("Countless gears and clockwork mechanisms tick and whir all around you.");
        await this.terminal.waitForEnter();

        this.terminal.print("\nAn Automaton Soldier activates and marches toward you!");
        if (!await this.runBattle('automaton_soldier')) {
            return await this.gameOver("You were dismantled by the Automaton Soldier!");
        }

        // Advanced shop
        this.terminal.print("\nAs the Automaton Soldier collapses, a panel in the wall slides open to reveal a merchant.");
        this.terminal.print("'Right on schedule,' the merchant says, checking a pocket watch. 'Care to browse my wares?'");
        await this.visitAdvancedShop();

        this.terminal.print("\nDeeper in the nexus, you encounter a Clockmaker monitoring a wall of clocks.");
        if (!await this.runBattle('time_warden')) {
            return await this.gameOver("The Clockmaker has erased you from history!");
        }

        this.terminal.print("\nAt the center of the nexus, the Time Warden adjusts the grand mechanism.");
        this.terminal.print("As you approach, time itself seems to stutter and skip around you.");
        if (!await this.runBattle('clockmaker')) {
            return await this.gameOver("The Time Warden has wound back your time to nothingness!");
        }

        this.terminal.print("\nWith the Time Warden defeated, the grand mechanism begins to open.");
        this.terminal.print("The gears align to reveal a hidden passage to the treasure chamber!");
        return await this.treasureRoom();
    }

    /**
     * Forgotten Coliseum
     */
    async forgottenColiseum() {
        this.terminal.showSprite(getLocationSprite('forgotten_coliseum'), 'Forgotten Coliseum');
        this.terminal.print("\n=== THE FORGOTTEN COLISEUM ===");
        this.terminal.print("You step through the weapon-adorned doorway into an ancient arena.");
        this.terminal.print("The stands are filled with ghostly spectators, cheering and jeering.");
        await this.terminal.waitForEnter();

        this.terminal.print("\nA Gladiator Shade challenges you to combat in the arena!");
        if (!await this.runBattle('gladiator_shade')) {
            return await this.gameOver("You were slain in glorious combat by the Gladiator Shade!");
        }

        // Advanced shop
        this.terminal.print("\nAfter your victory over the Gladiator Shade, the crowd roars and a merchant emerges.");
        this.terminal.print("'Well fought, champion!' the merchant calls. 'Perhaps some of my wares will aid your next battle.'");
        await this.visitAdvancedShop();

        this.terminal.print("\nAs you finish your business, the Arena Master descends to test your skill!");
        if (!await this.runBattle('arena_master')) {
            return await this.gameOver("The Arena Master has proven your unworthiness!");
        }

        this.terminal.print("\nThe crowd roars as The Eternal Champion emerges for the final match.");
        this.terminal.print("Legends say it has never known defeat in thousands of years of combat.");
        if (!await this.runBattle('eternal_champion')) {
            return await this.gameOver("The Eternal Champion remains undefeated. Your journey ends here!");
        }

        this.terminal.print("\nAs you defeat The Eternal Champion, the spectral crowd erupts in cheers.");
        this.terminal.print("A great door opens at the far end of the arena, revealing the treasure chamber!");
        return await this.treasureRoom();
    }
}
