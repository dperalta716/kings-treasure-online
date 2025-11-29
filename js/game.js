/**
 * Game - Main game state machine and story flow
 */
import { Character } from './character.js';
import { Battle } from './battle.js';
import { Shop } from './shop.js';
import { SaveMenu } from './saves.js';
import { getLocationSprite, CHARACTER_CLASSES, getCharacterSprite } from './constants.js';

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
     * Update sidebar with current character state
     */
    updateSidebar() {
        if (this.character) {
            this.terminal.sidebar.updateHero(this.character);
        }
    }

    /**
     * Character creation - gender and class selection
     */
    async characterCreation() {
        // Step 1: Gender Selection
        this.terminal.showSprite(getCharacterSprite('gender_selection'), 'Choose Your Hero');
        this.terminal.print("\n[bold]Choose Your Hero[/bold]\n");
        this.terminal.print("  1. Male");
        this.terminal.print("  2. Female");

        let gender = null;
        while (!gender) {
            const input = await this.terminal.prompt();
            if (input === '1') {
                gender = 'male';
            } else if (input === '2') {
                gender = 'female';
            } else {
                this.terminal.print("Please type 1 or 2.");
            }
        }

        // Step 2: Class Selection with preview cycling
        let previewClass = 'warrior';
        this.terminal.showSprite(getCharacterSprite(`${gender}_warrior`), 'Warrior');

        this.terminal.print("\n[bold]Choose Your Path[/bold]");
        this.terminal.print("[dim](Use arrows or type 1-3 to preview, Enter to confirm)[/dim]\n");
        this.terminal.print("1. [red]WARRIOR[/red] - A battle-hardened soldier");
        this.terminal.print("   HP: 30 | ATK: 5 | DEF: 2");
        this.terminal.print("\n2. [magenta]MAGE[/magenta] - A wielder of arcane power");
        this.terminal.print("   HP: 25 | ATK: 6 | DEF: 1 | +25% spell damage, Mana Bolt");
        this.terminal.print("\n3. [cyan]ROGUE[/cyan] - A cunning critical striker");
        this.terminal.print("   HP: 28 | ATK: 5 | DEF: 1 | 35% critical hit chance");

        const classMap = { '1': 'warrior', '2': 'mage', '3': 'rogue' };
        const classNames = { 'warrior': 'Warrior', 'mage': 'Mage', 'rogue': 'Rogue' };
        const classList = ['warrior', 'mage', 'rogue'];
        let classIndex = 0;

        while (true) {
            const input = await this.terminal.prompt();
            if (classMap[input]) {
                previewClass = classMap[input];
                classIndex = classList.indexOf(previewClass);
                this.terminal.showSprite(getCharacterSprite(`${gender}_${previewClass}`), classNames[previewClass]);
            } else if (input === '__UP__' || input === '__DOWN__') {
                // Arrow key navigation
                if (input === '__UP__') {
                    classIndex = (classIndex - 1 + classList.length) % classList.length;
                } else {
                    classIndex = (classIndex + 1) % classList.length;
                }
                previewClass = classList[classIndex];
                this.terminal.showSprite(getCharacterSprite(`${gender}_${previewClass}`), classNames[previewClass]);
            } else if (input === '') {
                // Enter confirms current preview
                break;
            }
        }

        // Create and initialize character
        this.character = new Character("Hero");
        this.character.initializeClass(gender, previewClass);

        const classData = CHARACTER_CLASSES[previewClass];
        this.terminal.print(`\n[bold]You are a ${classData.name}![/bold]`);
        this.terminal.print(classData.description);

        if (previewClass === 'mage') {
            this.terminal.print("\n[cyan]You start with the Mana Bolt spell![/cyan]");
        } else if (previewClass === 'rogue') {
            this.terminal.print("\n[cyan]Your critical hit chance is 35%![/cyan]");
        }

        this.terminal.print("\nPress Enter to begin your adventure...", 'dim');
        await this.terminal.prompt();
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
            this.updateSidebar();
            this.terminal.print(`\nGame loaded! Resuming from ${loadResult.location.replace(/_/g, ' ')}...`);
            await this.terminal.delay(1000);
            return await this.resumeFromLocation(loadResult.location);
        }

        // New game
        this.terminal.print("Press Enter to start a new adventure...", 'dim');
        const startInput = await this.terminal.prompt();

        // Debug code: skip to advanced shop for testing
        if (startInput.toLowerCase() === 'testboss') {
            this.character = new Character("Hero");
            this.character.initializeClass('male', 'warrior');
            // Set up a character ready for advanced shop / final boss testing
            this.character.level = 4;
            this.character.baseMaxHp = 65;
            this.character.maxHp = 65;
            this.character.hp = 65;
            this.character.attack = 12;
            this.character.defense = 6;
            this.character.gold = 204;
            this.character.weapon = "Trident of the Depths";
            this.character.shield = "Knight's Shield";
            this.character.potions = 3;
            this.character.spells = ['Arcane Blast', 'Energy Surge', 'Astral Strike'];
            this.terminal.print("\n[yellow]*** DEBUG MODE: Skipping to Grand Finale ***[/yellow]");
            this.updateSidebar();
            await this.terminal.delay(500);
            return await this.grandFinale();
        }

        // Character creation flow
        await this.characterCreation();
        this.updateSidebar();
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
            'forgotten_coliseum': () => this.forgottenColiseum(),
            'treasure_castle': () => this.treasureCastle()
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
    async runBattle(enemyType, location = 'thiefs_crossroads') {
        const battle = new Battle(this.terminal, this.character, enemyType, this.saveMenu, location);
        return await battle.run();
    }

    /**
     * Visit shop
     */
    async visitShop() {
        const shop = new Shop(this.terminal, this.character);
        await shop.visit();
        this.updateSidebar();
    }

    /**
     * Visit advanced shop
     */
    async visitAdvancedShop() {
        const shop = new Shop(this.terminal, this.character);
        await shop.visitAdvanced();
        this.updateSidebar();
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

        // Reset and restart with character creation
        await this.characterCreation();
        this.updateSidebar();
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
            this.terminal.print("\nStarting a new adventure...");
            await this.characterCreation();
            this.updateSidebar();
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

        while (true) {
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
                this.terminal.print("Invalid entry. Please type 'left' or 'right'.");
            }
        }
    }

    /**
     * Lake path
     */
    async lakePath() {
        this.terminal.showSprite(getLocationSprite('lake'), 'The Lake');
        this.terminal.print("\nYou arrive at a vast lake. There's a boat tied to a dock.");
        this.terminal.print("Type 'swim' (s) to swim across or 'take' (t) to take the boat.");

        while (true) {
            const choice = await this.terminal.prompt();

            if (choice.toLowerCase() === 'swim' || choice.toLowerCase() === 's') {
                this.terminal.print("\nAs you swim across the lake, a ferocious shark appears!");
                if (!await this.runBattle('shark', 'thiefs_crossroads')) {
                    return await this.gameOver("You were defeated by the Ferocious Shark!");
                }
                this.terminal.print("\nAfter defeating the shark, you reach the other side of the lake.");
                break;
            } else if (choice.toLowerCase() === 'take' || choice.toLowerCase() === 't') {
                this.terminal.print("\nAs you row across the lake, a terrifying lake monster emerges from the depths!");
                if (!await this.runBattle('lake_monster', 'thiefs_crossroads')) {
                    return await this.gameOver("You were dragged underwater by the Lake Monster!");
                }
                this.terminal.print("\nAfter defeating the lake monster, the boat takes you safely across.");
                break;
            } else {
                this.terminal.print("Invalid entry. Please type 'swim' or 'take'.");
            }
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
            if (!await this.runBattle('wizard', 'thiefs_crossroads')) {
                return await this.gameOver("You were defeated in battle!");
            }
        } else {
            this.terminal.print("\nA group of skeleton bandits ambushes you from behind the rocks!");
            if (!await this.runBattle('skeleton_bandits', 'thiefs_crossroads')) {
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

        while (true) {
            const choice = await this.terminal.prompt();

            if (choice.toLowerCase() === 'red' || choice.toLowerCase() === 'r') {
                this.terminal.print("\nBehind the red door, you find a savage bear rider guarding the passage!");
                if (!await this.runBattle('bear_rider', 'hidden_passages')) {
                    return await this.gameOver("You were defeated by the bear rider!");
                }
                break;
            } else if (choice.toLowerCase() === 'blue' || choice.toLowerCase() === 'b') {
                this.terminal.print("\nAs you open the blue door, a fearsome dragon knight challenges you!");
                if (!await this.runBattle('dragon_knight', 'hidden_passages')) {
                    return await this.gameOver("You were defeated by the dragon knight!");
                }
                break;
            } else {
                this.terminal.print("Invalid entry. Please type 'red' or 'blue'.");
            }
        }

        // Shop after defeating castle guardian
        this.terminal.print("\nAfter your victory, you notice a merchant's stall nearby.");
        this.terminal.print("Perhaps you should see what they're selling before continuing.");
        await this.visitShop();

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
                    if (!await this.runBattle('stone_golem', 'convergence_paths')) {
                        return await this.gameOver("You were defeated in the Ancient Caverns!");
                    }
                } else {
                    this.terminal.print("\nSomething scuttles across the ceiling...");
                    if (!await this.runBattle('giant_spider', 'convergence_paths')) {
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
                    if (!await this.runBattle('ancient_guardian', 'convergence_paths')) {
                        return await this.gameOver("You were defeated in the Forgotten Temple!");
                    }
                } else {
                    this.terminal.print("\nA sarcophagus creaks open...");
                    if (!await this.runBattle('cursed_mummy', 'convergence_paths')) {
                        return await this.gameOver("You were defeated in the Forgotten Temple!");
                    }
                }
                break;
            } else {
                this.terminal.print("Invalid entry. Please choose path 1 or 2.");
            }
        }

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
                this.terminal.print("Invalid entry. Please choose a doorway (1-3).");
                continue;
            }

            if (result === true) {
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
        if (!await this.runBattle('crystal_guardian', 'crystal_palace')) {
            return await this.gameOver("You were shattered by the Crystal Guardian!");
        }

        this.terminal.print("\nDeeper into the palace, you find yourself in the throne room.");
        this.terminal.print("The Crystal Queen rises from her throne, shards of crystal floating around her.");
        if (!await this.runBattle('crystal_queen', 'crystal_palace')) {
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
        if (!await this.runBattle('fire_elemental', 'volcanic_forge')) {
            return await this.gameOver("You were consumed by the flames!");
        }

        this.terminal.print("\nAt the heart of the forge, you find the legendary Forge Master at work.");
        this.terminal.print("He turns to face you, wielding a hammer of pure flame.");
        if (!await this.runBattle('forge_master', 'volcanic_forge')) {
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
        if (!await this.runBattle('merfolk_warrior', 'sunken_ruins')) {
            return await this.gameOver("You were impaled by the Merfolk Warrior's trident!");
        }

        this.terminal.print("\nIn the central chamber of the ruins, you disturb a massive Kraken!");
        this.terminal.print("Its tentacles thrash as it rises to attack!");
        if (!await this.runBattle('kraken', 'sunken_ruins')) {
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
                this.terminal.print("Invalid entry. Please choose a portal (1-3).");
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
        if (!await this.runBattle('spectral_sentinel', 'phantom_citadel')) {
            return await this.gameOver("You were consumed by spectral energy!");
        }

        // Advanced shop
        this.terminal.print("\nAs the Spectral Sentinel fades away, you notice a mysterious merchant appear in the mist.");
        this.terminal.print("'Impressive,' the merchant says. 'Perhaps you'll find these wares useful for the challenges ahead.'");
        await this.visitAdvancedShop();

        this.terminal.print("\nAs you venture deeper into the citadel, you encounter a Phantom Knight guarding the inner chamber.");
        if (!await this.runBattle('phantom_knight', 'phantom_citadel')) {
            return await this.gameOver("The Phantom Knight has claimed your soul!");
        }

        this.terminal.print("\nAt the heart of the citadel stands the Lord of Echoes, beckoning you to your demise.");
        this.terminal.print("As you approach, countless voices whisper from within its form.");
        if (!await this.runBattle('lord_of_echoes', 'phantom_citadel')) {
            return await this.gameOver("The Lord of Echoes has erased your existence!");
        }

        this.terminal.print("\nWith the Lord of Echoes defeated, the citadel begins to fade away.");
        this.terminal.print("As the spectral walls dissolve, you see a grand castle in the distance!");
        return await this.treasureCastle();
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
        if (!await this.runBattle('automaton_soldier', 'clockwork_nexus')) {
            return await this.gameOver("You were dismantled by the Automaton Soldier!");
        }

        // Advanced shop
        this.terminal.print("\nAs the Automaton Soldier collapses, a panel in the wall slides open to reveal a merchant.");
        this.terminal.print("'Right on schedule,' the merchant says, checking a pocket watch. 'Care to browse my wares?'");
        await this.visitAdvancedShop();

        this.terminal.print("\nDeeper in the nexus, you encounter a Clockmaker monitoring a wall of clocks.");
        if (!await this.runBattle('clockmaker', 'clockwork_nexus')) {
            return await this.gameOver("The Clockmaker has erased you from history!");
        }

        this.terminal.print("\nAt the center of the nexus, the Time Warden adjusts the grand mechanism.");
        this.terminal.print("As you approach, time itself seems to stutter and skip around you.");
        if (!await this.runBattle('time_warden', 'clockwork_nexus')) {
            return await this.gameOver("The Time Warden has wound back your time to nothingness!");
        }

        this.terminal.print("\nWith the Time Warden defeated, the grand mechanism begins to open.");
        this.terminal.print("The gears align to reveal a hidden passage... leading to a grand castle!");
        return await this.treasureCastle();
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
        if (!await this.runBattle('gladiator_shade', 'forgotten_coliseum')) {
            return await this.gameOver("You were slain in glorious combat by the Gladiator Shade!");
        }

        // Advanced shop
        this.terminal.print("\nAfter your victory over the Gladiator Shade, the crowd roars and a merchant emerges.");
        this.terminal.print("'Well fought, champion!' the merchant calls. 'Perhaps some of my wares will aid your next battle.'");
        await this.visitAdvancedShop();

        this.terminal.print("\nAs you finish your business, the Arena Master descends to test your skill!");
        if (!await this.runBattle('arena_master', 'forgotten_coliseum')) {
            return await this.gameOver("The Arena Master has proven your unworthiness!");
        }

        this.terminal.print("\nThe crowd roars as The Eternal Champion emerges for the final match.");
        this.terminal.print("Legends say it has never known defeat in thousands of years of combat.");
        if (!await this.runBattle('eternal_champion', 'forgotten_coliseum')) {
            return await this.gameOver("The Eternal Champion remains undefeated. Your journey ends here!");
        }

        this.terminal.print("\nAs you defeat The Eternal Champion, the spectral crowd erupts in cheers.");
        this.terminal.print("A great door opens at the far end of the arena... revealing the path to a grand castle!");
        return await this.treasureCastle();
    }

    // ==========================================================================
    // TREASURE'S GUARDIAN ENCOUNTER
    // ==========================================================================

    /**
     * Treasure Castle - exterior before entering
     */
    async treasureCastle() {
        this.terminal.showSprite(getLocationSprite('treasure_castle'), "The King's Castle");
        this.terminal.print("\n=== THE KING'S CASTLE ===");
        this.terminal.print("Before you stands a grand castle, ancient and imposing.");
        this.terminal.print("Golden light emanates from within. This is it - the legendary resting place of the King's Treasure.");
        this.terminal.print("\nMassive wooden doors, adorned with golden fixtures, await your touch.");

        await this.terminal.waitForEnter("Press Enter to open the castle doors...");

        return await this.guardianAntechamber();
    }

    /**
     * Guardian Antechamber - meeting the Guardian
     */
    async guardianAntechamber() {
        this.terminal.showSprite('assets/sprites/enemies/treasures_guardian.webp', "The Treasure's Guardian");

        // Pre-battle dialogue sequence - narration normal, spoken words purple+italic (telepathic)
        this.terminal.print("\nYou enter a vast stone chamber with vaulted ceilings. Torchlight flickers against ancient walls.");
        this.terminal.print("At the far end stand grand ornate wooden doors - and before them, [purple]something terrible[/purple].");
        await this.terminal.waitForEnter();

        this.terminal.print("\nA figure in golden armor stands motionless. Where its face should be, there is nothing -");
        this.terminal.print("only [purple]swirling purple flames[/purple] that pour upward like a cursed crown.");
        this.terminal.print("The fire casts dancing shadows across the chamber walls.");
        await this.terminal.waitForEnter();

        this.terminal.print("\nIt does not speak. But its voice resounds within your mind.");
        this.terminal.print("\n[purple][italic]\"Another seeker. Another soul burning with ambition.\"[/italic][/purple]");
        await this.terminal.waitForEnter();

        this.terminal.print("\n[purple][italic]\"I was the first to stand where you stand now. The first to fight through impossible odds to reach this place.\"[/italic][/purple]");
        this.terminal.print("\nThe spectral flames seem to regard you - burning eyes within a face of swirling fire, devoid of any other features.");
        this.terminal.print("\n[purple][italic]\"And I found exactly what I sought.\"[/italic][/purple]");
        await this.terminal.waitForEnter();

        this.terminal.print("\n[purple][italic]\"The treasure awaits beyond me. But tell me, seeker... when you dream of wealth, do you dream of what comes after? Of the weight of having everything you ever wanted?\"[/italic][/purple]");
        await this.terminal.waitForEnter();

        this.terminal.print("\n[purple][italic]\"I am bound to test you. That is my purpose now. But hear this warning...\"[/italic][/purple]");
        this.terminal.print("\nThe spectral flames flare brighter as it raises its golden blade - lightning crackles along the edge.");
        this.terminal.print("\n[purple][italic]\"Some treasures are not meant to be found. Some victories are simply the beginning of a longer defeat.\"[/italic][/purple]");
        await this.terminal.waitForEnter();

        this.terminal.print("\n[purple][italic]\"But you will not turn back. None of you ever do. I know this, because I did not turn back either.\"[/italic][/purple]");
        this.terminal.print("\nThe Guardian assumes its battle stance. Purple fire erupts around its form.");
        this.terminal.print("\n[purple][italic]\"Prove yourself worthy of your ambition... or be freed from it forever.\"[/italic][/purple]");
        await this.terminal.waitForEnter("Press Enter to face The Treasure's Guardian...");

        // Flash to battle sprite before boss encounter
        await this.terminal.showBattleSprite('assets/sprites/enemies/treasures_guardian_battle.webp', "The Treasure's Guardian");
        this.terminal.bossWarning();

        // Battle - note: we pass a special flag to handle this battle differently
        const battle = new Battle(this.terminal, this.character, 'treasures_guardian', this.saveMenu, 'treasure_castle');
        battle.isGuardianBattle = true; // Special flag for post-battle handling
        const victory = await battle.run();

        if (!victory) {
            return await this.gameOver("The Treasure's Guardian has claimed another soul...");
        }

        // Post-battle is handled here, not in battle.js
        return await this.guardianPostBattle();
    }

    /**
     * Post-Guardian battle - transformation and choice
     */
    async guardianPostBattle() {
        this.terminal.showSprite('assets/sprites/enemies/treasures_guardian_defeated.webp', "The Guardian - Freed");

        this.terminal.print("\nThe Treasure's Guardian staggers. The purple flames that engulfed him begin to flicker and fade.");
        await this.terminal.waitForEnter();

        this.terminal.print("\nAs you watch, the spectral fire dissolves into wisps of smoke. The cursed golden armor cracks and falls away in pieces. Beneath it... a man. Just a man.");
        this.terminal.print("His hair no longer flame but simple gold, his eyes no longer burning but human - tired, grateful, finally at peace.");
        await this.terminal.waitForEnter();

        this.terminal.print("\nHe speaks, his voice hoarse from centuries of silence.");
        this.terminal.print("\n[cyan]\"You have... broken it. The hold it had on me. After all these centuries...\"[/cyan]");
        await this.terminal.waitForEnter();

        this.terminal.print("\nHe looks down at his hands - flesh again, no longer living gold.");
        this.terminal.print("\n[cyan]\"I am free.\"[/cyan]");
        await this.terminal.waitForEnter();

        this.terminal.print("\nHe looks up at you, and for the first time you see who he truly was - a treasure hunter, like you. Someone who sought glory and found only imprisonment.");
        this.terminal.print("\n[cyan]\"The treasure is yours by right of conquest. But I give you what no one gave me...\"[/cyan]");
        this.terminal.print("\n[cyan]\"A choice.\"[/cyan]");
        await this.terminal.waitForEnter();

        this.terminal.print("\nHe gestures toward the grand doors behind him, then to the exit you came from.");
        this.terminal.print("\n[cyan]\"Enter and claim your prize. Or heed my warning and walk away while you still can. While you are still... yourself.\"[/cyan]");
        await this.terminal.waitForEnter();

        this.terminal.print("\nHis human eyes meet yours, pleading.");
        this.terminal.print("\n[cyan]\"I beseech you... choose wisely.\"[/cyan]");

        // The choice
        this.terminal.print("\n[bold]What do you do?[/bold]");
        this.terminal.print("1. Enter the Treasure Room");
        this.terminal.print("2. Heed the warning and walk away");

        while (true) {
            const choice = await this.terminal.prompt();

            if (choice === '1' || choice.toLowerCase().includes('enter') || choice.toLowerCase().includes('treasure')) {
                this.terminal.print("\nYou step past the freed Guardian toward the golden doors.");
                this.terminal.print("\n[cyan]\"So be it. May you fare better than I did... though I fear you will not.\"[/cyan]");
                await this.terminal.waitForEnter();
                return await this.treasureRoom();
            } else if (choice === '2' || choice.toLowerCase().includes('walk') || choice.toLowerCase().includes('heed') || choice.toLowerCase().includes('away')) {
                return await this.wisdomEnding();
            } else {
                this.terminal.print("Please choose 1 or 2.");
            }
        }
    }

    /**
     * Wisdom Ending - walking away from the treasure
     */
    async wisdomEnding() {
        this.terminal.print("\nYou turn your back on the golden light. The man who was once the Guardian watches in silence as you walk away.");
        await this.terminal.waitForEnter();

        this.terminal.print("\n[cyan]\"You are the first... the only one... to choose differently.\"[/cyan]");
        this.terminal.print("\nHis voice carries something new - not sorrow, but wonder.");
        await this.terminal.waitForEnter();

        this.terminal.print("\n[cyan]\"I spent centuries guarding that door, waiting for someone strong enough to defeat me. But you... you are the first one wise enough to walk away.\"[/cyan]");
        await this.terminal.waitForEnter();

        this.terminal.print("\nHis final words follow you as you leave.");
        this.terminal.print("\n[cyan]\"Thank you. You have freed us both.\"[/cyan]");
        await this.terminal.waitForEnter();

        this.terminal.showSprite(getLocationSprite('wisdom_ending'), "A New Beginning");
        this.terminal.print("\nYou leave the castle behind, treasure-less but whole. The sunrise greets you as you step outside - a new day, a new beginning.");
        this.terminal.print("And somehow, that feels like the greater victory.");
        await this.terminal.waitForEnter();

        this.terminal.print("\n[victory]THE END[/victory]");
        this.terminal.print("[bold]You chose wisdom over wealth.[/bold]");

        // Show final stats
        this.terminal.print("\n[bold]Your final adventure stats:[/bold]");
        this.terminal.print(`Level: ${this.character.level}`);
        this.terminal.print(`HP: ${this.character.hp}/${this.character.maxHp}`);
        this.terminal.print(`Gold: ${this.character.gold}`);
        this.terminal.print(`XP: ${this.character.xp}`);
        this.terminal.print(`Weapon: ${this.character.weapon} (${this.character.getWeaponDamage()} damage)`);
        this.terminal.print(`Shield: ${this.character.shield} (${this.character.getShieldDefense()} defense)`);

        const items = this.character.getSpecialItems();
        if (items.length > 0) {
            this.terminal.print(`Special Items: ${items.join(', ')}`);
        }

        this.terminal.print("\nWould you like to play again? (yes/no)");
        const choice = await this.terminal.prompt();

        if (choice.toLowerCase().startsWith('y')) {
            this.terminal.print("\nStarting a new adventure...");
            await this.characterCreation();
            this.updateSidebar();
            return await this.thiefsCrossroads();
        }

        this.terminal.print("\n[bold]Thanks for playing! Goodbye![/bold]");
        return true;
    }
}
