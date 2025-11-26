/**
 * Save System - localStorage-based game persistence
 */
import { Character } from './character.js';

const SAVE_PREFIX = 'kings_treasure_';
const SAVE_VERSION = '1.0';

/**
 * Save the game to a slot
 */
export function saveGame(slot, character, location) {
    const saveData = {
        version: SAVE_VERSION,
        timestamp: new Date().toISOString(),
        character: character.toJSON(),
        location: location
    };

    try {
        localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(saveData));
        return true;
    } catch (e) {
        console.error('Error saving game:', e);
        return false;
    }
}

/**
 * Load a game from a slot
 */
export function loadGame(slot) {
    try {
        const data = localStorage.getItem(SAVE_PREFIX + slot);
        if (!data) return null;
        return JSON.parse(data);
    } catch (e) {
        console.error('Error loading game:', e);
        return null;
    }
}

/**
 * Delete a save slot
 */
export function deleteSave(slot) {
    try {
        localStorage.removeItem(SAVE_PREFIX + slot);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * List all available saves
 */
export function listSaves() {
    const saves = [];
    for (let slot = 1; slot <= 3; slot++) {
        const data = loadGame(slot);
        if (data) {
            saves.push({
                slot,
                timestamp: data.timestamp,
                level: data.character.level,
                location: data.location,
                gold: data.character.gold,
                weapon: data.character.weapon
            });
        } else {
            saves.push({ slot, empty: true });
        }
    }
    return saves;
}

/**
 * Format save info for display
 */
export function formatSaveInfo(save) {
    if (save.empty) {
        return `Slot ${save.slot}: [Empty]`;
    }

    const date = new Date(save.timestamp);
    const dateStr = date.toLocaleString();
    const location = save.location.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return `Slot ${save.slot}: Level ${save.level} | ${location} | ${save.gold} gold | ${dateStr}`;
}

/**
 * Restore character from save data
 */
export function restoreCharacter(saveData) {
    return Character.fromJSON(saveData.character);
}

/**
 * Save menu UI handler
 */
export class SaveMenu {
    constructor(terminal) {
        this.terminal = terminal;
    }

    /**
     * Show save menu and handle saving
     */
    async showSaveMenu(character, location) {
        this.terminal.separator();
        this.terminal.print("             SAVE GAME");
        this.terminal.separator();

        const saves = listSaves();
        for (const save of saves) {
            this.terminal.print(formatSaveInfo(save));
        }

        this.terminal.print("\n0. Cancel");
        this.terminal.print("\nSelect slot to save (1-3) or 0 to cancel:");

        while (true) {
            const choice = await this.terminal.prompt();

            if (choice === '0') {
                this.terminal.print("Save cancelled.");
                return false;
            }

            if (['1', '2', '3'].includes(choice)) {
                const slot = parseInt(choice);
                const existing = saves.find(s => s.slot === slot && !s.empty);

                if (existing) {
                    this.terminal.print(`Overwrite existing save in Slot ${slot}? (yes/no)`);
                    const confirm = await this.terminal.prompt();
                    if (!confirm.toLowerCase().startsWith('y')) {
                        continue;
                    }
                }

                if (saveGame(slot, character, location)) {
                    this.terminal.print(`\n[green]Game saved to Slot ${slot}![/green]`);
                    return true;
                } else {
                    this.terminal.print("\n[red]Failed to save game.[/red]");
                    return false;
                }
            }

            this.terminal.print("Please enter 1, 2, 3, or 0.");
        }
    }

    /**
     * Show load menu and handle loading
     */
    async showLoadMenu() {
        this.terminal.separator();
        this.terminal.print("             LOAD GAME");
        this.terminal.separator();

        const saves = listSaves();
        const hasSaves = saves.some(s => !s.empty);

        if (!hasSaves) {
            this.terminal.print("\nNo saved games found.");
            await this.terminal.waitForEnter();
            return null;
        }

        for (const save of saves) {
            this.terminal.print(formatSaveInfo(save));
        }

        this.terminal.print("\n0. Cancel (Start New Game)");
        this.terminal.print("\nSelect slot to load (1-3) or 0 for new game:");

        while (true) {
            const choice = await this.terminal.prompt();

            if (choice === '0') {
                return null;
            }

            if (['1', '2', '3'].includes(choice)) {
                const slot = parseInt(choice);
                const save = saves.find(s => s.slot === slot);

                if (save.empty) {
                    this.terminal.print(`Slot ${slot} is empty. Please choose another slot.`);
                    continue;
                }

                const saveData = loadGame(slot);
                if (saveData) {
                    return {
                        character: restoreCharacter(saveData),
                        location: saveData.location
                    };
                } else {
                    this.terminal.print("Failed to load save.");
                    return null;
                }
            }

            this.terminal.print("Please enter 1, 2, 3, or 0.");
        }
    }

    /**
     * Offer to save after significant events
     */
    async offerSave(character, location) {
        this.terminal.print("\nWould you like to save your game? (yes/no)");
        const choice = await this.terminal.prompt();

        if (choice.toLowerCase().startsWith('y')) {
            await this.showSaveMenu(character, location);
        }
    }
}
