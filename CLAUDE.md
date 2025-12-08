# The King's Treasure - Web Edition

**Inherits from**: Main vault CLAUDE.md
**Scope**: This directory and subdirectories only

## Project Overview

Browser-based dark fantasy RPG with terminal-style UI. Turn-based combat, inventory management, branching story paths.

**Tech stack**: Vanilla JavaScript (ES6 modules), HTML5, CSS3, WebP sprites
**No frameworks** - pure DOM manipulation via Terminal class

## Architecture

```
index.html → main.js (entry) → Game (orchestrator)
                                  ├── Terminal (UI output/input)
                                  │   └── Sidebar (stats display)
                                  ├── Battle (combat engine)
                                  ├── Shop (commerce)
                                  └── Character (player state)
```

**Data flow**: Constructor injection, no global state. Game passes terminal to subsystems.

## Key Files

| File | Purpose |
|------|---------|
| `js/constants.js` | **All game balance data** - enemies, weapons, spells, shops |
| `js/game.js` | Story flow, location handlers, state machine |
| `js/battle.js` | Combat mechanics, damage calculation, turn logic |
| `js/character.js` | Character/Enemy classes, stats, leveling |
| `js/terminal.js` | Text output, input handling, sprite display |
| `js/sidebar.js` | Real-time stat bars, inventory display |
| `js/preloader.js` | Asset loading (180+ sprites) |
| `js/saves.js` | localStorage persistence |

## Adding Game Content

### New Enemy
1. Add to `ENEMY_DATA` in constants.js:
   ```javascript
   new_enemy: { name: "Name", hp: 30, attack: 8, defense: 3, xp: 50, gold: 25, isBoss: false }
   ```
2. Optional: Add to `WEAPON_DROPS` or `SPECIAL_ITEM_DROPS`
3. Add 3 sprites to preloader.js: `new_enemy.webp`, `new_enemy_battle.webp`, `new_enemy_defeated.webp`
4. Use in game.js: `new Battle(this.terminal, this.character, 'new_enemy')`

### New Weapon
1. Add to `WEAPON_DAMAGE`: `"Weapon Name": 12`
2. Optional: Add to shop (`SHOP_WEAPONS` or `ADVANCED_SHOP_WEAPONS`) or drops
3. Add sprite to preloader.js

### New Special Item
1. Add to `SPECIAL_ITEM_DROPS` with: `attr`, `name`, `description`, `effect`
2. Add boolean flag to Character constructor: `this.hasNewItem = false`
3. Add to `toJSON()`/`fromJSON()` in character.js for save persistence
4. Implement effect in battle.js damage calculation

### New Spell
1. Add to `SPELLS` with: `unlockLevel`, `type`, `damageBonus`/`healAmount`, `description`
2. Types: `attack`, `heal`, `aoe`, `attackAndFreeze`, `damageAndHeal`

## Combat System

**Turn order**: Player → Enemy → repeat
**Actions**: Attack, Defend (once/battle, charges next attack), Potion, Spell (once/battle each)

**Damage formula** (battle.js:25-112):
```
base = weapon_damage + random(0-2)
× special item multipliers (Leviathan +4, Champion ×1.15, etc.)
× charge multiplier (1.5× if defending used)
- defense (bypassed on crit)
× shark amulet (2× if active)
+ echo blade (20% chance second strike)
```

**Critical hits**: 20% base (+10% Rogue, +15% Ghostweave). Doubles damage, ignores defense.

## Terminal Color Markup

Use in `terminal.print()`:
```
[red], [green], [yellow], [cyan], [magenta], [purple], [blue], [white]
[bold], [italic], [dim], [strike]
[critical], [victory], [defeat], [boss], [gold], [xp], [level-up]
```

## Sprite Naming Convention

`[Item Name]` → `item_name.webp`
- "Shark Tooth Amulet" → `shark_tooth_amulet.webp`
- "Knight's Blade" → `knights_blade.webp`

Enemies need 3 variants: `{name}.webp`, `{name}_battle.webp`, `{name}_defeated.webp`

## Development & Debugging

**Debug shortcuts** (game.js):
- Type `testboss` at title → Skip to treasure castle with max gear
- Type `p` at crossroads → Jump to grand finale
- Type `;` or `'` during combat → Instant victory

**Browser console**:
- `game.character` - Inspect player state
- `game.terminal` - Access UI methods

**Testing changes**: Open `index.html` directly in browser. No build step required.

## Art Assets

Use the `kings-treasure-art` skill for sprite generation, editing, and management.
See: `/Users/david/.claude/skills/kings-treasure-art/SKILL.md`

## Deployment

**GitHub Pages**: https://dperalta716.github.io/kings-treasure-online/
**Repository**: https://github.com/dperalta716/kings-treasure-online

```bash
git add -A && git commit -m "Description" && git push
```
Changes go live in ~1 minute.

## Expansion: The King's Curse (In Progress)

**Status**: Phase 1 (Battle Skeleton) complete, Phase 2 (Story Layer) next
**Location**: `curse-test/` directory for testing
**Full docs**: `docs/expansion_plan.md`

### New Systems Being Added
- **Companion system**: Kira (healer) and Auren (tank) with AI
- **Group battles**: 2v2, 2v3 multi-enemy combat with targeting
- **AoE spells**: Chain Lightning, Cursed Wave hit all enemies
- **Curse mechanic**: HP drain over time, Wraith transformation

### New Files
| File | Purpose |
|------|---------|
| `companion.js` | Companion class, abilities, AI decision-making |
| `groupBattle.js` | Multi-combatant battle orchestration |

### Running the Test Build
```bash
cd kings-treasure/web-edition
python3 -m http.server 8080
# Open http://localhost:8080/curse-test/
```

## Known Patterns & Gotchas

- **Async everywhere**: All user interactions use `await terminal.prompt()`
- **Spell one-per-battle**: Tracked in `usedSpells[]`, reset after combat
- **Charged state locks actions**: When charged, player MUST attack (no potions/spells)
- **Legacy Blade stacks across battles**: `legacyBladeKills` persists until game end
- **Shark Amulet consumed on use**: Marked used, then removed in handleVictory()
- **Guardian battle special case**: `isGuardianBattle` flag skips victory fanfare
