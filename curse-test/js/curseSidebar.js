/**
 * CurseSidebar - Extended sidebar for curse battles
 * Handles companion display, multi-enemy display, and curse tracking
 */

export class CurseSidebar {
    constructor() {
        // Companion elements
        this.companionSection = document.getElementById('companion-stats');
        this.companionName = document.getElementById('companion-name');
        this.companionRole = document.getElementById('companion-role');
        this.companionHpBar = document.getElementById('companion-hp-bar');
        this.companionHpText = document.getElementById('companion-hp-text');

        // Multi-enemy elements
        this.enemiesSection = document.getElementById('enemies-stats');
        this.enemiesList = document.getElementById('enemies-list');

        // Curse indicator
        this.curseIndicator = document.getElementById('curse-indicator');
        this.curseTurns = document.getElementById('curse-turns');
    }

    /**
     * Update HP bar with color coding
     */
    updateHpBar(barEl, textEl, current, max) {
        const percent = Math.max(0, (current / max) * 100);
        barEl.style.width = `${percent}%`;
        textEl.textContent = `${current}/${max}`;

        barEl.classList.remove('medium', 'low');
        textEl.classList.remove('medium', 'low');

        if (percent <= 30) {
            barEl.classList.add('low');
            textEl.classList.add('low');
        } else if (percent <= 60) {
            barEl.classList.add('medium');
            textEl.classList.add('medium');
        }
    }

    /**
     * Update companion display
     */
    updateCompanion(companion) {
        if (!this.companionSection) return;

        if (!companion) {
            this.companionSection.classList.add('hidden');
            return;
        }

        this.companionSection.classList.remove('hidden');
        if (this.companionName) this.companionName.textContent = companion.name;
        if (this.companionRole) this.companionRole.textContent = companion.role;

        if (companion.isConscious) {
            if (this.companionHpBar && this.companionHpText) {
                this.updateHpBar(this.companionHpBar, this.companionHpText, companion.hp, companion.maxHp);
            }
            if (this.companionName) this.companionName.classList.remove('unconscious');
        } else {
            if (this.companionHpBar) this.companionHpBar.style.width = '0%';
            if (this.companionHpText) this.companionHpText.textContent = 'UNCONSCIOUS';
            if (this.companionName) this.companionName.classList.add('unconscious');
        }
    }

    /**
     * Update multi-enemy display
     * Reuses existing DOM elements for smooth CSS transitions
     */
    updateEnemies(enemies) {
        if (!this.enemiesSection || !this.enemiesList) return;

        if (!enemies || enemies.length === 0) {
            this.enemiesSection.classList.add('hidden');
            return;
        }

        this.enemiesSection.classList.remove('hidden');

        // Get existing rows or create new ones as needed
        const existingRows = this.enemiesList.querySelectorAll('.enemy-row');

        enemies.forEach((enemy, index) => {
            let row = existingRows[index];

            if (!row) {
                // Create new row if it doesn't exist
                row = document.createElement('div');
                row.className = 'enemy-row';
                row.dataset.index = index;

                const numberSpan = document.createElement('span');
                numberSpan.className = 'enemy-letter';
                numberSpan.textContent = index + 1;

                const infoDiv = document.createElement('div');
                infoDiv.className = 'enemy-info';

                const nameSpan = document.createElement('div');
                nameSpan.className = 'name';

                const hpBar = document.createElement('div');
                hpBar.className = 'enemy-hp-mini';

                const hpFill = document.createElement('div');
                hpFill.className = 'bar';

                const hpText = document.createElement('div');
                hpText.className = 'enemy-hp-text';

                hpBar.appendChild(hpFill);
                infoDiv.appendChild(nameSpan);
                infoDiv.appendChild(hpBar);
                infoDiv.appendChild(hpText);

                row.appendChild(numberSpan);
                row.appendChild(infoDiv);

                this.enemiesList.appendChild(row);
            }

            // Update existing elements (triggers CSS transition)
            const nameSpan = row.querySelector('.name');
            const hpFill = row.querySelector('.bar');
            const hpText = row.querySelector('.enemy-hp-text');

            if (enemy.hp <= 0) {
                row.classList.add('defeated');
                nameSpan.textContent = `${enemy.name} [DEFEATED]`;
            } else {
                row.classList.remove('defeated');
                nameSpan.textContent = enemy.name;
            }

            const hpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
            hpFill.style.width = `${hpPercent}%`;
            hpText.textContent = `${enemy.hp}/${enemy.maxHp}`;
        });

        // Remove extra rows if enemies list shrunk (between battles)
        let currentRows = this.enemiesList.querySelectorAll('.enemy-row');
        while (currentRows.length > enemies.length) {
            this.enemiesList.removeChild(currentRows[currentRows.length - 1]);
            currentRows = this.enemiesList.querySelectorAll('.enemy-row');  // Refresh after removal
        }
    }

    /**
     * Update curse drain countdown
     */
    updateCurseTurns(turnsUntilDrain) {
        if (this.curseTurns) {
            this.curseTurns.textContent = turnsUntilDrain;
        }
    }

    /**
     * Show combat UI elements
     */
    showCombat() {
        // Note: companion section visibility is controlled by updateCompanion()
        if (this.enemiesSection) this.enemiesSection.classList.remove('hidden');
        if (this.curseIndicator) this.curseIndicator.classList.remove('hidden');
    }

    /**
     * Hide combat UI elements
     */
    hideCombat() {
        if (this.enemiesSection) this.enemiesSection.classList.add('hidden');
        if (this.curseIndicator) this.curseIndicator.classList.add('hidden');
    }

    /**
     * Show companion only (outside of combat)
     */
    showCompanionOnly(companion) {
        this.updateCompanion(companion);
        if (this.enemiesSection) this.enemiesSection.classList.add('hidden');
    }
}
