/**
 * Preloader - Loads all game assets before starting
 */

// All sprite paths to preload
const SPRITES = [
    // Locations
    'assets/sprites/locations/legend_king.webp',
    'assets/sprites/locations/title_banner.webp',
    'assets/sprites/locations/thiefs_crossroads.webp',
    'assets/sprites/locations/lake.webp',
    'assets/sprites/locations/castle.webp',
    'assets/sprites/locations/shop.webp',
    'assets/sprites/locations/hidden_passages.webp',
    'assets/sprites/locations/ancient_caverns.webp',
    'assets/sprites/locations/forgotten_temple.webp',
    'assets/sprites/locations/three_doors.webp',
    'assets/sprites/locations/crystal_palace.webp',
    'assets/sprites/locations/volcanic_forge.webp',
    'assets/sprites/locations/sunken_ruins.webp',
    'assets/sprites/locations/three_portals.webp',
    'assets/sprites/locations/phantom_citadel.webp',
    'assets/sprites/locations/clockwork_nexus.webp',
    'assets/sprites/locations/forgotten_coliseum.webp',
    'assets/sprites/locations/treasure.webp',
    'assets/sprites/locations/treasure_corrupted.webp',
    'assets/sprites/locations/treasure_castle.webp',
    'assets/sprites/locations/treasure_map.webp',
    'assets/sprites/locations/guardian_antechamber.webp',
    'assets/sprites/locations/wisdom_ending.webp',
    'assets/sprites/locations/game_over.webp',
    'assets/sprites/locations/level_up.webp',

    // Enemies
    'assets/sprites/enemies/skeleton_bandits.webp',
    'assets/sprites/enemies/wizard.webp',
    'assets/sprites/enemies/shark.webp',
    'assets/sprites/enemies/lake_monster.webp',
    'assets/sprites/enemies/bear_rider.webp',
    'assets/sprites/enemies/dragon_knight.webp',
    'assets/sprites/enemies/stone_golem.webp',
    'assets/sprites/enemies/giant_spider.webp',
    'assets/sprites/enemies/ancient_guardian.webp',
    'assets/sprites/enemies/cursed_mummy.webp',
    'assets/sprites/enemies/crystal_guardian.webp',
    'assets/sprites/enemies/crystal_queen.webp',
    'assets/sprites/enemies/fire_elemental.webp',
    'assets/sprites/enemies/forge_master.webp',
    'assets/sprites/enemies/merfolk_warrior.webp',
    'assets/sprites/enemies/kraken.webp',
    'assets/sprites/enemies/spectral_sentinel.webp',
    'assets/sprites/enemies/phantom_knight.webp',
    'assets/sprites/enemies/lord_of_echoes.webp',
    'assets/sprites/enemies/automaton_soldier.webp',
    'assets/sprites/enemies/time_warden.webp',
    'assets/sprites/enemies/clockmaker.webp',
    'assets/sprites/enemies/gladiator_shade.webp',
    'assets/sprites/enemies/arena_master.webp',
    'assets/sprites/enemies/eternal_champion.webp',
    'assets/sprites/enemies/treasures_guardian.webp',

    // Battle sprites (attacking pose)
    'assets/sprites/enemies/skeleton_bandits_battle.webp',
    'assets/sprites/enemies/wizard_battle.webp',
    'assets/sprites/enemies/shark_battle.webp',
    'assets/sprites/enemies/lake_monster_battle.webp',
    'assets/sprites/enemies/bear_rider_battle.webp',
    'assets/sprites/enemies/dragon_knight_battle.webp',
    'assets/sprites/enemies/stone_golem_battle.webp',
    'assets/sprites/enemies/giant_spider_battle.webp',
    'assets/sprites/enemies/ancient_guardian_battle.webp',
    'assets/sprites/enemies/cursed_mummy_battle.webp',
    'assets/sprites/enemies/crystal_guardian_battle.webp',
    'assets/sprites/enemies/crystal_queen_battle.webp',
    'assets/sprites/enemies/fire_elemental_battle.webp',
    'assets/sprites/enemies/forge_master_battle.webp',
    'assets/sprites/enemies/merfolk_warrior_battle.webp',
    'assets/sprites/enemies/kraken_battle.webp',
    'assets/sprites/enemies/spectral_sentinel_battle.webp',
    'assets/sprites/enemies/phantom_knight_battle.webp',
    'assets/sprites/enemies/lord_of_echoes_battle.webp',
    'assets/sprites/enemies/automaton_soldier_battle.webp',
    'assets/sprites/enemies/time_warden_battle.webp',
    'assets/sprites/enemies/clockmaker_battle.webp',
    'assets/sprites/enemies/gladiator_shade_battle.webp',
    'assets/sprites/enemies/arena_master_battle.webp',
    'assets/sprites/enemies/eternal_champion_battle.webp',
    'assets/sprites/enemies/treasures_guardian_battle.webp',

    // Defeated enemies
    'assets/sprites/enemies/skeleton_bandits_defeated.webp',
    'assets/sprites/enemies/wizard_defeated.webp',
    'assets/sprites/enemies/shark_defeated.webp',
    'assets/sprites/enemies/lake_monster_defeated.webp',
    'assets/sprites/enemies/bear_rider_defeated.webp',
    'assets/sprites/enemies/dragon_knight_defeated.webp',
    'assets/sprites/enemies/stone_golem_defeated.webp',
    'assets/sprites/enemies/giant_spider_defeated.webp',
    'assets/sprites/enemies/ancient_guardian_defeated.webp',
    'assets/sprites/enemies/cursed_mummy_defeated.webp',
    'assets/sprites/enemies/crystal_guardian_defeated.webp',
    'assets/sprites/enemies/crystal_queen_defeated.webp',
    'assets/sprites/enemies/fire_elemental_defeated.webp',
    'assets/sprites/enemies/forge_master_defeated.webp',
    'assets/sprites/enemies/merfolk_warrior_defeated.webp',
    'assets/sprites/enemies/kraken_defeated.webp',
    'assets/sprites/enemies/spectral_sentinel_defeated.webp',
    'assets/sprites/enemies/phantom_knight_defeated.webp',
    'assets/sprites/enemies/lord_of_echoes_defeated.webp',
    'assets/sprites/enemies/automaton_soldier_defeated.webp',
    'assets/sprites/enemies/time_warden_defeated.webp',
    'assets/sprites/enemies/clockmaker_defeated.webp',
    'assets/sprites/enemies/gladiator_shade_defeated.webp',
    'assets/sprites/enemies/arena_master_defeated.webp',
    'assets/sprites/enemies/eternal_champion_defeated.webp',
    'assets/sprites/enemies/treasures_guardian_defeated.webp',

    // Weapons
    'assets/sprites/weapons/rusty_sword.webp',
    'assets/sprites/weapons/iron_dagger.webp',
    'assets/sprites/weapons/bronze_mace.webp',
    'assets/sprites/weapons/steel_sword.webp',
    'assets/sprites/weapons/battle_axe.webp',
    'assets/sprites/weapons/knights_blade.webp',
    'assets/sprites/weapons/enchanted_sword.webp',
    'assets/sprites/weapons/dragonslayer.webp',
    'assets/sprites/weapons/stone_crusher.webp',
    'assets/sprites/weapons/venomfang_dagger.webp',
    'assets/sprites/weapons/guardians_glaive.webp',
    'assets/sprites/weapons/pharaohs_khopesh.webp',
    'assets/sprites/weapons/crystal_shard.webp',
    'assets/sprites/weapons/crystal_blade.webp',
    'assets/sprites/weapons/ember_dagger.webp',
    'assets/sprites/weapons/magma_hammer.webp',
    'assets/sprites/weapons/coral_spear.webp',
    'assets/sprites/weapons/trident_of_the_depths.webp',
    'assets/sprites/weapons/obsidian_blade.webp',
    'assets/sprites/weapons/dragonfire_bow.webp',
    'assets/sprites/weapons/fine_bow.webp',
    'assets/sprites/weapons/echo_blade.webp',
    'assets/sprites/weapons/pendulum_blade.webp',
    'assets/sprites/weapons/legacy_blade.webp',

    // Shields
    'assets/sprites/shields/wooden_buckler.webp',
    'assets/sprites/shields/wooden_shield.webp',
    'assets/sprites/shields/steel_shield.webp',
    'assets/sprites/shields/knights_shield.webp',
    'assets/sprites/shields/adamantine_shield.webp',
    'assets/sprites/shields/ethereal_shield.webp',
    'assets/sprites/shields/gear_shield.webp',
    'assets/sprites/shields/gladiators_shield.webp',

    // Characters (gender/class selection)
    'assets/sprites/characters/gender_selection.webp',
    'assets/sprites/characters/male_warrior.webp',
    'assets/sprites/characters/female_warrior.webp',
    'assets/sprites/characters/male_mage.webp',
    'assets/sprites/characters/female_mage.webp',
    'assets/sprites/characters/male_rogue.webp',
    'assets/sprites/characters/female_rogue.webp',

    // Items
    'assets/sprites/items/health_potion.webp',
    'assets/sprites/items/strength_elixir.webp',
    'assets/sprites/items/defense_potion.webp',
    'assets/sprites/items/superior_health_potion.webp',
    'assets/sprites/items/masters_strength_elixir.webp',
    'assets/sprites/items/ultimate_defense_potion.webp',
    'assets/sprites/items/mana_bolt.webp',
    'assets/sprites/items/arcane_blast.webp',
    'assets/sprites/items/energy_surge.webp',
    'assets/sprites/items/astral_strike.webp',
    'assets/sprites/items/thunderbolt.webp',
    'assets/sprites/items/soul_drain.webp',
    'assets/sprites/items/time_freeze.webp',
    'assets/sprites/items/shark_tooth_amulet.webp',
    'assets/sprites/items/shark_tooth_amulet_crumbled.webp',
    'assets/sprites/items/leviathan_scale_gauntlets.webp',
    'assets/sprites/items/ghostweave_cloak.webp',
    'assets/sprites/items/chronometer_pendant.webp',
    'assets/sprites/items/champions_gauntlets.webp',
    'assets/sprites/items/ethereal_shield.webp'
];

/**
 * Preload all game images
 * @param {function} onProgress - Callback with (loaded, total) for progress updates
 * @returns {Promise} - Resolves when all images are loaded
 */
export async function preloadImages(onProgress) {
    let loaded = 0;
    const total = SPRITES.length;

    const promises = SPRITES.map(src => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                loaded++;
                if (onProgress) onProgress(loaded, total);
                resolve();
            };
            img.onerror = () => {
                // Still count failed loads to not block
                loaded++;
                if (onProgress) onProgress(loaded, total);
                resolve();
            };
            img.src = src;
        });
    });

    await Promise.all(promises);
}
