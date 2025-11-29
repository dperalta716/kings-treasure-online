# The King's Curse - Expansion Plan

## Overview

**Goal:** Double the size of The King's Treasure with a surprise story expansion that triggers after the player "wins" the original game.

**Core Concept:** When the player finds the treasure, a dramatic twist reveals the treasure was cursed all along. This opens an entirely new act with new worlds, enemies, companions, and mechanics.

---

## The Curse Reveal

### Trigger Point
The current victory screen in `treasureRoom()` transforms into the curse reveal.

### Sequence
1. **False Victory** - Player sees the treasure, thinks they've won
2. **Screen Corruption** - Visual glitch effects, text distortion
3. **Treasure Transforms** - The treasure sprite changes to a cursed version
4. **Curse Entity Appears** - Exposition about the curse's origin
5. **Curse Applied** - Player receives three curse debuffs
6. **New Quest Begins** - "Seek the sanctuaries to break the curse..."

### Design Goal
Maximum shock value - the player should genuinely believe they won before the twist hits.

---

## Curse Debuff System

### The Three Curse Marks

| Curse | Effect | Cleansed At |
|-------|--------|-------------|
| **Mark of Weakness** | -15% damage dealt | First Sanctuary |
| **Mark of Vulnerability** | +20% damage received | Second Sanctuary |
| **Mark of Despair** | -25% healing effectiveness | Third Sanctuary |

### Implementation
- Curses are applied immediately after the reveal
- Each curse visually displayed in the sidebar
- Curses persist across saves
- Cleansing requires reaching a sanctuary in each realm
- After all three cleansed, player gains "Curse Breaker" status (immunity to curse attacks)

---

## Branching Structure

### Design Philosophy
The expansion should double the game's content through **meaningful branching** - not just one linear path, but multiple paths with sub-paths within them.

### Structure
```
[Original Game Victory]
         |
         v
   [Curse Reveal]
         |
         v
[Three Portal Choice] ← First major branch
    /    |    \
   /     |     \
  v      v      v
Path A  Path B  Path C   ← Each rescues different companion
  |      |      |
  v      v      v
[Sub-branches within each path]
  |      |      |
  v      v      v
[Paths converge for final boss]
```

### Replayability
- 3 different companions (one per initial path)
- Different enemies and environments per path
- Sub-choices within each path
- Multiple endings based on choices

---

## Companion System

### Overview
After the curse reveal, the player chooses one of three paths. Each path leads to rescuing a different companion who joins the party.

### The Three Companions

#### Path A: Kira, the Shadow Scout
- **Rescued in:** The Hollow Depths
- **Role:** Rogue/DPS
- **Stats:** High attack, low defense
- **Personality:** Sarcastic, streetwise, practical
- **Backstory:** Former treasure hunter who got trapped in the void
- **Abilities:**
  - **Shadow Strike** - +50% damage on next attack
  - **Evade** - Avoid the next incoming attack

#### Path B: Seraph, the Fallen Guardian
- **Rescued in:** The Shattered Heavens
- **Role:** Tank
- **Stats:** High defense, medium attack
- **Personality:** Noble, formal, guilt-ridden
- **Backstory:** Corrupted angelic warrior seeking redemption
- **Abilities:**
  - **Divine Shield** - Block damage for the player
  - **Smite** - Holy damage attack

#### Path C: Lyra, the Cursed Priestess
- **Rescued in:** The Eternal Blight
- **Role:** Healer/Support
- **Stats:** Low attack, healing focus
- **Personality:** Wise, weary, dark humor
- **Backstory:** Tried to purify the treasure 50 years ago, was trapped
- **Abilities:**
  - **Healing Prayer** - Restore HP to player
  - **Purify** - Boost player stats temporarily

### Companion AI (Hybrid System)

**How it works:**
1. Each turn, the companion AI decides what action to take
2. The suggested action is displayed: *"Lyra wants to cast Healing Prayer."*
3. Player can press Enter to accept, or type a command to override
4. AI priorities are role-based:
   - Kira (DPS): Attacks, finishes low-HP enemies
   - Seraph (Tank): Protects player when HP is low, taunts
   - Lyra (Healer): Heals player when HP drops below threshold

**AI Decision Factors:**
- Player HP percentage
- Enemy HP percentage
- Available abilities (cooldowns)
- Companion's role/personality

---

## The Three Realms

Each realm has:
- Unique theme and visual style
- 4-5 new enemies
- 1 mini-boss
- 1 realm boss
- 1 sanctuary (cleanses one curse)
- Sub-path choices within the realm

### Realm 1: The Hollow Depths

**Theme:** Underground caverns where reality breaks down - void corruption, impossible geometry

**Visual Style:**
- Bioluminescent corruption (sickly greens, diseased purples)
- Floating rock formations
- Walls covered in desperate scratch marks

**Story:** Ancient miners dug too deep and found a tear in reality where the curse originated.

**Companion:** Kira (Shadow Scout)

**Enemies:**
| Enemy | HP | ATK | DEF | Description |
|-------|----|----|-----|-------------|
| Void Crawler | 55 | 14 | 4 | Insectoid, phases between dimensions |
| Corrupted Miner | 50 | 13 | 6 | Undead miner with glowing ore in bones |
| Shadow Stalker | 48 | 16 | 3 | Wolf-like shadow predator |
| Echo of Madness (mini-boss) | 65 | 15 | 5 | Manifestation of collective madness |
| **Depth Warden (boss)** | 95 | 19 | 8 | Ancient guardian corrupted by void |

**Boss Mechanics:**
- Void Shield: First 5 damage of each attack absorbed
- At 50% HP: Summons a Void Crawler

**Drops:**
- Void Edge (Weapon) - 14 damage, 15% chance to ignore defense

**Sanctuary:** The Luminous Altar - cleanses Mark of Weakness

---

### Realm 2: The Shattered Heavens

**Theme:** Floating sky islands - fragments of a celestial kingdom

**Visual Style:**
- Broken chunks of sky palace floating in void
- Rusted golden chains connecting islands
- Perpetual twilight

**Story:** The Sky Wardens tried to contain the curse with holy barriers. They failed and were corrupted.

**Companion:** Seraph (Fallen Guardian)

**Enemies:**
| Enemy | HP | ATK | DEF | Description |
|-------|----|----|-----|-------------|
| Fallen Warden | 58 | 15 | 5 | Corrupted angelic warrior |
| Chain Horror | 52 | 17 | 4 | Sentient chains seeking victims |
| Sky Revenant | 55 | 14 | 6 | Ghosts of those who fell |
| The Heretic (mini-boss) | 70 | 16 | 6 | Warden who embraced the curse |
| **Seraphim of Ruin (boss)** | 100 | 20 | 7 | The greatest Sky Warden, now corrupted |

**Boss Mechanics:**
- Divine Wrath: Charges for one turn, then deals 2x damage
- Can be interrupted if player deals 20+ damage during charge

**Drops:**
- Fallen Blade (Weapon) - 15 damage, +20% vs cursed enemies
- Celestial Ward (Shield) - 5 defense, curse attack immunity

**Sanctuary:** The Celestial Font - cleanses Mark of Vulnerability

---

### Realm 3: The Eternal Blight

**Theme:** Corrupted paradise - a garden realm twisted into endless decay

**Visual Style:**
- Dead trees with pulsing curse veins
- Flowers that bloom with corruption
- Rivers of dark sludge

**Story:** The Garden of Origins was where life began. The curse turned creation into mockery.

**Companion:** Lyra (Cursed Priestess)

**Enemies:**
| Enemy | HP | ATK | DEF | Description |
|-------|----|----|-----|-------------|
| Blighted Treant | 65 | 14 | 8 | Rotting tree guardian |
| Corruption Bloom | 45 | 18 | 3 | Beautiful flower with hidden fangs |
| Plague Bearer | 60 | 15 | 5 | Shambling spreader of corruption |
| Withered Shepherd (mini-boss) | 75 | 17 | 6 | Former caretaker consumed by curse |
| **Mother of Thorns (boss)** | 110 | 21 | 9 | Corrupted Spirit of Spring |

**Boss Mechanics:**
- Regeneration: Heals 5 HP per turn
- Stopped by fire damage (player receives "Purifying Flame" item before fight)

**Drops:**
- Thornweaver (Weapon) - 16 damage, 10% poison (3 dmg/turn for 3 turns)
- Blight Guard (Shield) - 6 defense, poison immunity

**Sanctuary:** The Seed of Light - cleanses Mark of Despair

---

## Group Battle System

### Overview
The expansion introduces multi-combatant battles: player + companion vs 1-2 enemies.

### Battle Types
- **2v1:** Player + Companion vs Boss/Strong Enemy
- **2v2:** Player + Companion vs Two Enemies

### Turn Order
1. Player chooses action
2. Companion AI suggests action (player can override)
3. First enemy acts
4. Second enemy acts (if 2v2)
5. Repeat

### Target Selection
When multiple enemies exist:
```
Select target:
  1. Void Crawler (45/55 HP)
  2. Shadow Stalker (32/48 HP)
> _
```

### Enemy AI (for 2v2)
- Enemies may target player or companion
- Some enemies prioritize the weaker target
- Some enemies focus on whoever damaged them

---

## Final Act: The Void Heart

### Prerequisites
- All three realms completed
- All three curses cleansed
- Companion at full bond/trust

### Location
The Void Heart - a twisted reflection of the original treasure room. The place where the curse was born.

### Pre-Boss Gauntlet

| Enemy | HP | ATK | DEF |
|-------|----|-----|-----|
| Curse Manifestation | 80 | 20 | 8 |
| Memory Shade | 70 | 22 | 6 |

Memory Shades are twisted versions of enemies the player already defeated.

---

## Final Boss: Malachar, The Eternal Curse

### Lore
Malachar was once a god of ambition who sought to transcend godhood. He achieved immortality but became corrupted - transforming into a curse that spreads stagnation and decay. The King's Treasure was his first anchor in the mortal world.

### Phase 1: Bound Form
| Stat | Value |
|------|-------|
| HP | 150 |
| ATK | 22 |
| DEF | 10 |

- Still partially bound by ancient chains
- Standard attacks

### Phase 2: Unbound (triggers at 75 HP)
| Stat | Value |
|------|-------|
| HP | Continues |
| ATK | 26 |
| DEF | 8 |

- Chains shatter, true form revealed
- New ability: Despair Wave (25% chance to skip player's turn)

### Phase 3: Desperate (triggers at 30 HP)
- Malachar attempts to possess the companion
- **Story Beat:** Companion uses their signature ability to sacrifice power and weaken him
- Malachar's HP resets to 50, but DEF drops to 5
- Final push to victory

### Boss Abilities
- **Curse Pulse** (every 3 turns) - AoE damage, reduced by Curse Breaker status
- **Soul Drain** - Heals 10 HP when attack connects
- **Last Gasp** (at 10 HP) - Massive 40 damage attack, companion provides protection

---

## Endings

### After Defeating Malachar

The curse is broken. The companion survives but is weakened. The player faces a choice:

### Choice Prompt
```
Lyra looks at the now-purified treasure, then at the exit.
She turns to you with an unreadable expression.

1. "You should rest now. You've earned peace."
2. "Come with me. The world needs people like you."
```

### Ending A: Peace
- Companion's spirit ascends, finally free
- Player returns home a legend
- Bittersweet but hopeful tone
- "THE END"

### Ending B: New Beginning
- Companion joins the player in the outside world
- They leave together as partners
- Hopeful tone, hints at future adventures
- "THE END... FOR NOW"

---

## Content Summary

### New Enemies: 19
- Hollow Depths: 5 (including boss)
- Shattered Heavens: 5 (including boss)
- Eternal Blight: 5 (including boss)
- Void Heart: 2 elite + Malachar (3 phases)

### New Weapons: 4
- Void Edge (14 dmg)
- Fallen Blade (15 dmg)
- Thornweaver (16 dmg)
- Malediction (18 dmg) - Final boss drop, lifesteal

### New Shields: 3
- Celestial Ward (5 def)
- Blight Guard (6 def)
- Depth Barrier (5 def)

### New Companions: 3
- Kira (Rogue)
- Seraph (Tank)
- Lyra (Healer)

### New Locations: ~11
- Cursed Treasure Room
- Cursed Threshold (hub)
- Hollow Depths + Luminous Altar
- Shattered Heavens + Celestial Font
- Eternal Blight + Seed of Light
- Void Heart
- Ending screens (x2)

### Art Assets Needed: ~65 sprites
- 19 enemies x 2 (normal + defeated) = 38
- 3 companions x 2 (normal + weakened) = 6
- 11 locations
- 7 items (weapons/shields)
- 3 curse mark icons

---

## Technical Implementation Notes

### Key Files to Modify
- `battle.js` - Group battle system, companion turns, curse modifiers
- `character.js` - Curse array, companion reference, effective stats
- `game.js` - New story flow, curse reveal, realm locations
- `constants.js` - All new enemies, items, companions, curses
- `sidebar.js` - Companion display, curse marks, multi-enemy HP
- `saves.js` - Serialize curses, companion, new locations

### New Files to Create
- `companion.js` - Companion class and AI logic
- Potentially `curses.js` - Curse system management

### Save Compatibility
- New save version required
- Migration function for old saves (start from curse reveal)

---

## Open Questions

1. **Sub-path details:** What specific choices exist within each realm?
2. **Companion dialogue:** How much companion commentary during exploration?
3. **Difficulty scaling:** Should curse debuffs stack, or apply one at a time?
4. **New Game+:** After beating the expansion, any carry-over to new playthroughs?
5. **Achievement system:** Track completions of each path?

---

## Implementation Phases

### Phase 1: Foundation
- Curse debuff system
- Curse reveal sequence
- Save system updates

### Phase 2: First Realm (Proof of Concept)
- Hollow Depths complete
- Kira companion implemented
- Basic companion AI
- 2v1 battles working

### Phase 3: Companion System Polish
- All three companions
- Hybrid AI with override
- Companion abilities

### Phase 4: Remaining Realms
- Shattered Heavens
- Eternal Blight
- All realm bosses

### Phase 5: Final Act
- Void Heart
- Malachar (all phases)
- Endings

### Phase 6: Polish
- Balance testing
- Art asset generation
- Bug fixes

---

*Document created: November 2024*
*Status: Planning Phase*
