# The King's Curse - Expansion Plan

## Overview

**Goal:** Double the size of The King's Treasure with a surprise story expansion that triggers after the player "wins" the original game.

**Core Concept:** When the player finds the treasure, a dramatic twist reveals the treasure was cursed all along. The player transforms into a Wraith version of their character and must find a way to break the curse before the corruption consumes them completely.

**Design Philosophy:** Two fully-developed paths instead of three linear ones. Each path is almost as substantial as the original King's Treasure, providing maximum replayability.

---

## The Curse Reveal

### Trigger Point
The current victory screen in `treasureRoom()` transforms into the curse reveal.

### Sequence
1. **False Victory** - Player sees the treasure, thinks they've won
2. **Screen Corruption** - Visual glitch effects, text distortion
3. **Treasure Transforms** - The treasure sprite changes to a cursed version
4. **Wraith Transformation** - Player's character becomes a Wraith version (Wraith Warrior/Mage/Rogue)
5. **Guardian's Warning** - The freed Guardian explains you must find the curse's source
6. **Companions Appear** - Kira and Auren arrive, offering two different paths

### Why You Don't Become the New Guardian
The Guardian was BOUND to the treasure. When you defeat him, you break the binding - but the curse still exists in the world. It's seeking a new host (you), but you escaped before it could anchor you. The Guardian tells you:
- The curse will consume you unless you destroy it at the source
- Find the Cursed King (first victim) and free him
- Then face the one who created the curse

### Design Goal
Maximum shock value - the player should genuinely believe they won before the twist hits.

---

## Curse Mechanic - HP Drain

### How It Works
The curse doesn't reduce stats - it slowly corrupts you by draining HP over time.

```
Every X turns: "The curse pulses through you... [-3 HP]"
```

### Game Over Condition
If HP reaches 0 from curse drain (or combat), you fully transform into the Wraith - game over, no return. This creates urgency and makes the healer companion essential.

### Wraith Transformation
After the curse reveal, the player's character becomes a Wraith version:
- Wraith Warrior (male/female)
- Wraith Mage (male/female)
- Wraith Rogue (male/female)

This is visual + the HP drain mechanic. The sidebar updates to show the corrupted version.

---

## Branching Structure

### Simplified Path (Shared Until Final Fork)

```
[Original Game Victory]
         |
         v
   [Curse Reveal]
         |
         v
[Wraith Transformation]
         |
         v
  [Battle 1: Curse Shades]     ← 1v2 SOLO
         |
         v
  [Battle 2: Rescue Companion] ← 1v1 SOLO
         |
    ┌────┴────┐
    Choose companion:
    KIRA or AUREN
    └────┬────┘
         |
   [SHARED PATH]
         |
  [Battle 3: Fork A]           ← 2v2 (1 of 2 random)
         |
  [Battle 4: Fork B-1]         ← 2v2
  [Battle 5: Fork B-2]         ← 2v1 (big monster)
         |
    ┌────┴────┐
    Final Fork diverges
    based on companion:
    ↓              ↓
  KIRA           AUREN
  (Mines)        (Sky)
    ↓              ↓
[Battles 6-8]  [Battles 6-8]   ← Path-specific enemies
    └────┬────┘
         |
  [Battle 9: Cursed King]      ← 2v1 LAST with companion
         |
   "You must face this alone"
         |
  [Battle 10: Wraith Self]     ← 1v1 SOLO
         |
  [Battle 11: Malachar]        ← 1v1 SOLO
```

### Replayability
- 2 companion choices with different abilities and Final Fork paths
- Final Fork (3 battles) has path-specific enemies and environments
- Same core experience, different tactical feel based on companion
- Multiple endings based on choices

---

## Companion System

### Overview
After the curse reveal, both companions approach you at the Threshold. You choose one to follow - the other's path remains unexplored until replay.

### Meeting the Companions

```
[After Curse Shades appear]

Two figures approach from opposite directions:

From the shadows below, a woman emerges - pale, marked with
dark veins, but with kind eyes. She carries a staff wrapped
in faintly glowing bandages.

From the mountain path above, a figure descends - once radiant,
now dimmed. Broken chains hang from his wrists. Wings folded
and scarred.

KIRA: "You carry the curse. I can see it spreading.
       I know a way - deep below, the Serpent Lords guard
       jewels of immense power. They could save us both."

AUREN: "The corruption will consume you if you descend into
        darkness. Come with me. The Celestial Throne has been
        usurped, but if we can restore it... divine power
        could burn the curse away."

[CHOICE]
1. Follow Kira into the Depths
2. Follow Auren into the Heights
```

You choose your companion, then immediately face the Curse Shades together.

### The Two Companions

#### Kira, the Wounded Healer
- **Path:** The Depths (underground)
- **Role:** Healer/Support
- **Theme:** Carries her own corruption - a kindred spirit
- **Personality:** Empathetic, darkly humorous, survivor
- **Backstory:** Afflicted by a curse-like disease, seeks the Serpent Lords' jewels to heal both herself and you
- **Abilities:**
  - **Healing Touch** - Restore HP to player
  - **Purifying Light** - Boost player stats temporarily
  - **Sacrifice** - Take damage meant for player

#### Auren, the Fallen Angel
- **Path:** The Heights (mountains → sky realm)
- **Role:** Tank/Protector
- **Theme:** Good angel cast out by an evil usurper
- **Personality:** Noble, protective, seeking redemption
- **Backstory:** Was a leader in the Celestial Kingdom until a true "fallen angel" (evil) seized power and cast him out. Seeks to reclaim the throne.
- **Abilities:**
  - **Divine Shield** - Block damage for the player
  - **Smite** - Holy damage attack
  - **Radiant Aura** - Reduce enemy damage

### Companion Commands (On Their Turn)

When it's the companion's turn:

```
KIRA'S TURN

What should Kira do?
  1. Attack [target]
  2. Heal me
  3. Let her decide

> _
```

- If "Let her decide" → AI acts immediately, no confirmation
- AI evaluates: player HP, enemy HP, tactical situation

### Companion Fainting

When companion HP reaches 0:
- They collapse, unconscious for remainder of battle
- Player fights alone (brutal)
- After battle: Companion recovers at 50% HP
- Narrative: "Kira staggers to her feet, weakened but alive."

---

## The Two Paths

### Path of Depths (Kira)

**Setting:** Underground caverns where reality breaks down - void corruption, serpent beings

**Physical Direction:** DOWN - descending into the earth

**Goal:** Reach the Serpent Lords who guard jewels of immense power. These jewels can break the curse for both you and Kira.

**Narrative Arc:**
1. Descend with Kira into the corrupted depths
2. Face void creatures and corrupted miners
3. Navigate through increasingly unstable reality
4. Reach the Serpent Lords' domain
5. Defeat the Serpent Lord and claim the jewel

**Tone:** Gritty, survival horror, intimate partnership with Kira

### Path of Heights (Auren)

**Setting:** Mountains leading to floating sky realm - celestial kingdom in ruins

**Physical Direction:** UP - ascending the mountains, then into the sky

**Goal:** Help Auren reclaim the Celestial Throne from the evil fallen angel who usurped it. Once restored to power, Auren can use divine authority to burn away the curse.

**Narrative Arc:**
1. Climb the mountains with Auren
2. Enter the Shattered Heavens (sky realm)
3. Face corrupted angels and the usurper's forces
4. Confront the evil Fallen Angel ruler
5. Restore Auren to his rightful place

**Irony:** Auren "fell" from heaven, but the true villain is a "fallen angel" (morally fallen) who rules there now.

**Tone:** Epic, tragic nobility, redemption story

---

## Battle Flow (11 Battles Total)

```
BATTLE STRUCTURE

Solo Battles (No Companion):
1. Curse Shades                      →  1v2 SOLO
2. Rescue Companion                  →  1v1 SOLO

With Companion:
3. Fork A (1 of 2 random)            →  2v2
4. Fork B - Battle 1                 →  2v2
5. Fork B - Battle 2                 →  2v1 (big monster)
6. Final Fork - Battle 1             →  2v3 (swarm)
7. Final Fork - Battle 2             →  2v2
8. Final Fork - Boss                 →  2v1 + 2 minions
9. Cursed King                       →  2v1 (LAST with companion)

Solo Again ("You must face this alone"):
10. Wraith Self                      →  1v1 SOLO
11. Malachar                         →  1v1 SOLO
─────────────────────────────────────────────────────
TOTAL                                → 11 battles
```

### Combat Format Mix
- **1v1**: Solo fights, big single enemies
- **2v1**: Boss fights, large monsters
- **2v2**: Standard encounters with companion
- **2v3**: Swarm fights (weaker individuals)
- **2v1+minions**: Boss with adds

### Comparison to Part 1

| | Part 1 | Part 2 |
|---|---|---|
| **Total Battles** | 9 | 11 |
| **Multi-enemy battles** | 0 | Most |
| **Solo battles** | All | 4 (1-2, 10-11) |
| **With companion** | 0 | 7 (3-9) |

---

## Group Battle System

### Core Change
The expansion introduces multi-combatant battles: player + companion vs 1-3 enemies.

### Turn Order

```
ROUND START
    ↓
┌─────────────────────────────────────┐
│ 1. PLAYER TURN                      │
│    - Choose action                  │
│    - If attacking: choose target    │
│    - Action resolves                │
├─────────────────────────────────────┤
│ 2. COMPANION TURN                   │
│    - Player commands or lets AI decide│
│    - Action resolves                │
├─────────────────────────────────────┤
│ 3. ALL ENEMIES ACT                  │
│    - Enemy 1 acts                   │
│    - Enemy 2 acts (if present)      │
│    - Enemy 3 acts (if present)      │
└─────────────────────────────────────┘
    ↓
ROUND END → Curse HP drain → Check victory/defeat → Next round
```

Player and companion act as a TEAM, then enemies get their phase.

### Target Selection

When multiple enemies exist:
```
Select target:
  [A] Void Crawler (45/55 HP)
  [B] Shadow Stalker (32/48 HP)
  [C] Curse Spawn (28/40 HP)
> _
```

### Varied Enemy Groups

Enemies within a group can have different stats, creating tactical decisions:

```
Example: Void Pack

  [A] Void Crawler      [B] Void Lurker       [C] Void Spitter
      HP: 45/45             HP: 55/55             HP: 35/35
      ATK: 12               ATK: 14               ATK: 18
      DEF: 4                DEF: 6                DEF: 2

Tactical decision:
- Kill Spitter first (high damage, low HP)?
- Kill Lurker first (tankiest)?
- Spread damage?
```

### Enemy Targeting AI

Enemies choose targets based on companion role:

| Companion | Player Target % | Companion Target % |
|-----------|-----------------|-------------------|
| Auren (Tank) | 30% | 70% |
| Kira (Healer) | 70% | 30% |

This makes companion choice tactical:
- **Auren** draws fire, protecting the player
- **Kira** stays safe to heal, but player takes more hits

### UI Changes

**Sidebar (2v multiple):**
```
┌─────────────────┐
│   HERO          │
│ HP: ████████░░  │
│ 65/80           │
├─────────────────┤
│   COMPANION     │
│ Kira (Healer)   │
│ HP: ██████████  │
│ 50/50           │
├─────────────────┤
│   ENEMIES       │
│ A: Crawler      │
│    ████████░░   │
│ B: Lurker       │
│    ██████████   │
│ C: Spitter      │
│    ██████████   │
└─────────────────┘
```

---

## The Void Heart - Final Act

### Prerequisites
- Complete either path (Depths or Heights)
- Have the Jewel (Kira path) OR Auren empowered (Auren path)

### The Formula for Breaking the Curse
Either path gives you PART of what you need:
- **Depths path:** The Serpent Lord's Jewel
- **Heights path:** Auren restored to divine power

But this alone isn't enough. You must also defeat the source of the curse. Only then can the jewel heal you OR Auren's power burn the curse away.

### Three Final Bosses

#### Boss 1: The Cursed King
- The original victim of the curse
- Tragic fight - he begs for freedom
- You defeat him, freeing his soul
- He reveals the curse creator's location
- **Theme:** Mercy, release from suffering

#### Boss 2: Your Wraith Self
- The full Wraith form that's been waiting for you
- A dark mirror - your corruption given form
- If you had fully transformed, this is what you'd become
- Defeating it proves you've rejected the curse
- **Theme:** Confronting your shadow, refusing fate

#### Boss 3: The Curse Creator (Malachar)
- The entity behind everything
- Created the curse, corrupted the King, cursed the treasure
- Final battle with companion at your side
- **Theme:** Destroying evil at its source

### Victory
After defeating Malachar:
- The jewel finally heals you (Kira path)
- OR Auren's divine power burns away the curse (Auren path)
- Companion's own affliction is also healed
- Endings based on choices

---

## Enemy Stat Scaling

### Baseline
- Treasure Guardian (Part 1 final boss): 115 HP, 30 ATK, 10 DEF
- Player starts Part 2 with ~11 defense (6 base + 5 Gladiator Shield)
- Total damage per round scales linearly: 18 → 20 → 22 → ... → 38

### Defense Progression (from shield drops)
- Battles 1-2: 11 DEF (Gladiator Shield +5)
- Battles 3-5: 12 DEF (Void-Touched Shield +6)
- Battles 6-9: 13 DEF (Warden's Barrier +7)
- Battles 10-11: 14 DEF (Celestial Shield +8)

### Complete Enemy Stats (All 11 Battles)

| # | Battle | Format | HP | ATK | DEF | Target Dmg/Round |
|---|--------|--------|-----|-----|-----|------------------|
| 1 | Curse Shades | 1v2 Solo | 55 each | 20 | 4 | 18 (9×2) |
| 2 | Rescue | 1v1 Solo | 110 | 31 | 5 | 20 |
| 3 | Fork A | 2v2 | 80 each | 23 | 5 | 22 (11×2) |
| 4 | Fork B-1 | 2v2 | 85 each | 24 | 6 | 24 (12×2) |
| 5 | Fork B-2 | 2v1 | 160 | 38 | 7 | 26 |
| 6 | Final Fork 1 | 2v3 | 55 each | 22 | 4 | 27 (9×3) |
| 7 | Final Fork 2 | 2v2 | 95 each | 28 | 7 | 30 (15×2) |
| 8 | Final Fork Boss | 2v1+2 | Boss: 180, Minions: 45 | 29/21 | 9/4 | 32 (16+8+8) |
| 9 | Cursed King | 2v1 | 200 | 47 | 8 | 34 |
| 10 | Wraith Self | 1v1 Solo | 160 | 50 | 8 | 36 |
| 11 | Malachar | 1v1 Solo | 250 | 52 | 12 | 38 |

---

## Player Progression

### XP and Leveling

| Battle | XP Award | Level After |
|--------|----------|-------------|
| 1. Curse Shades | 100 | 4 |
| 2. Rescue | 120 | 4 |
| 3. Fork A | 140 | **5** |
| 4. Fork B-1 | 160 | 5 |
| 5. Fork B-2 | 200 | 5 |
| 6. Final Fork 1 | 180 | **6** |
| 7. Final Fork 2 | 180 | 6 |
| 8. Final Fork Boss | 330 | 6 |
| 9. Cursed King | 300 | **7** |
| 10. Wraith Self | 350 | 7 |
| 11. Malachar | 500 | 7 (progress to 8) |

### Player Stats by Level

| Level | HP | Base ATK | Base DEF |
|-------|-----|----------|----------|
| 4 (start) | 65 | 12 | 6 |
| 5 | 75 | 14 | 7 |
| 6 | 85 | 16 | 8 |
| 7 | 95 | 18 | 9 |

---

## Drops and Rewards

### Weapon Drops

| Weapon | Damage | Drops From |
|--------|--------|------------|
| Legacy Blade | 15 | Part 1 (starting gear) |
| Curse Reaver | 16 | Fork A (Battle 3) |
| Shadow's Edge | 18 | Final Fork Boss (Battle 8) |
| Soul Render | 20 | Wraith Self (Battle 10) |

### Shield Drops

| Shield | Defense | Drops From |
|--------|---------|------------|
| Gladiator's Shield | 4-5 | Part 1 (starting gear) |
| Void-Touched Shield | 6 | Rescue (Battle 2) |
| Warden's Barrier | 7 | Fork B-2 (Battle 5) |
| Celestial Shield | 8 | Cursed King (Battle 9) |

### Complete Drop Table

| # | Battle | Potion | Item Drop |
|---|--------|--------|-----------|
| 1 | Curse Shades | Health Potion | — |
| 2 | Rescue Companion | Health Potion | Void-Touched Shield (DEF 6) |
| 3 | Fork A | Health Potion | Curse Reaver (DMG 16) |
| 4 | Fork B-1 | Health Potion | Strength Elixir |
| 5 | Fork B-2 | Health Potion | Warden's Barrier (DEF 7) |
| 6 | Final Fork 1 | Health Potion | Defense Potion |
| 7 | Final Fork 2 | Health Potion | — |
| 8 | Final Fork Boss | **Superior Potion** | Shadow's Edge (DMG 18) |
| 9 | Cursed King | **Superior Potion** | Celestial Shield (DEF 8) |
| 10 | Wraith Self | **Superior Potion** | Soul Render (DMG 20) |
| 11 | Malachar | **Superior Potion** | (Story: Curse broken) |

---

## New Spells (Level Up)

### Part 2 Spells

| Level | Spell | Type | Damage | Notes |
|-------|-------|------|--------|-------|
| 5 | Void Bolt | Single target | +15 | Strong single hit |
| 6 | Chain Lightning | **AoE** | +10 each | Hits ALL enemies |
| 7 | Cursed Wave | **AoE** | +12 each | Hits ALL enemies |

### AoE Spell Mechanics
When casting an AoE spell against multiple enemies:
```
You cast Chain Lightning!
Magical energy arcs between all enemies!
  Void Crawler takes 10 damage!
  Shadow Stalker takes 10 damage!
  Curse Spawn takes 10 damage!
```

Tactical choice: High single-target damage OR spread damage to all.

---

## Content Summary

### Battles Per Playthrough: 11
- Solo battles: 4 (1-2, 10-11)
- With companion: 7 (3-9)

### New Companions: 2
- Kira (Healer) - 50 HP, 8 ATK, 4 DEF, heals 20 HP
- Auren (Tank) - 60 HP, 10 ATK, 6 DEF, draws aggro

### New Enemy Types: ~15
- Curse Shades (2)
- Rescue enemy (1)
- Fork enemies (4-6)
- Final Fork path-specific enemies (6)
- Bosses: Final Fork Boss, Cursed King, Wraith Self, Malachar

### New Gear: 7 items
- Weapons: Curse Reaver, Shadow's Edge, Soul Render
- Shields: Void-Touched Shield, Warden's Barrier, Celestial Shield
- Consumables: Various potions and elixirs

### New Spells: 3
- Void Bolt (Level 5)
- Chain Lightning (Level 6, AoE)
- Cursed Wave (Level 7, AoE)

### Art Assets Needed
- 6 Wraith player sprites (male/female × 3 classes)
- 2 companion sprites (+ unconscious versions)
- ~15 enemy sprites
- Location backgrounds
- New weapon/shield sprites

---

## Technical Implementation Notes

### Key Files to Modify
- `battle.js` - Group battle system, companion turns, curse HP drain
- `character.js` - Wraith state, companion reference, curse tracking
- `game.js` - New story flow, curse reveal, path locations
- `constants.js` - All new enemies, items, companions
- `sidebar.js` - Companion display, multi-enemy HP bars
- `saves.js` - Serialize companion, curse state, new locations

### New Files to Create
- `companion.js` - Companion class and AI logic
- `groupBattle.js` - Multi-combatant battle orchestration (extends Battle)

### What Carries Over (No Changes Needed)
- `calculateDamage()` function - works for any attacker/defender pair
- All weapon/spell/item effects
- Enemy stats/data structure
- Player character class (base)
- Shop system

### Save Compatibility
- New save version required
- Migration function for old saves (start from curse reveal)

### Asset Loading Strategy
The King's Curse uses a **separate preloader** from the base game:
- **Base Game Preloader** (`preloader.js`) - Loads all original King's Treasure assets on initial page load
- **Curse Preloader** (new file) - Only triggered after curse reveal, shows loading screen while loading curse-specific assets
- **Curse Assets Location**: `assets/sprites/Kings Curse/` with subfolders: `enemies/`, `companions/`, `weapons/`, `shields/`, `locations/`
- **Backup/Source PNGs**: `sprites_backup_png/Kings Curse/` (same structure)

This approach keeps initial load time fast and creates a dramatic pause during the curse reveal transition.

---

## Implementation Phases

### Phase 1: Battle Skeleton ✅ COMPLETE
Create a playable walkthrough with:
- ✅ Multi-enemy battle system working
- ✅ Companion system working
- ✅ All 11 battles with proper stats
- ✅ Solo/companion transitions
- ✅ Targeting AI based on companion role
- ✅ Message pacing (1.5s delays)
- ✅ AoE spell support
- ✅ Drop system (weapons, shields, potions)
- ✅ Level 5/6/7 spell unlocks

### Phase 2: Story Layer
- [ ] Add narrative text between battles
- [ ] Companion dialogue
- [ ] Curse reveal sequence
- [ ] Path-specific story beats

### Phase 3: Art Assets
- [ ] Wraith player sprites
- [ ] Companion sprites
- [ ] Enemy sprites
- [ ] Location backgrounds

### Phase 4: Polish
- [ ] Balance testing (playtest the 11 battles)
- [ ] Enemy variety and stats tuning
- [ ] Special abilities
- [ ] Sound/effects (if applicable)

---

## Implementation Status

### Files Created (in `curse-test/js/`)

| File | Status | Description |
|------|--------|-------------|
| `companion.js` | ✅ Complete | Companion class (Kira/Auren) with stats, abilities, AI |
| `groupBattle.js` | ✅ Complete | Multi-combatant battle system with targeting AI |
| `curseConstants.js` | ✅ Complete | All 11 battles, enemy stats, weapons, shields |
| `curseMain.js` | ✅ Complete | Test harness with solo/companion flow |
| `curseSidebar.js` | ✅ Complete | Multi-enemy HP display |

### Files Modified (in `js/`)

| File | Changes |
|------|---------|
| `constants.js` | Added Void Bolt, Chain Lightning, Cursed Wave spells |
| `character.js` | Added level 5/6/7 spell unlocks |

### What's Working

1. **Battle Flow**
   - All 11 battles playable in sequence
   - Battles 1-2: Solo (no companion)
   - Battle 2 ends: Choose Kira or Auren
   - Battles 3-9: With companion
   - Battle 9 ends: "You must face this alone"
   - Battles 10-11: Solo again

2. **Combat Mechanics**
   - Multi-enemy targeting (A/B/C selection)
   - Companion commands (Attack/Heal/Let decide)
   - Targeting AI: Auren draws 70% attacks, Kira draws 30%
   - AoE spells hit all enemies
   - 1.5s delay between enemy attacks
   - Defend/charge mechanic (power attack)

3. **Spell System** (✅ All Fixed)
   - Attack spells do ATK + damageBonus (not flat damage)
   - Energy Surge heals to full HP
   - Soul Drain damages enemy + heals player
   - Time Freeze damages + skips enemy's next turn
   - AoE spells (Chain Lightning, Cursed Wave) hit all enemies

4. **Part 1 Special Items**
   - Gladiator Shield: 25% counter-attack (50% of damage taken)
   - Legacy Blade: +1 damage per enemy killed (tracked across battles)
   - Level up spell notifications

5. **Progression**
   - Weapons: Legacy Blade (15) → Curse Reaver (16) → Shadow's Edge (18) → Soul Render (20)
   - Shields: Gladiator's (5) → Void-Touched (6) → Warden's (7) → Celestial (8)
   - Every battle drops a potion (bosses drop superior)
   - Level 5/6/7 unlock new spells

6. **Enemy Scaling**
   - Linear damage progression: 18 → 38 total damage per round
   - ATK formula: Target_Damage + Player_Defense
   - Defense progression accounted for (shield drops at battles 2, 5, 9)

### Running the Test

```bash
cd kings-treasure/web-edition
python3 -m http.server 8080
# Open http://localhost:8080/curse-test/
```

---

*Document updated: December 4, 2024*
*Status: Phase 1 Complete + Part 1 Mechanics Ported - Ready for Phase 2 (Story Layer)*
