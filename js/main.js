/**
 * Main entry point for The King's Treasure
 */
import { Terminal } from './terminal.js';
import { Game } from './game.js';

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const outputEl = document.getElementById('output');
    const inputEl = document.getElementById('command-input');
    const spriteEl = document.getElementById('current-sprite');
    const spriteLabelEl = document.getElementById('sprite-label');

    // Create terminal instance
    const terminal = new Terminal(outputEl, inputEl, spriteEl, spriteLabelEl);

    // Create and start game
    const game = new Game(terminal);
    game.start().catch(err => {
        console.error('Game error:', err);
        terminal.print(`\n[red]An error occurred: ${err.message}[/red]`);
    });
});
