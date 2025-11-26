/**
 * Main entry point for The King's Treasure
 */
import { Terminal } from './terminal.js';
import { Game } from './game.js';
import { preloadImages } from './preloader.js';

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Get loading screen elements
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');

    // Preload all images
    await preloadImages((loaded, total) => {
        const percent = Math.round((loaded / total) * 100);
        loadingBar.style.width = `${percent}%`;
        loadingText.textContent = `Loading... ${percent}%`;
    });

    // Hide loading screen
    loadingScreen.classList.add('hidden');

    // Wait for fade out transition
    await new Promise(resolve => setTimeout(resolve, 500));

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
