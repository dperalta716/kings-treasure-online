/**
 * Preloader - Loads all game assets before starting
 */

// All sprite paths to preload
const SPRITES = [
    // Locations
    'assets/sprites/locations/title_banner.png',
    'assets/sprites/locations/thiefs_crossroads.png',
    'assets/sprites/locations/lake.png',
    'assets/sprites/locations/castle.png',
    'assets/sprites/locations/shop.png',
    'assets/sprites/locations/hidden_passages.png',
    'assets/sprites/locations/ancient_caverns.png',
    'assets/sprites/locations/forgotten_temple.png',
    'assets/sprites/locations/three_doors.png',
    'assets/sprites/locations/crystal_palace.png',
    'assets/sprites/locations/volcanic_forge.png',
    'assets/sprites/locations/sunken_ruins.png',
    'assets/sprites/locations/three_portals.png',
    'assets/sprites/locations/phantom_citadel.png',
    'assets/sprites/locations/clockwork_nexus.png',
    'assets/sprites/locations/forgotten_coliseum.png',
    'assets/sprites/locations/treasure.png',
    'assets/sprites/locations/game_over.png',

    // Enemies
    'assets/sprites/enemies/skeleton_bandits.png',
    'assets/sprites/enemies/wizard.png',
    'assets/sprites/enemies/shark.png',
    'assets/sprites/enemies/lake_monster.png',
    'assets/sprites/enemies/bear_rider.png',
    'assets/sprites/enemies/dragon_knight.png',
    'assets/sprites/enemies/stone_golem.png',
    'assets/sprites/enemies/giant_spider.png',
    'assets/sprites/enemies/ancient_guardian.png',
    'assets/sprites/enemies/cursed_mummy.png',
    'assets/sprites/enemies/crystal_guardian.png',
    'assets/sprites/enemies/crystal_queen.png',
    'assets/sprites/enemies/fire_elemental.png',
    'assets/sprites/enemies/forge_master.png',
    'assets/sprites/enemies/merfolk_warrior.png',
    'assets/sprites/enemies/kraken.png',
    'assets/sprites/enemies/spectral_sentinel.png',
    'assets/sprites/enemies/phantom_knight.png',
    'assets/sprites/enemies/lord_of_echoes.png',
    'assets/sprites/enemies/automaton_soldier.png',
    'assets/sprites/enemies/time_warden.png',
    'assets/sprites/enemies/clockmaker.png',
    'assets/sprites/enemies/gladiator_shade.png',
    'assets/sprites/enemies/arena_master.png',
    'assets/sprites/enemies/eternal_champion.png',

    // Defeated enemies
    'assets/sprites/enemies/skeleton_bandits_defeated.png',
    'assets/sprites/enemies/wizard_defeated.png',
    'assets/sprites/enemies/shark_defeated.png',
    'assets/sprites/enemies/lake_monster_defeated.png',
    'assets/sprites/enemies/bear_rider_defeated.png',
    'assets/sprites/enemies/dragon_knight_defeated.png',
    'assets/sprites/enemies/stone_golem_defeated.png',
    'assets/sprites/enemies/giant_spider_defeated.png',
    'assets/sprites/enemies/ancient_guardian_defeated.png',
    'assets/sprites/enemies/cursed_mummy_defeated.png',
    'assets/sprites/enemies/crystal_guardian_defeated.png',
    'assets/sprites/enemies/crystal_queen_defeated.png',
    'assets/sprites/enemies/fire_elemental_defeated.png',
    'assets/sprites/enemies/forge_master_defeated.png',
    'assets/sprites/enemies/merfolk_warrior_defeated.png',
    'assets/sprites/enemies/kraken_defeated.png',
    'assets/sprites/enemies/spectral_sentinel_defeated.png',
    'assets/sprites/enemies/phantom_knight_defeated.png',
    'assets/sprites/enemies/lord_of_echoes_defeated.png',
    'assets/sprites/enemies/automaton_soldier_defeated.png',
    'assets/sprites/enemies/time_warden_defeated.png',
    'assets/sprites/enemies/clockmaker_defeated.png',
    'assets/sprites/enemies/gladiator_shade_defeated.png',
    'assets/sprites/enemies/arena_master_defeated.png',
    'assets/sprites/enemies/eternal_champion_defeated.png',

    // Weapons
    'assets/sprites/weapons/rusty_sword.png',
    'assets/sprites/weapons/iron_dagger.png',
    'assets/sprites/weapons/bronze_mace.png',
    'assets/sprites/weapons/steel_sword.png',
    'assets/sprites/weapons/battle_axe.png',
    'assets/sprites/weapons/knights_blade.png',
    'assets/sprites/weapons/enchanted_sword.png',
    'assets/sprites/weapons/dragonslayer.png',
    'assets/sprites/weapons/stone_crusher.png',
    'assets/sprites/weapons/venomfang_dagger.png',
    'assets/sprites/weapons/guardians_glaive.png',
    'assets/sprites/weapons/pharaohs_khopesh.png',
    'assets/sprites/weapons/crystal_shard.png',
    'assets/sprites/weapons/crystal_blade.png',
    'assets/sprites/weapons/ember_dagger.png',
    'assets/sprites/weapons/magma_hammer.png',
    'assets/sprites/weapons/coral_spear.png',
    'assets/sprites/weapons/trident_of_the_depths.png',
    'assets/sprites/weapons/obsidian_blade.png',
    'assets/sprites/weapons/dragonfire_bow.png',
    'assets/sprites/weapons/fine_bow.png',
    'assets/sprites/weapons/echo_blade.png',
    'assets/sprites/weapons/pendulum_blade.png',
    'assets/sprites/weapons/legacy_blade.png',

    // Shields
    'assets/sprites/shields/wooden_buckler.png',
    'assets/sprites/shields/wooden_shield.png',
    'assets/sprites/shields/steel_shield.png',
    'assets/sprites/shields/knights_shield.png',
    'assets/sprites/shields/adamantine_shield.png',
    'assets/sprites/shields/ethereal_shield.png',
    'assets/sprites/shields/gear_shield.png',
    'assets/sprites/shields/gladiators_shield.png',

    // Items
    'assets/sprites/items/health_potion.png',
    'assets/sprites/items/strength_elixir.png',
    'assets/sprites/items/defense_potion.png',
    'assets/sprites/items/superior_health_potion.png',
    'assets/sprites/items/masters_strength_elixir.png',
    'assets/sprites/items/ultimate_defense_potion.png',
    'assets/sprites/items/arcane_blast.png',
    'assets/sprites/items/energy_surge.png',
    'assets/sprites/items/astral_strike.png',
    'assets/sprites/items/thunderbolt.png',
    'assets/sprites/items/soul_drain.png',
    'assets/sprites/items/shark_tooth_amulet.png',
    'assets/sprites/items/leviathan_gauntlets.png',
    'assets/sprites/items/ghostweave_cloak.png',
    'assets/sprites/items/chronometer_pendant.png',
    'assets/sprites/items/champions_gauntlets.png',
    'assets/sprites/items/ethereal_shield.png'
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
