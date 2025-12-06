---
name: kings-treasure-art
description: Generate and manage pixel art for The King's Treasure game. Use when user asks to generate, regenerate, create, edit, revise, change, or update game art/sprites/images for enemies, weapons, shields, items, locations, or spells. Also use when user wants to see or modify image prompts.
---

# King's Treasure Art Generation

Generate and edit 16-bit pixel art sprites using Gemini models.

## Project Paths

- **Project**: `/Users/david/Documents/Obsidian Vaults/claude-code-demo/kings-treasure/web-edition`
- **Script**: `.claude/skills/kings-treasure-art/scripts/generate_art.py`
- **Prompts**: `image_prompts.md`
- **Sprites**: `assets/sprites/{category}/`
- **Backups**: `../sprites_backup_png/{category}/`

Note: The script lives in the local `.claude/skills/` folder. The API key is embedded in the script (not in version control).

## Models

- **Generate/Regenerate** (text-to-image): `gemini-2.5-flash-image`
- **Edit/Revise** (image-to-image): `gemini-3-pro-image-preview`

## Workflow

**Two-step process:**
1. **Generate/Edit** → Saves PNG to backup folder only
2. **Deploy** → Converts chosen PNG to WebP and places in game assets

This allows reviewing multiple generations before committing to the game.

## Commands

### Generate (PNG only)

Creates new image from prompt, saves to backup folder:

```bash
python3 .claude/skills/kings-treasure-art/scripts/generate_art.py <item_id>
```

Run multiple times to generate variations (v1.png, v2.png, etc.)

### Edit (PNG only)

Modifies existing image, saves to backup folder:

```bash
python3 .claude/skills/kings-treasure-art/scripts/generate_art.py --edit <item_id> "edit instructions"
```

Examples:
- `--edit iron_dagger "remove the cloak"`
- `--edit enchanted_sword "add purple flames"`
- `--edit fine_bow "make the background darker"`

### Deploy (PNG → WebP)

Converts a PNG from backup and deploys to game assets:

```bash
python3 .claude/skills/kings-treasure-art/scripts/generate_art.py --deploy <item_id>        # Deploy latest
python3 .claude/skills/kings-treasure-art/scripts/generate_art.py --deploy <item_id> 5      # Deploy v5.png
```

**WebP settings:** 512x512 pixels, quality 80

### Other Commands

```bash
python3 .claude/skills/kings-treasure-art/scripts/generate_art.py --list           # All prompts
python3 .claude/skills/kings-treasure-art/scripts/generate_art.py --list weapons   # By category
python3 .claude/skills/kings-treasure-art/scripts/generate_art.py --info <item_id> # Show specific prompt
```

## When to Use Each Mode

| User says... | Mode | Command |
|-------------|------|---------|
| "generate 3 variations of X" | Generate (run 3x) | `generate_art.py <item_id>` |
| "regenerate the iron dagger" | Generate | `generate_art.py iron_dagger` |
| "remove the cloak from iron dagger" | Edit | `generate_art.py --edit iron_dagger "remove the cloak"` |
| "use version 5" or "use v5" | Deploy | `generate_art.py --deploy iron_dagger 5` |
| "that one is perfect" | Deploy (latest) | `generate_art.py --deploy iron_dagger` |

## Backup System

- **Generate/Edit**: Saves PNG to `../sprites_backup_png/{category}/{item_id}_vN.png`
- **Deploy**: Converts PNG to WebP at `assets/sprites/{category}/{item_id}.webp`
- Version numbers auto-increment (v1, v2, v3...)

## Modifying Prompts

Edit `image_prompts.md` before regenerating. Format:

```markdown
### Display Name
**ID:** `item_id`
**Category:** weapons

(backticks)
16-bit pixel art, dark fantasy RPG game sprite, detailed shading,
vibrant colors, [item description], [display context],
[background description]
(backticks)
```

### Prompt Tips

- Start with: `16-bit pixel art, dark fantasy RPG game sprite, detailed shading, vibrant colors`
- Add `no character` if weapon should be displayed alone
- Match background to enemy that drops the item (check `js/constants.js` for WEAPON_DROPS)

## Using External Images

When user provides their own image file, **always preserve the original** in the backup folder:

### Step 1: Backup the Original Source Image

Copy the user-provided image to the backup folder with proper naming:

```bash
# Naming convention: {item_id}_user_v{N}.{ext}
cp "/path/to/user/image.jpeg" "../sprites_backup_png/{category}/{item_id}_user_v1.jpeg"
```

**Important**: Always keep the original format (PNG, JPEG, etc.) - do NOT convert the backup.

### Step 2: Convert and Deploy

```bash
# Convert user image to 512px WebP for the game
sips -Z 512 "/path/to/user/image.png" --out "/tmp/resized.png"
cwebp -q 80 "/tmp/resized.png" -o "assets/sprites/{category}/{item}.webp"
rm /tmp/resized.png
```

### Naming Convention for User-Provided Images

| Type | Backup Name |
|------|-------------|
| Normal sprite | `{item_id}_user_v1.{ext}` |
| Battle sprite | `{item_id}_battle_user_v1.{ext}` |
| Defeated sprite | `{item_id}_defeated_user_v1.{ext}` |

Increment version number if user provides multiple revisions (v1, v2, v3...)

## Adding New Items

1. Add prompt entry to `image_prompts.md`
2. Run `python3 .claude/skills/kings-treasure-art/scripts/generate_art.py <new_item_id>` to generate
3. Review PNG in backup folder
4. Run `--deploy <new_item_id>` when satisfied
5. Add sprite path to `js/preloader.js`
