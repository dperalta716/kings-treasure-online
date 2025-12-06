#!/usr/bin/env python3
"""
Generate, regenerate, or edit game art using Gemini.

Usage:
    python generate_art.py iron_dagger                      # Generate PNG to backup folder
    python generate_art.py --edit iron_dagger "remove cloak"  # Edit existing image (PNG only)
    python generate_art.py --deploy iron_dagger             # Deploy latest PNG as WebP to game
    python generate_art.py --deploy iron_dagger 5           # Deploy specific version (v5.png)
    python generate_art.py --list                           # List all available prompts
    python generate_art.py --list weapons                   # List prompts in category
    python generate_art.py --info iron_dagger               # Show prompt for item
"""

import os
import re
import sys
import subprocess
from pathlib import Path
from datetime import datetime

try:
    from google import genai
    from google.genai import types
    from PIL import Image
except ImportError as e:
    print(f"Error: Missing package - {e}")
    print("Run: pip install google-genai pillow")
    sys.exit(1)

# Configuration
API_KEY = "AIzaSyDMktWImKTQIN9LieZz0d9hOokVpS_Jous"
PROJECT_DIR = Path("/Users/david/Documents/Obsidian Vaults/claude-code-demo/kings-treasure/web-edition")
SPRITES_DIR = PROJECT_DIR / "assets" / "sprites"
BACKUP_DIR = PROJECT_DIR.parent / "sprites_backup_png"
PROMPTS_FILE = PROJECT_DIR / "image_prompts.md"

# Category to directory mapping
CATEGORY_MAP = {
    "enemies": "enemies",
    "weapons": "weapons",
    "shields": "shields",
    "special_items": "items",
    "items": "items",
    "locations": "locations",
    "spells": "items",
    "potions": "items"
}

client = genai.Client(api_key=API_KEY)


def parse_prompts():
    """Parse all prompts from the master prompts file."""
    prompts = {}

    if not PROMPTS_FILE.exists():
        print(f"Error: Prompts file not found: {PROMPTS_FILE}")
        sys.exit(1)

    content = PROMPTS_FILE.read_text()

    # Pattern to match each entry
    pattern = r'### (.+?)\n\*\*ID:\*\* `(.+?)`\n\*\*Category:\*\* (.+?)\n\n```\n(.*?)```'
    matches = re.findall(pattern, content, re.DOTALL)

    for name, item_id, category, prompt in matches:
        prompts[item_id.strip()] = {
            "name": name.strip(),
            "id": item_id.strip(),
            "category": category.strip(),
            "prompt": prompt.strip()
        }

    return prompts


def get_sprite_dir(category):
    """Get the sprite directory for a category."""
    return SPRITES_DIR / CATEGORY_MAP.get(category, "items")


def get_backup_dir(category):
    """Get the backup directory for a category."""
    return BACKUP_DIR / CATEGORY_MAP.get(category, "items")


def get_next_version(backup_dir, item_id):
    """Find the next version number for backups."""
    backup_dir.mkdir(parents=True, exist_ok=True)
    existing = list(backup_dir.glob(f"{item_id}_v*.png")) + list(backup_dir.glob(f"{item_id}_v*.webp"))

    if not existing:
        return 1

    versions = []
    for f in existing:
        match = re.search(rf'{item_id}_v(\d+)', f.name)
        if match:
            versions.append(int(match.group(1)))

    return max(versions, default=0) + 1


def get_latest_png(backup_dir, item_id):
    """Find the latest PNG version in the backup folder for editing."""
    existing_pngs = list(backup_dir.glob(f"{item_id}_v*.png"))

    if not existing_pngs:
        return None

    # Find the highest version number
    latest = None
    latest_version = 0
    for f in existing_pngs:
        match = re.search(rf'{item_id}_v(\d+)\.png$', f.name)
        if match:
            version = int(match.group(1))
            if version > latest_version:
                latest_version = version
                latest = f

    return latest


def generate_image(prompt):
    """Generate image using Gemini 2.5 Flash (text-to-image)."""
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["Image"]
            )
        )

        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                return part.inline_data.data

        print("  Error: No image data in response")
        return None

    except Exception as e:
        print(f"  Error generating image: {e}")
        return None


def edit_image(image_path, edit_prompt):
    """Edit existing image using Gemini 3 Pro (image-to-image)."""
    try:
        image = Image.open(image_path)

        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=[edit_prompt, image],
        )

        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                return part.inline_data.data

        print("  Error: No image data in response")
        return None

    except Exception as e:
        print(f"  Error editing image: {e}")
        return None


def convert_to_webp(png_path, webp_path):
    """Resize to 512px and convert to WebP at 80 quality."""
    temp_resized = "/tmp/resized_sprite.png"

    # Resize to 512x512
    result = subprocess.run(
        ["sips", "-Z", "512", str(png_path), "--out", temp_resized],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"  Error resizing: {result.stderr}")
        return False

    # Convert to WebP
    result = subprocess.run(
        ["cwebp", "-q", "80", temp_resized, "-o", str(webp_path)],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"  Error converting to WebP: {result.stderr}")
        return False

    # Cleanup temp file
    os.remove(temp_resized)
    return True


def generate_art(item_id):
    """Generate or regenerate art for an item (PNG only, no WebP)."""
    prompts = parse_prompts()

    if item_id not in prompts:
        print(f"Error: Unknown item ID '{item_id}'")
        print(f"Use --list to see available items")
        return False

    item = prompts[item_id]
    print(f"\nGenerating: {item['name']} ({item_id})")
    print(f"Category: {item['category']}")

    backup_dir = get_backup_dir(item['category'])

    # Generate new image
    print("  Calling Gemini API...")
    image_data = generate_image(item['prompt'])

    if not image_data:
        return False

    # Save PNG to backup folder only
    backup_dir.mkdir(parents=True, exist_ok=True)

    print(f"  Generated PNG: {len(image_data)} bytes")

    # Save the PNG with version number
    version = get_next_version(backup_dir, item_id)
    png_backup = backup_dir / f"{item_id}_v{version}.png"
    png_backup.write_bytes(image_data)
    print(f"  Saved: {png_backup}")

    print(f"\n  Use '--deploy {item_id}' to deploy as WebP when ready")
    return True


def edit_art(item_id, edit_prompt):
    """Edit existing art for an item (PNG only, no WebP)."""
    prompts = parse_prompts()

    if item_id not in prompts:
        print(f"Error: Unknown item ID '{item_id}'")
        print(f"Use --list to see available items")
        return False

    item = prompts[item_id]
    backup_dir = get_backup_dir(item['category'])
    sprite_dir = get_sprite_dir(item['category'])

    # Find the latest PNG in backup folder (full resolution source)
    latest_png = get_latest_png(backup_dir, item_id)

    if not latest_png:
        # Fall back to webp if no PNG exists
        webp_file = sprite_dir / f"{item_id}.webp"
        if not webp_file.exists():
            print(f"Error: No existing image found for {item_id}")
            print("Use generate_art.py <item_id> to create one first")
            return False
        source_file = webp_file
        print(f"\nEditing: {item['name']} ({item_id})")
        print(f"  Warning: Using WebP (no PNG backup found). Results may be lower quality.")
    else:
        source_file = latest_png
        print(f"\nEditing: {item['name']} ({item_id})")
        print(f"  Source: {latest_png.name} (full resolution)")

    print(f"Edit instruction: {edit_prompt}")

    # Copy source to temp for editing
    temp_source = Path(f"/tmp/{item_id}_source{source_file.suffix}")
    import shutil
    shutil.copy(source_file, temp_source)

    # Edit the image from temp copy
    print("  Calling Gemini API (edit mode)...")
    image_data = edit_image(temp_source, edit_prompt)

    if not image_data:
        return False

    # Save PNG to backup folder only
    backup_dir.mkdir(parents=True, exist_ok=True)

    print(f"  Edited PNG: {len(image_data)} bytes")

    # Save the edited PNG with version number
    version = get_next_version(backup_dir, item_id)
    png_backup = backup_dir / f"{item_id}_v{version}.png"
    png_backup.write_bytes(image_data)
    print(f"  Saved: {png_backup}")

    print(f"\n  Use '--deploy {item_id}' to deploy as WebP when ready")
    return True


def deploy_art(item_id, version=None):
    """Deploy a PNG from backup folder as WebP to the game assets."""
    prompts = parse_prompts()

    if item_id not in prompts:
        print(f"Error: Unknown item ID '{item_id}'")
        print(f"Use --list to see available items")
        return False

    item = prompts[item_id]
    backup_dir = get_backup_dir(item['category'])
    sprite_dir = get_sprite_dir(item['category'])

    # Find the PNG to deploy
    if version:
        png_file = backup_dir / f"{item_id}_v{version}.png"
        if not png_file.exists():
            print(f"Error: {png_file.name} not found")
            # List available versions
            existing = sorted(backup_dir.glob(f"{item_id}_v*.png"))
            if existing:
                print(f"Available versions:")
                for f in existing:
                    print(f"  {f.name}")
            return False
    else:
        png_file = get_latest_png(backup_dir, item_id)
        if not png_file:
            print(f"Error: No PNG found for {item_id}")
            return False

    print(f"\nDeploying: {item['name']} ({item_id})")
    print(f"  Source: {png_file.name}")

    # Convert to WebP and save to sprites folder
    sprite_dir.mkdir(parents=True, exist_ok=True)
    webp_path = sprite_dir / f"{item_id}.webp"

    print("  Converting to 512px WebP...")
    if convert_to_webp(png_file, webp_path):
        print(f"  Deployed: {webp_path}")
        return True

    return False


def list_prompts(category_filter=None):
    """List all available prompts."""
    prompts = parse_prompts()

    # Group by category
    by_category = {}
    for item_id, item in prompts.items():
        cat = item['category']
        if category_filter and cat != category_filter:
            continue
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(item)

    print(f"\nAvailable prompts ({len(prompts)} total):\n")

    for category in sorted(by_category.keys()):
        items = by_category[category]
        print(f"## {category.upper()} ({len(items)})")
        for item in sorted(items, key=lambda x: x['id']):
            print(f"  {item['id']}: {item['name']}")
        print()


def show_info(item_id):
    """Show prompt info for an item."""
    prompts = parse_prompts()

    if item_id not in prompts:
        print(f"Error: Unknown item ID '{item_id}'")
        return

    item = prompts[item_id]
    print(f"\n### {item['name']}")
    print(f"**ID:** `{item['id']}`")
    print(f"**Category:** {item['category']}")
    print(f"\n```\n{item['prompt']}\n```")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    arg = sys.argv[1]

    if arg == "--list":
        category = sys.argv[2] if len(sys.argv) > 2 else None
        list_prompts(category)
    elif arg == "--info":
        if len(sys.argv) < 3:
            print("Usage: generate_art.py --info <item_id>")
            sys.exit(1)
        show_info(sys.argv[2])
    elif arg == "--edit":
        if len(sys.argv) < 4:
            print("Usage: generate_art.py --edit <item_id> \"edit instructions\"")
            sys.exit(1)
        item_id = sys.argv[2]
        edit_prompt = sys.argv[3]
        success = edit_art(item_id, edit_prompt)
        sys.exit(0 if success else 1)
    elif arg == "--deploy":
        if len(sys.argv) < 3:
            print("Usage: generate_art.py --deploy <item_id> [version]")
            sys.exit(1)
        item_id = sys.argv[2]
        version = int(sys.argv[3]) if len(sys.argv) > 3 else None
        success = deploy_art(item_id, version)
        sys.exit(0 if success else 1)
    elif arg.startswith("-"):
        print(f"Unknown option: {arg}")
        print(__doc__)
        sys.exit(1)
    else:
        # Generate art for the given item ID
        success = generate_art(arg)
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
