/**
 * Terminal - Handles text output and input for the game
 */
export class Terminal {
    constructor(outputEl, inputEl, spriteEl, spriteLabelEl) {
        this.output = outputEl;
        this.input = inputEl;
        this.sprite = spriteEl;
        this.spriteLabel = spriteLabelEl;
        this.inputResolve = null;
        this.inputActive = false;

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
        if (e.key === 'Enter' && this.inputActive) {
            const value = this.input.value.trim();
            this.print(`> ${value}`, 'user-input');
            this.input.value = '';
            this.input.placeholder = '';
            this.inputActive = false;

            if (this.inputResolve) {
                this.inputResolve(value);
                this.inputResolve = null;
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
            blue: 'blue',
            white: 'white',
            'bright-red': 'bright-red',
            'bright-green': 'bright-green',
            'bright-yellow': 'bright-yellow',
            'bright-cyan': 'bright-cyan',
            'bright-magenta': 'bright-magenta',
            'bright-blue': 'bright-blue',
            bold: 'bold',
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
     * Display a sprite image
     */
    showSprite(src, label = '') {
        if (src) {
            this.sprite.src = src;
            this.sprite.style.display = 'block';
            this.sprite.alt = label;
            this.spriteLabel.textContent = label;
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
