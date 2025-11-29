/**
 * Terminal - Handles text output and input for the game
 */
import { Sidebar } from './sidebar.js';

export class Terminal {
    constructor(outputEl, inputEl, spriteEl, spriteLabelEl) {
        this.output = outputEl;
        this.input = inputEl;
        this.sprite = spriteEl;
        this.spriteLabel = spriteLabelEl;
        this.spritePanel = spriteEl.parentElement;
        this.spriteGrid = document.getElementById('sprite-grid');
        this.inputResolve = null;
        this.inputActive = false;

        // Initialize sidebar
        this.sidebar = new Sidebar();

        // Set up input handler
        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    /**
     * Print a line of text to the terminal
     */
    print(text, className = '') {
        const lines = text.split('\n');
        for (const line of lines) {
            const div = document.createElement('div');
            div.className = `output-line ${className}`;
            div.innerHTML = this.parseColors(line);
            this.output.appendChild(div);
        }
        this.scrollToBottom();
    }

    /**
     * Print multiple lines
     */
    printLines(lines, className = '') {
        for (const line of lines) {
            this.print(line, className);
        }
    }

    /**
     * Print a separator line
     */
    separator(char = '=', length = 50) {
        this.print(char.repeat(length), 'separator dim');
    }

    /**
     * Print a blank line
     */
    blank() {
        this.print('');
    }

    /**
     * Clear the terminal output
     */
    clear() {
        this.output.innerHTML = '';
    }

    /**
     * Wait for user input
     */
    async prompt(placeholder = '') {
        return new Promise((resolve) => {
            this.inputResolve = resolve;
            this.inputActive = true;
            this.input.placeholder = placeholder;
            this.input.value = '';
            this.input.focus();
            this.scrollToBottom();
        });
    }

    /**
     * Wait for user to press Enter (no input needed)
     */
    async waitForEnter(message = 'Press Enter to continue...') {
        this.print(message, 'dim');
        await this.prompt();
    }

    /**
     * Handle keydown events on input
     */
    handleKeydown(e) {
        if (!this.inputActive) return;

        if (e.key === 'Enter') {
            const value = this.input.value.trim();
            this.print(`> ${value}`, 'user-input');
            this.input.value = '';
            this.input.placeholder = '';
            this.inputActive = false;

            if (this.inputResolve) {
                this.inputResolve(value);
                this.inputResolve = null;
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.inputResolve) {
                const direction = e.key === 'ArrowUp' ? '__UP__' : '__DOWN__';
                this.inputResolve(direction);
                this.inputResolve = null;
                // Re-activate input for next prompt
                this.inputActive = false;
            }
        }
    }

    /**
     * Scroll output to bottom
     */
    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    /**
     * Parse color markers and convert to HTML spans
     */
    parseColors(text) {
        // Handle [color]...[/color] format
        const colorMap = {
            red: 'red',
            green: 'green',
            yellow: 'yellow',
            cyan: 'cyan',
            magenta: 'magenta',
            purple: 'purple',
            blue: 'blue',
            white: 'white',
            'bright-red': 'bright-red',
            'bright-green': 'bright-green',
            'bright-yellow': 'bright-yellow',
            'bright-cyan': 'bright-cyan',
            'bright-magenta': 'bright-magenta',
            'bright-blue': 'bright-blue',
            bold: 'bold',
            italic: 'italic',
            dim: 'dim',
            critical: 'critical',
            victory: 'victory',
            defeat: 'defeat',
            boss: 'boss',
            gold: 'gold',
            xp: 'xp',
            'level-up': 'level-up'
        };

        let result = text;

        // Process color tags
        for (const [tag, className] of Object.entries(colorMap)) {
            const openTag = new RegExp(`\\[${tag}\\]`, 'gi');
            const closeTag = new RegExp(`\\[/${tag}\\]`, 'gi');
            result = result.replace(openTag, `<span class="${className}">`);
            result = result.replace(closeTag, '</span>');
        }

        // Escape any remaining < > that aren't part of our spans
        // (but keep our spans intact)

        return result;
    }

    /**
     * Display battle sprite with flash-to-white transition
     */
    async showBattleSprite(src, label) {
        // Add flash class
        this.sprite.classList.add('flash-attack');

        // Wait for flash midpoint (200ms)
        await this.delay(200);

        // Swap image during white flash
        this.sprite.src = src;
        this.spriteLabel.textContent = label;

        // Wait for animation to complete
        await this.delay(200);

        // Remove flash class
        this.sprite.classList.remove('flash-attack');
    }

    /**
     * Display a sprite image with fade transition
     */
    showSprite(src, label = '') {
        if (src) {
            // Check if the current sprite ends with the same path (handles absolute vs relative)
            const isSameSprite = this.sprite.src && this.sprite.src.endsWith(src);

            // If sprite is already visible and different, fade transition
            if (this.sprite.style.display === 'block' && !isSameSprite) {
                // Cancel any pending sprite change
                if (this.pendingSpriteTimeout) {
                    clearTimeout(this.pendingSpriteTimeout);
                }

                this.sprite.classList.add('fading');
                this.pendingSpriteTimeout = setTimeout(() => {
                    // Preload the new image before showing
                    const newImage = new Image();
                    newImage.onload = () => {
                        this.sprite.src = src;
                        this.sprite.alt = label;
                        this.spriteLabel.textContent = label;
                        this.sprite.classList.remove('fading');
                    };
                    newImage.onerror = () => {
                        // Still update even if image fails to load
                        this.sprite.src = src;
                        this.sprite.alt = label;
                        this.spriteLabel.textContent = label;
                        this.sprite.classList.remove('fading');
                    };
                    newImage.src = src;
                }, 250); // Match CSS transition duration
            } else if (!isSameSprite) {
                // First time showing - just display it
                this.sprite.src = src;
                this.sprite.style.display = 'block';
                this.sprite.alt = label;
                this.spriteLabel.textContent = label;
            }
            // If same sprite, do nothing (avoid flicker)
        } else {
            this.hideSprite();
        }
    }

    /**
     * Hide the sprite panel image
     */
    hideSprite() {
        this.sprite.style.display = 'none';
        this.sprite.src = '';
        this.spriteLabel.textContent = '';
    }

    /**
     * Show a grid of sprites (for shop browsing)
     * @param {Array} items - Array of {src, label, number} objects
     */
    showSpriteGrid(items) {
        // Clear existing grid
        this.spriteGrid.innerHTML = '';

        // Add grid mode class
        this.spritePanel.classList.add('grid-mode');

        // Create grid items
        items.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'grid-item';

            const number = document.createElement('div');
            number.className = 'grid-number';
            number.textContent = item.number;

            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.label;

            const label = document.createElement('div');
            label.className = 'grid-label';
            label.textContent = item.label;

            div.appendChild(number);
            div.appendChild(img);
            div.appendChild(label);
            this.spriteGrid.appendChild(div);
        });
    }

    /**
     * Hide the sprite grid and return to single sprite mode
     */
    hideSpriteGrid() {
        this.spritePanel.classList.remove('grid-mode');
        this.spriteGrid.innerHTML = '';
    }

    /**
     * Helper methods for colored text
     */
    red(text) { return `[red]${text}[/red]`; }
    green(text) { return `[green]${text}[/green]`; }
    yellow(text) { return `[yellow]${text}[/yellow]`; }
    cyan(text) { return `[cyan]${text}[/cyan]`; }
    magenta(text) { return `[magenta]${text}[/magenta]`; }
    blue(text) { return `[blue]${text}[/blue]`; }
    bold(text) { return `[bold]${text}[/bold]`; }
    dim(text) { return `[dim]${text}[/dim]`; }

    /**
     * Print health with color based on percentage
     */
    healthText(current, max) {
        const percent = (current / max) * 100;
        let colorClass;
        if (percent > 60) {
            colorClass = 'bright-green';
        } else if (percent > 30) {
            colorClass = 'bright-yellow';
        } else {
            colorClass = 'bright-red';
        }
        return `[${colorClass}]${current}/${max}[/${colorClass}]`;
    }

    /**
     * Print damage text
     */
    damageText(amount, isCritical = false) {
        if (isCritical) {
            return `[critical]${amount} CRITICAL![/critical]`;
        }
        return `[red]${amount}[/red]`;
    }

    /**
     * Print gold text
     */
    goldText(amount) {
        return `[gold]${amount} gold[/gold]`;
    }

    /**
     * Print XP text
     */
    xpText(amount) {
        return `[xp]${amount} XP[/xp]`;
    }

    /**
     * Print a menu option
     */
    menuOption(number, text) {
        this.print(`  [yellow]${number}[/yellow]. ${text}`);
    }

    /**
     * Display victory banner
     */
    victoryBanner() {
        this.blank();
        this.print('========================================', 'victory');
        this.print('             V I C T O R Y !            ', 'victory');
        this.print('========================================', 'victory');
        this.blank();
    }

    /**
     * Display defeat banner
     */
    defeatBanner() {
        this.blank();
        this.print('========================================', 'defeat');
        this.print('            D E F E A T E D             ', 'defeat');
        this.print('========================================', 'defeat');
        this.blank();
    }

    /**
     * Display boss warning
     */
    bossWarning() {
        this.blank();
        this.print('!!! BOSS ENCOUNTER !!!', 'boss');
        this.blank();
    }

    /**
     * Display level up message
     */
    levelUpBanner() {
        this.blank();
        this.print('========================================', 'level-up');
        this.print('            L E V E L   U P !           ', 'level-up');
        this.print('========================================', 'level-up');
        this.blank();
    }

    /**
     * Add delay (for dramatic effect)
     */
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
