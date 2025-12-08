# Battle Skeleton Implementation Plan

## Goal

Create a playable walkthrough of The King's Curse with:
- Working multi-enemy battle system
- Working companion system
- Placeholder enemies (no art, generic names/stats)
- No story text - just battle flow
- Testable from start to finish

This is the **skeleton** - we layer story, art, and polish on top later.

---

## Development Environment

### Separate Test Server

Build the curse battle system in isolation from the main game. This allows:
- Testing without playing through Part 1
- Starting with a pre-configured endgame character
- Iterating quickly on battle mechanics
- Clean merge into main game when ready

### Folder Structure

```
kings-treasure/web-edition/
├── index.html              ← Main game (port 8080)
├── js/
│   ├── battle.js           ← Existing (shared)
│   ├── character.js        ← Existing (shared)
│   ├── constants.js        ← Existing (shared)
│   ├── terminal.js         ← Existing (shared)
│   ├── sidebar.js          ← Existing (shared)
│   └── ...
│
└── curse-test/             ← Separate test environment
    ├── index.html          ← Curse test entry (port 8081)
    └── js/
        ├── companion.js        ← NEW: Companion class
        ├── groupBattle.js      ← NEW: Multi-enemy battle
        ├── curseConstants.js   ← NEW: Curse-specific enemies
        └── curseTest.js        ← NEW: Test harness
```

### Code Sharing

The curse-test files **import** from the parent `../js/` folder:
```javascript
import { Character } from '../js/character.js';
import { calculateDamage, createEnemy } from '../js/battle.js';
import { Terminal } from '../js/terminal.js';
```

No code duplication - when ready to merge, just move the new files into `js/`.

### Pre-Configured Test Character

Start with a fully-equipped Level 4 Warrior:

```javascript
// Pre-built character for testing
character.initializeClass('male', 'warrior');
character.level = 4;
character.hp = 65;
character.maxHp = 65;
character.attack = 12;
character.defense = 6;
character.weapon = "Legacy Blade";
character.shield = "Gladiator's Shield";
character.hasLegacyBlade = true;
character.hasGladiatorShield = true;
character.legacyBladeKills = 5;  // +5 damage from kills
character.spells = ['Thunderbolt', 'Time Freeze'];
character.potions = 3;
character.superiorPotions = 2;
character.gold = 200;
```

### Running the Test Environment

```bash
# Terminal 1: Main game (optional)
cd kings-treasure/web-edition
python3 -m http.server 8080

# Terminal 2: Curse test
cd kings-treasure/web-edition/curse-test
python3 -m http.server 8081
```

Access at: `http://localhost:8081`

### Merging Into Main Game

When the battle skeleton is working:
1. Move `curse-test/js/*.js` files to `js/`
2. Update import paths
3. Add entry point in `game.js` (after treasure room)
4. Delete `curse-test/` folder

---

## What We're Building

A test harness that lets you play through all 11 battles with proper solo/companion transitions:

```
SOLO (No Companion):                          Player DEF: 11
1. Curse Shades        → 1v2 SOLO (55 HP each, 20 ATK, 4 DEF) = 18 dmg/round
2. Rescue Companion    → 1v1 SOLO (110 HP, 31 ATK, 5 DEF)     = 20 dmg/round

[Companion Joins - choose Kira or Auren]

WITH COMPANION:                               Player DEF: 12 (Void-Touched Shield)
3. Fork A              → 2v2 (80 HP each, 23 ATK, 5 DEF)      = 22 dmg/round
4. Fork B-1            → 2v2 (85 HP each, 24 ATK, 6 DEF)      = 24 dmg/round
5. Fork B-2            → 2v1 big monster (160 HP, 38 ATK, 7 DEF) = 26 dmg/round

                                              Player DEF: 13 (Warden's Barrier)
6. Final Fork 1        → 2v3 swarm (55 HP each, 22 ATK, 4 DEF) = 27 dmg/round
7. Final Fork 2        → 2v2 (95 HP each, 28 ATK, 7 DEF)      = 30 dmg/round
8. Final Fork Boss     → 2v1+2 (Boss: 180/29ATK, Minions: 45/21ATK) = 32 dmg/round
9. Cursed King         → 2v1 (200 HP, 47 ATK, 8 DEF)          = 34 dmg/round

[Companion Cannot Follow - "You must face this alone"]

SOLO AGAIN:                                   Player DEF: 14 (Celestial Shield)
10. Wraith Self        → 1v1 SOLO (160 HP, 50 ATK, 8 DEF)     = 36 dmg/round
11. Malachar           → 1v1 SOLO (250 HP, 52 ATK, 12 DEF)    = 38 dmg/round
```

Linear sequence with proper transitions between solo and companion modes.

---

## Files to Create

### 1. `companion.js` - Companion Class

```javascript
// Companion class - similar to Enemy but friendly
export class Companion {
    constructor(type) {
        this.type = type;  // 'kira' or 'auren'
        this.name = type === 'kira' ? 'Kira' : 'Auren';
        this.role = type === 'kira' ? 'healer' : 'tank';

        // Stats (placeholder values)
        this.hp = 50;
        this.maxHp = 50;
        this.attack = 8;
        this.defense = 4;

        this.isConscious = true;
    }

    // Take damage, return true if fainted
    takeDamage(amount) { ... }

    // Heal player
    healPlayer(player, amount) { ... }

    // Attack enemy
    attackEnemy(enemy) { ... }

    // AI decision making
    decideAction(player, enemies) { ... }

    // Recover after battle (50% HP if fainted)
    recoverAfterBattle() { ... }
}
```

### 2. `groupBattle.js` - Multi-Combatant Battle

```javascript
// GroupBattle - orchestrates player + companion vs multiple enemies
export class GroupBattle {
    constructor(terminal, character, companion, enemyTypes) {
        this.terminal = terminal;
        this.character = character;
        this.companion = companion;
        this.enemies = enemyTypes.map(type => createEnemy(type));
        this.curseDrainInterval = 3;  // Every 3 turns
        this.turnCount = 0;
    }

    // Main battle loop
    async run() {
        while (true) {
            // Player turn
            await this.playerTurn();
            if (this.checkVictory()) return true;

            // Companion turn (if conscious)
            if (this.companion.isConscious) {
                await this.companionTurn();
                if (this.checkVictory()) return true;
            }

            // All enemies act
            for (const enemy of this.enemies) {
                if (enemy.hp > 0) {
                    await this.enemyTurn(enemy);
                    if (this.checkDefeat()) return false;
                }
            }

            // Curse HP drain
            this.turnCount++;
            if (this.turnCount % this.curseDrainInterval === 0) {
                this.applyCurseDrain();
                if (this.checkDefeat()) return false;
            }
        }
    }

    // Player selects action and target
    async playerTurn() { ... }

    // Companion acts (player commands or AI)
    async companionTurn() { ... }

    // Single enemy acts
    async enemyTurn(enemy) { ... }

    // Apply curse damage
    applyCurseDrain() { ... }

    // Target selection UI
    async selectTarget() { ... }

    // Victory check (all enemies defeated)
    checkVictory() { ... }

    // Defeat check (player HP 0)
    checkDefeat() { ... }
}
```

### 3. `curseGame.js` - Test Harness / Game Flow

```javascript
// CurseGame - simplified game flow for testing battles
export class CurseGame {
    constructor(terminal) {
        this.terminal = terminal;
        this.character = null;
        this.companion = null;
    }

    async start() {
        // Quick setup - skip to curse section
        this.setupTestCharacter();
        this.setupCompanion('kira');  // or 'auren'

        // Run through all battles
        await this.runBattleSequence();
    }

    setupTestCharacter() {
        // Create a mid-game character for testing
        this.character = new Character("Hero");
        this.character.initializeClass('male', 'warrior');
        this.character.level = 5;
        this.character.hp = 70;
        this.character.maxHp = 70;
        // etc.
    }

    async runBattleSequence() {
        const battles = [
            { name: "Curse Shades", enemies: ['curse_shade', 'curse_shade'] },
            { name: "Random Enemy", enemies: ['placeholder_1'] },
            { name: "Fork A-1", enemies: ['placeholder_2'] },
            { name: "Fork A-2", enemies: ['placeholder_3'] },
            { name: "Fork B-1", enemies: ['placeholder_4'] },
            { name: "Fork B-2", enemies: ['placeholder_5'] },
            { name: "Fork B-3", enemies: ['placeholder_6'] },
            { name: "Path Boss", enemies: ['placeholder_boss'] },
            { name: "Cursed King", enemies: ['cursed_king'] },
            { name: "Wraith Self", enemies: ['wraith_self'] },
            { name: "Curse Creator", enemies: ['malachar'] },
        ];

        for (const battle of battles) {
            this.terminal.print(`\n=== BATTLE: ${battle.name} ===`);
            const groupBattle = new GroupBattle(
                this.terminal,
                this.character,
                this.companion,
                battle.enemies
            );
            const victory = await groupBattle.run();

            if (!victory) {
                this.terminal.print("GAME OVER");
                return;
            }

            // Companion recovery
            this.companion.recoverAfterBattle();

            // Basic healing between battles
            this.character.hp = Math.min(this.character.hp + 20, this.character.maxHp);
        }

        this.terminal.print("\n=== VICTORY! You broke the curse! ===");
    }
}
```

---

## Files to Modify

### `constants.js` - Add Placeholder Enemies

```javascript
// Placeholder enemies for testing
export const CURSE_ENEMY_DATA = {
    'curse_shade': {
        name: "Curse Shade",
        hp: 40,
        attack: 12,
        defense: 3,
        xp: 50,
        gold: 25,
        isBoss: false
    },
    'placeholder_1': {
        name: "Test Enemy 1",
        hp: 45,
        attack: 10,
        defense: 4,
        xp: 40,
        gold: 20,
        isBoss: false
    },
    // ... more placeholders
    'cursed_king': {
        name: "The Cursed King",
        hp: 100,
        attack: 18,
        defense: 8,
        xp: 200,
        gold: 100,
        isBoss: true
    },
    'wraith_self': {
        name: "Your Wraith Self",
        hp: 90,
        attack: 20,
        defense: 6,
        xp: 200,
        gold: 0,
        isBoss: true
    },
    'malachar': {
        name: "Malachar",
        hp: 150,
        attack: 22,
        defense: 10,
        xp: 500,
        gold: 0,
        isBoss: true
    }
};
```

### `sidebar.js` - Multi-Enemy Display

Add ability to show:
- Companion HP bar
- Multiple enemy HP bars with letter labels (A, B, C)

### `battle.js` - Reuse `calculateDamage()`

No changes needed - this function already works for any attacker/defender pair.

---

## Implementation Steps

### Step 1: Create Companion Class ✅ COMPLETE
- [x] Create `curse-test/js/companion.js`
- [x] Basic stats and HP management
- [x] `takeDamage()`, `heal()`, `attack()` methods
- [x] Simple AI for `decideAction()` (heal if player low, otherwise attack)
- [x] `recoverAfterBattle()` method
- [x] Two companions: Kira (Healer: 50 HP, 8 ATK, 4 DEF) and Auren (Tank: 60 HP, 10 ATK, 6 DEF)

### Step 2: Create GroupBattle Class ✅ COMPLETE
- [x] Create `curse-test/js/groupBattle.js`
- [x] Turn order: Player → Companion → All Enemies
- [x] Player turn with target selection (A/B/C for multiple enemies)
- [x] Companion turn with command options (Attack/Heal/Let decide)
- [x] Enemy turns (each enemy acts with 1.5s delay between)
- [x] Victory/defeat checks
- [x] Curse HP drain every 3 turns
- [x] Targeting AI (70% to tank, 30% to player with healer)
- [x] AoE spell support (Chain Lightning, Cursed Wave)

### Step 3: Update Sidebar ✅ COMPLETE
- [x] Add companion display section (in `curseSidebar.js`)
- [x] Add multi-enemy display with letter labels
- [x] HP bars for all combatants

### Step 4: Add Enemies and Items ✅ COMPLETE
- [x] Add `CURSE_ENEMY_DATA` to `curseConstants.js`
- [x] All 11 battles with properly scaled enemies
- [x] Final bosses: Cursed King (200 HP), Wraith Self (160 HP), Malachar (250 HP)
- [x] New weapons: Curse Reaver (16), Shadow's Edge (18), Soul Render (20)
- [x] New shields: Void-Touched (6), Warden's Barrier (7), Celestial Shield (8)
- [x] Drop tables for all 11 battles

### Step 5: Create Test Harness ✅ COMPLETE
- [x] Create `curse-test/js/curseMain.js`
- [x] Setup test character (Level 4 Warrior with endgame gear)
- [x] Setup companion selection (after battle 2)
- [x] Linear 11-battle sequence
- [x] Solo/companion transitions
- [x] "You must face this alone" scene before battle 10
- [x] Drop handling after each battle

### Step 6: Update Character Progression ✅ COMPLETE
- [x] Add Void Bolt, Chain Lightning, Cursed Wave to `constants.js`
- [x] Add level 5/6/7 spell unlocks to `character.js`

### Step 7: Entry Point ✅ COMPLETE
- [x] Test environment at `curse-test/index.html`
- [x] Access via `http://localhost:8080/curse-test/`

---

## Test Scenarios

### Must Work: ✅ ALL IMPLEMENTED
1. ✅ Player attacks, selects target from multiple enemies
2. ✅ Companion heals player on command
3. ✅ Companion attacks on command
4. ✅ Companion AI decides action when told to
5. ✅ Enemies attack player or companion (based on targeting AI)
6. ✅ Enemy defeated, removed from combat
7. ✅ All enemies defeated = victory
8. ✅ Player HP 0 = defeat
9. ✅ Companion HP 0 = faints, fights alone
10. ✅ Companion recovers after battle
11. ✅ Curse drains HP every 3 turns
12. ✅ Full 11-battle sequence completable
13. ✅ AoE spells hit all enemies
14. ✅ 1.5s delay between enemy attacks

### Nice to Have (Later):
- [ ] Companion ability cooldowns
- [ ] Enemy special attacks

### Part 1 Mechanics Ported: ✅ COMPLETE
- [x] All spell types working correctly:
  - Attack spells do ATK + damageBonus (not flat damage)
  - Energy Surge heals player to full HP
  - Soul Drain damages and heals simultaneously
  - Time Freeze damages + skips enemy's next turn
  - AoE spells hit all enemies
- [x] Defend/charge mechanic (charge-up power attack)
- [x] Gladiator Shield counter-attack (25% chance, 50% of damage taken)
- [x] Legacy Blade kill tracking (+1 damage per enemy killed)
- [x] Level up spell notifications

---

## Targeting AI

Enemy targeting based on companion role:

| Companion | Player Target % | Companion Target % |
|-----------|-----------------|-------------------|
| Auren (Tank) | 30% | 70% |
| Kira (Healer) | 70% | 30% |

Implementation in `groupBattle.js`:
```javascript
// Choose target based on companion role
let targetPlayer = Math.random() < (this.companion.role === 'Tank' ? 0.3 : 0.7);
let target = targetPlayer ? this.character : this.companion;
```

---

## Message Pacing

Between each enemy's attack, add a 1.5-2 second delay:

```javascript
for (const enemy of livingEnemies) {
    // Enemy attacks...
    this.terminal.print(`${enemy.name} attacks for ${damage} damage!`);

    // Pause between enemy attacks
    await this.terminal.delay(1500);  // 1.5 seconds
}
```

This gives players time to read and process each attack.

---

## Drops Per Battle

| # | Battle | Potion | Item Drop |
|---|--------|--------|-----------|
| 1 | Curse Shades | Health Potion | — |
| 2 | Rescue | Health Potion | Void-Touched Shield (DEF 6) |
| 3 | Fork A | Health Potion | Curse Reaver (DMG 16) |
| 4 | Fork B-1 | Health Potion | Strength Elixir |
| 5 | Fork B-2 | Health Potion | Warden's Barrier (DEF 7) |
| 6 | Final Fork 1 | Health Potion | Defense Potion |
| 7 | Final Fork 2 | Health Potion | — |
| 8 | Final Fork Boss | Superior Potion | Shadow's Edge (DMG 18) |
| 9 | Cursed King | Superior Potion | Celestial Shield (DEF 8) |
| 10 | Wraith Self | Superior Potion | Soul Render (DMG 20) |
| 11 | Malachar | Superior Potion | (Story item) |

---

## New Spells (Level Up)

| Level | Spell | Type | Damage |
|-------|-------|------|--------|
| 5 | Void Bolt | Single target | +15 |
| 6 | Chain Lightning | AoE (all enemies) | +10 each |
| 7 | Cursed Wave | AoE (all enemies) | +12 each |

### AoE Implementation
```javascript
// In playerCastSpell()
if (spell.isAoE) {
    const livingEnemies = this.enemies.filter(e => e.hp > 0);
    for (const enemy of livingEnemies) {
        enemy.takeDamage(spell.damage);
        this.terminal.print(`  ${enemy.name} takes ${spell.damage} damage!`);
    }
}
```

---

## XP and Leveling

| Battle | XP | Cumulative | Level After |
|--------|-----|------------|-------------|
| 1 | 100 | 100 | 4 |
| 2 | 120 | 220 | 4 |
| 3 | 140 | 360 | **5** |
| 4 | 160 | 520 | 5 |
| 5 | 200 | 720 | 5 |
| 6 | 180 | 900 | **6** |
| 7 | 180 | 1080 | 6 |
| 8 | 330 | 1410 | 6 |
| 9 | 300 | 1710 | **7** |
| 10 | 350 | 2060 | 7 |
| 11 | 500 | 2560 | 7+ |

---

## Estimated Scope

| Component | Complexity | Est. Time |
|-----------|------------|-----------|
| Companion class | Medium | 1-2 hours |
| GroupBattle class | High | 3-4 hours |
| Sidebar updates | Medium | 1-2 hours |
| Placeholder enemies | Low | 30 min |
| Test harness | Low | 1 hour |
| Testing & fixes | Medium | 2-3 hours |
| **Total** | | **8-12 hours** |

---

## Success Criteria ✅ ALL MET

The skeleton is complete when:
1. ✅ You can start a "curse test" from the game → `http://localhost:8080/curse-test/`
2. ✅ You fight 11 battles in sequence
3. ✅ Multi-enemy combat works (target selection, varied enemies)
4. ✅ Companion system works (commands, AI, fainting)
5. ✅ Curse HP drain works (every 3 turns)
6. ✅ You can win or lose
7. ✅ The feel of 2v2 and 2v3 combat is testable

**BATTLE SKELETON: COMPLETE**

---

## Next Steps

Now that the skeleton is complete, the next phase is:

### Phase 2: Story Layer
- [ ] Curse reveal sequence (after Part 1 victory)
- [ ] Companion introduction dialogue
- [ ] Companion choice scene
- [ ] Path-specific narrative between battles
- [ ] "You must face this alone" expanded scene
- [ ] Victory/ending sequences

### Phase 3: Art Assets
- [ ] Enemy sprites for all 11 battles
- [ ] Wraith player sprites (6: male/female × 3 classes)
- [ ] Companion sprites (Kira, Auren + unconscious versions)
- [ ] Location backgrounds
- [ ] New weapon/shield sprites

---

*Document updated: December 4, 2024*
*Status: Phase 1 (Battle Skeleton) COMPLETE + Part 1 Mechanics Ported*

---

## Implementation Notes

### Enemy ATK Scaling Formula
ATK = Target_Damage_Per_Round + Player_Defense

Example for Battle 5 (Depth Horror):
- Target damage: 26
- Player DEF: 12 (6 base + 6 Void-Touched Shield)
- ATK needed: 26 + 12 = 38

### Damage Progression
Total damage per round increases by 2 each battle (linear scaling):
- Battle 1: 18 → Battle 11: 38
- This accounts for player getting stronger via level ups and gear drops

### Key Code Changes Made
1. `curseConstants.js` - Updated all enemy ATK values
2. `groupBattle.js` - Fixed spell system, added Time Freeze, Gladiator Shield, Legacy Blade
3. `constants.js` - Already had correct SPELLS definitions
