# The King's Treasure - Web Version Implementation Plan

## Pre-Conversion: Commit Python Version

Before starting the web conversion, commit all current Python changes to create a clean snapshot:

```bash
cd /Users/david/Documents/Obsidian\ Vaults/claude-code-demo/kings-treasure/pixel-art-edition
git add .
git commit -m "Complete Python version before web conversion"
```

This preserves the final Python state and gives us a clean baseline.

---

## Overview

Convert the Python terminal RPG to a web-based game with:
- **Retro terminal aesthetic** (green text on black, monospace font)
- **Text input** for commands
- **Pixel art sprites** displayed alongside text
- **Free static hosting** (GitHub Pages)
- **Easy to modify** for future changes

## Recommended Approach: Vanilla JavaScript + CSS Terminal Styling

### Why This Approach

| Factor | Benefit |
|--------|---------|
| Hosting | Free (GitHub Pages, Netlify, Vercel) |
| Complexity | Simplest architecture - no frameworks |
| Performance | Fast load (<100KB JS + sprites) |
| Maintainability | Plain JS is easy to read/modify |
| Mobile | Works on all devices |
| Deployment | Push to git = deployed |

### Project Location

**New repo location:** `/Users/david/Documents/Obsidian Vaults/claude-code-demo/kings-treasure/web-edition`

(Sibling to `pixel-art-edition`, can be pushed to GitHub separately)

### Architecture

```
/Users/david/Documents/Obsidian Vaults/claude-code-demo/kings-treasure/web-edition/
├── index.html          # Single page app
├── css/
│   └── terminal.css    # Retro terminal styling
├── js/
│   ├── main.js         # Entry point, game loop
│   ├── terminal.js     # Text output + input handling
│   ├── game.js         # Game state machine
│   ├── battle.js       # Combat system (from battle_system.py)
│   ├── character.js    # Character/Enemy classes
│   ├── constants.js    # Game data (from constants.py)
│   ├── shop.js         # Shop system
│   └── saves.js        # localStorage save/load
└── assets/
    └── sprites/        # Copy 121 PNGs from Python version
        ├── enemies/
        ├── weapons/
        ├── shields/
        ├── items/
        └── locations/
```

---

## Visual Design

### Terminal Aesthetic (CSS)

```css
body {
  background: #0a0a0a;
  margin: 0;
  padding: 20px;
  min-height: 100vh;
}

#game-container {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

#terminal {
  flex: 1;
  background: #0d0d0d;
  border: 2px solid #00ff00;
  border-radius: 8px;
  padding: 20px;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 16px;
  color: #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
}

#sprite-panel {
  width: 250px;
  text-align: center;
}

#sprite-panel img {
  max-width: 200px;
  image-rendering: pixelated;  /* Crisp pixel art */
  border: 2px solid #00ff00;
}

#input-line {
  display: flex;
  margin-top: 10px;
}

#input-line span {
  color: #00ff00;
}

#command-input {
  background: transparent;
  border: none;
  color: #00ff00;
  font-family: inherit;
  font-size: inherit;
  flex: 1;
  outline: none;
}

/* Color classes matching Python colors.py */
.red { color: #ff4444; }
.green { color: #44ff44; }
.yellow { color: #ffff44; }
.cyan { color: #44ffff; }
.magenta { color: #ff44ff; }
.bold { font-weight: bold; }
.dim { opacity: 0.6; }
```

### Layout (HTML)

```html
<div id="game-container">
  <div id="terminal">
    <div id="output"></div>
    <div id="input-line">
      <span>&gt; </span>
      <input type="text" id="command-input" autofocus>
    </div>
  </div>
  <div id="sprite-panel">
    <img id="current-sprite" src="" alt="">
    <div id="sprite-label"></div>
  </div>
</div>
```

---

## Implementation Phases

### Phase 1: Project Setup & Terminal UI

**Files to create:**
- `index.html` - Basic structure
- `css/terminal.css` - Retro styling
- `js/terminal.js` - Output/input handling

**Terminal class:**
```javascript
class Terminal {
  constructor(outputEl, inputEl) {
    this.output = outputEl;
    this.input = inputEl;
    this.inputCallback = null;
  }

  print(text, className = '') {
    const line = document.createElement('div');
    line.className = className;
    line.innerHTML = this.parseColors(text);
    this.output.appendChild(line);
    this.scrollToBottom();
  }

  async prompt() {
    return new Promise(resolve => {
      this.input.focus();
      this.input.onkeydown = (e) => {
        if (e.key === 'Enter') {
          const value = this.input.value;
          this.print(`> ${value}`, 'dim');
          this.input.value = '';
          resolve(value);
        }
      };
    });
  }

  parseColors(text) {
    // Convert ANSI-like markers to HTML spans
    return text
      .replace(/\[red\](.*?)\[\/red\]/g, '<span class="red">$1</span>')
      .replace(/\[green\](.*?)\[\/green\]/g, '<span class="green">$1</span>')
      // etc.
  }
}
```

### Phase 2: Game Data (constants.js)

**Translate directly from Python constants.py:**

```javascript
// From constants.py lines 7-52
export const ENEMY_DATA = {
  "Skeleton Bandits": { hp: 22, attack: 6, defense: 1, xp: 55, gold: 20 },
  "Zombie Farmer": { hp: 25, attack: 7, defense: 2, xp: 65, gold: 25 },
  "Lake Monster": { hp: 40, attack: 10, defense: 3, xp: 100, gold: 45 },
  // ... all 25 enemies
};

export const WEAPON_DAMAGE = {
  "Rusty Sword": 3,
  "Iron Dagger": 4,
  "Sharpened Saber": 5,
  // ... all 24 weapons
};

export const SHIELD_DEFENSE = {
  "Wooden Buckler": 1,
  "Iron Shield": 2,
  // ... all 8 shields
};

export const WEAPON_DROPS = {
  "Skeleton Bandits": "Iron Dagger",
  "Zombie Farmer": "Farmer's Scythe",
  // ... all drops
};

export const SPELLS = {
  "Arcane Blast": { damage: 5, unlockLevel: 2 },
  "Energy Surge": { heal: true, unlockLevel: 3 },
  // ... all spells
};
```

### Phase 3: Character & Battle System

**Translate battle_system.py Character class:**

```javascript
// js/character.js
export class Character {
  constructor(name) {
    this.name = name;
    this.level = 1;
    this.hp = 30;
    this.maxHp = 30;
    this.attack = 5;
    this.defense = 2;
    this.xp = 0;
    this.gold = 0;
    this.weapon = "Rusty Sword";
    this.shield = "Wooden Buckler";
    this.potions = 0;
    this.superiorPotions = 0;
    this.spells = [];
    this.usedSpells = [];
    this.specialItems = new Set();
    this.defending = false;
  }

  levelUp() {
    this.level++;
    this.maxHp += 10;
    this.hp = this.maxHp;
    this.attack += 2;
    this.defense += 1;
    // Unlock spells at levels 2, 3, 4
    if (this.level === 2) this.spells.push("Arcane Blast");
    if (this.level === 3) this.spells.push("Energy Surge");
    if (this.level === 4) this.spells.push("Astral Strike");
  }
}
```

**Combat logic from battle_system.py:**

```javascript
// js/battle.js
export function calculateDamage(attacker, defender, weaponDamage) {
  const baseDamage = weaponDamage;
  let damage = baseDamage + Math.floor(Math.random() * 4);

  // Critical hit (20% base + ghostweave bonus)
  let critChance = 0.2;
  if (attacker.specialItems?.has('Ghostweave Cloak')) critChance += 0.15;

  if (Math.random() < critChance) {
    damage = Math.floor(damage * 1.5);
  }

  // Defense reduction
  damage = Math.max(baseDamage, damage - defender.defense);

  // Echo Blade: 20% chance to attack twice
  if (attacker.specialItems?.has('Echo Blade') && Math.random() < 0.2) {
    damage *= 2;
  }

  return damage;
}
```

### Phase 4: Game Flow (State Machine)

**Translate task_random_encounters.py location flow:**

```javascript
// js/game.js
const LOCATIONS = {
  start: {
    text: "Welcome to The King's Treasure!\nYou stand at the Thief's Crossroads...",
    sprite: "locations/crossroads.png",
    choices: {
      "1": { text: "Go left (toward the lake)", next: "lake" },
      "2": { text: "Go right (toward the mountains)", next: "mountains" }
    }
  },
  lake: {
    text: "You arrive at a vast lake...",
    sprite: "locations/lake.png",
    onEnter: () => maybeEncounter("Lake Monster"),
    choices: {
      "swim": { text: "Swim across", next: "lake_swim" },
      "boat": { text: "Take the boat", next: "lake_boat" }
    }
  },
  // ... all locations from task_random_encounters.py
};

class Game {
  constructor(terminal, spritePanel) {
    this.terminal = terminal;
    this.spritePanel = spritePanel;
    this.character = null;
    this.location = "start";
  }

  async run() {
    await this.showTitle();
    this.character = new Character(await this.getName());

    while (true) {
      const loc = LOCATIONS[this.location];
      this.showSprite(loc.sprite);
      this.terminal.print(loc.text);

      if (loc.onEnter) await loc.onEnter();
      if (loc.battle) await this.runBattle(loc.battle);

      this.showChoices(loc.choices);
      const choice = await this.terminal.prompt();
      this.location = loc.choices[choice]?.next || this.location;
    }
  }
}
```

### Phase 5: Save System

**localStorage-based saves (matching save_system.py structure):**

```javascript
// js/saves.js
const SAVE_PREFIX = 'kings_treasure_';

export function saveGame(slot, character, location) {
  const data = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    character: {
      name: character.name,
      level: character.level,
      hp: character.hp,
      maxHp: character.maxHp,
      attack: character.attack,
      defense: character.defense,
      xp: character.xp,
      gold: character.gold,
      weapon: character.weapon,
      shield: character.shield,
      potions: character.potions,
      superiorPotions: character.superiorPotions,
      spells: character.spells,
      specialItems: [...character.specialItems]
    },
    location: location
  };
  localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(data));
  return true;
}

export function loadGame(slot) {
  const data = localStorage.getItem(SAVE_PREFIX + slot);
  return data ? JSON.parse(data) : null;
}

export function listSaves() {
  return [1, 2, 3].map(slot => {
    const data = loadGame(slot);
    return data ? { slot, name: data.character.name, timestamp: data.timestamp } : null;
  }).filter(Boolean);
}
```

### Phase 6: Shop System

```javascript
// js/shop.js
export const SHOP_INVENTORY = {
  weapons: {
    "Steel Longsword": { price: 100, damage: 7 },
    "Battle Axe": { price: 150, damage: 8 }
  },
  shields: {
    "Steel Shield": { price: 80, defense: 3 }
  },
  items: {
    "Health Potion": { price: 30 },
    "Superior Potion": { price: 75 }
  },
  spells: {
    "Thunderbolt": { price: 200, damage: 12 }
  }
};

export async function runShop(terminal, character) {
  terminal.print("\n=== SHOP ===");
  terminal.print(`Gold: ${character.gold}`);
  terminal.print("1. Weapons  2. Shields  3. Items  4. Spells  5. Exit");
  // ... shop logic
}
```

---

## Deployment

### GitHub Pages (Recommended)

1. Create repo `kings-treasure-web`
2. Push all files
3. Settings → Pages → Deploy from main branch
4. URL: `https://yourusername.github.io/kings-treasure-web`

### Alternative: Netlify

1. Drag & drop folder to netlify.com/drop
2. Instant deploy with custom subdomain

---

## Critical Files to Reference During Implementation

| Python File | Purpose | JS Equivalent |
|-------------|---------|---------------|
| `battle_system.py` (1,350 lines) | Combat mechanics, Character class | `battle.js`, `character.js` |
| `constants.py` (337 lines) | All game data | `constants.js` |
| `task_random_encounters.py` (560 lines) | Story flow, locations | `game.js` |
| `save_system.py` (323 lines) | Save/load structure | `saves.js` |
| `colors.py` (371 lines) | ANSI colors → CSS classes | `terminal.css` |
| `shop_system.py` (380 lines) | Shop logic | `shop.js` |

---

## Sprite Integration

Copy all 121 PNGs from `assets/sprites/` to `web/assets/sprites/`:

```
assets/sprites/
├── enemies/     (50 files) - skeleton_bandits.png, lake_monster.png, etc.
├── weapons/     (27 files) - rusty_sword.png, iron_dagger.png, etc.
├── shields/     (10 files) - wooden_buckler.png, iron_shield.png, etc.
├── items/       (13 files) - health_potion.png, gold_coins.png, etc.
└── locations/   (21 files) - crossroads.png, lake.png, castle.png, etc.
```

Display with `image-rendering: pixelated` CSS for crisp scaling.

---

## Mobile Considerations

- Input field auto-focuses for easy typing
- Responsive layout (sprite panel stacks on mobile)
- Touch-friendly text size (16px minimum)
- Virtual keyboard works with text input

```css
@media (max-width: 768px) {
  #game-container {
    flex-direction: column;
  }
  #sprite-panel {
    width: 100%;
    order: -1;  /* Sprite above terminal on mobile */
  }
}
```

---

## Summary

**Total estimated JS:** ~2,000 lines (less than Python version)
**Bundle size:** <100KB + sprites
**Hosting:** Free (GitHub Pages)
**Maintainability:** Easy - plain JS, no build step needed
