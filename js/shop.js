/**
 * Shop System - Buy weapons, shields, potions, and spells
 */
import {
    SHOP_WEAPONS, SHOP_SHIELDS, SHOP_POTIONS,
    ADVANCED_SHOP_WEAPONS, ADVANCED_SHOP_SHIELDS, ADVANCED_SHOP_POTIONS, SHOP_SPELLS,
    WEAPON_DAMAGE, SHIELD_DEFENSE,
    getWeaponSprite, getShieldSprite, getItemSprite, getLocationSprite
} from './constants.js';

/**
 * Shop class for handling shop interactions
 */
export class Shop {
    constructor(terminal, character) {
        this.terminal = terminal;
        this.character = character;
    }

    /**
     * Main shop visit
     */
    async visit() {
        this.terminal.showSprite(getLocationSprite('shop'), 'Shop');
        this.terminal.print("\n=== TREASURE HUNTER'S MARKET ===");
        this.terminal.print("Welcome, adventurer! Browse my wares and prepare for your journey.");
        this.terminal.print(`You have ${this.terminal.goldText(this.character.gold)}.`);

        let shopping = true;
        while (shopping) {
            this.terminal.print("\nWhat would you like to browse?");
            this.terminal.print("1. Weapons");
            this.terminal.print("2. Shields");
            this.terminal.print("3. Potions");
            this.terminal.print("4. Leave Shop");

            const choice = await this.terminal.prompt();

            if (choice === '1') {
                await this.browseWeapons(SHOP_WEAPONS);
            } else if (choice === '2') {
                await this.browseShields(SHOP_SHIELDS);
            } else if (choice === '3') {
                await this.browsePotions(SHOP_POTIONS);
            } else if (choice === '4') {
                this.terminal.print("\nThank you for your patronage! May fortune favor your journey.");
                shopping = false;
            } else {
                this.terminal.print("Please choose a valid option.");
            }
        }
    }

    /**
     * Advanced shop visit (late game)
     */
    async visitAdvanced() {
        this.terminal.showSprite(getLocationSprite('shop'), 'Legendary Merchant');
        this.terminal.print("\n=== LEGENDARY MERCHANT ===");
        this.terminal.print("Welcome to my special collection of wares, adventurer!");
        this.terminal.print(`You have ${this.terminal.goldText(this.character.gold)}.`);

        let shopping = true;
        while (shopping) {
            this.terminal.print("\nWhat would you like to browse?");
            this.terminal.print("1. Advanced Weapons");
            this.terminal.print("2. Advanced Shields");
            this.terminal.print("3. Advanced Potions");
            this.terminal.print("4. Spellbooks");
            this.terminal.print("5. Leave Shop");

            const choice = await this.terminal.prompt();

            if (choice === '1') {
                await this.browseWeapons(ADVANCED_SHOP_WEAPONS);
            } else if (choice === '2') {
                await this.browseShields(ADVANCED_SHOP_SHIELDS);
            } else if (choice === '3') {
                await this.browseAdvancedPotions();
            } else if (choice === '4') {
                await this.browseSpellbooks();
            } else if (choice === '5') {
                this.terminal.print("\nThank you for your patronage! May your journey bring you glory.");
                shopping = false;
            } else {
                this.terminal.print("Please choose a valid option.");
            }
        }
    }

    /**
     * Browse weapons
     */
    async browseWeapons(weaponList) {
        this.terminal.print("\n=== WEAPONS ===");

        const weapons = Object.entries(weaponList);
        weapons.forEach(([name, data], i) => {
            this.terminal.print(`\n${i + 1}. ${name} - ${data.price} gold (${data.damage} damage)`);
        });
        this.terminal.print(`\n${weapons.length + 1}. Back to main menu`);

        while (true) {
            const choice = await this.terminal.prompt();
            const idx = parseInt(choice) - 1;

            if (idx === weapons.length) {
                return;
            }

            if (idx >= 0 && idx < weapons.length) {
                const [name, data] = weapons[idx];
                this.terminal.showSprite(getWeaponSprite(name), name);
                await this.purchaseWeapon(name, data.price, data.damage);
                break;
            }

            this.terminal.print(`Please select 1-${weapons.length + 1}.`);
        }
    }

    /**
     * Browse shields
     */
    async browseShields(shieldList) {
        this.terminal.print("\n=== SHIELDS ===");

        const shields = Object.entries(shieldList);
        shields.forEach(([name, data], i) => {
            this.terminal.print(`\n${i + 1}. ${name} - ${data.price} gold (${data.defense} defense)`);
        });
        this.terminal.print(`\n${shields.length + 1}. Back to main menu`);

        while (true) {
            const choice = await this.terminal.prompt();
            const idx = parseInt(choice) - 1;

            if (idx === shields.length) {
                return;
            }

            if (idx >= 0 && idx < shields.length) {
                const [name, data] = shields[idx];
                this.terminal.showSprite(getShieldSprite(name), name);
                await this.purchaseShield(name, data.price, data.defense);
                break;
            }

            this.terminal.print(`Please select 1-${shields.length + 1}.`);
        }
    }

    /**
     * Browse potions
     */
    async browsePotions(potionList) {
        this.terminal.print("\n=== POTIONS ===");

        const potions = Object.entries(potionList);
        potions.forEach(([name, data], i) => {
            this.terminal.print(`\n${i + 1}. ${name} - ${data.price} gold (${data.effect})`);
        });
        this.terminal.print(`\n${potions.length + 1}. Back to main menu`);

        while (true) {
            const choice = await this.terminal.prompt();
            const idx = parseInt(choice) - 1;

            if (idx === potions.length) {
                return;
            }

            if (idx >= 0 && idx < potions.length) {
                const [name, data] = potions[idx];
                const spriteName = name.toLowerCase().replace(/['\s]/g, '_');
                this.terminal.showSprite(getItemSprite(spriteName), name);
                await this.purchasePotion(name, data.price);
                break;
            }

            this.terminal.print(`Please select 1-${potions.length + 1}.`);
        }
    }

    /**
     * Browse advanced potions
     */
    async browseAdvancedPotions() {
        this.terminal.print("\n=== LEGENDARY POTIONS ===");

        const potions = Object.entries(ADVANCED_SHOP_POTIONS);
        potions.forEach(([name, data], i) => {
            this.terminal.print(`\n${i + 1}. ${name} - ${data.price} gold (${data.effect})`);
        });
        this.terminal.print(`\n${potions.length + 1}. Back to main menu`);

        while (true) {
            const choice = await this.terminal.prompt();
            const idx = parseInt(choice) - 1;

            if (idx === potions.length) {
                return;
            }

            if (idx >= 0 && idx < potions.length) {
                const [name, data] = potions[idx];
                const spriteName = name.toLowerCase().replace(/['\s]/g, '_');
                this.terminal.showSprite(getItemSprite(spriteName), name);
                await this.purchaseAdvancedPotion(name, data.price);
                break;
            }

            this.terminal.print(`Please select 1-${potions.length + 1}.`);
        }
    }

    /**
     * Browse spellbooks
     */
    async browseSpellbooks() {
        this.terminal.print("\n=== ANCIENT SPELLBOOKS ===");
        this.terminal.print("The merchant reveals a collection of ancient tomes.");

        const spells = Object.entries(SHOP_SPELLS);
        spells.forEach(([name, data], i) => {
            this.terminal.print(`\n${i + 1}. ${name} Grimoire - ${data.price} gold`);
            this.terminal.print(`   ${data.description}`);
        });
        this.terminal.print(`\n${spells.length + 1}. Back to main menu`);

        while (true) {
            const choice = await this.terminal.prompt();
            const idx = parseInt(choice) - 1;

            if (idx === spells.length) {
                return;
            }

            if (idx >= 0 && idx < spells.length) {
                const [name, data] = spells[idx];
                await this.purchaseSpell(name, data.price);
                break;
            }

            this.terminal.print(`Please select 1-${spells.length + 1}.`);
        }
    }

    /**
     * Purchase a weapon
     */
    async purchaseWeapon(name, price, damage) {
        if (this.character.gold < price) {
            this.terminal.print(`\nYou don't have enough gold! You need ${price} gold but only have ${this.character.gold}.`);
            return;
        }

        this.terminal.print(`\nYou're about to purchase ${name} for ${price} gold.`);
        this.terminal.print("Confirm purchase? (y/n)");

        const confirm = await this.terminal.prompt();
        if (confirm.toLowerCase() !== 'y') {
            this.terminal.print("Purchase cancelled.");
            return;
        }

        this.character.gold -= price;

        const currentDamage = this.character.getWeaponDamage();
        this.terminal.print(`\nYour current weapon: ${this.character.weapon} (${currentDamage} damage)`);
        this.terminal.print(`New weapon: ${name} (${damage} damage)`);
        this.terminal.print("Would you like to equip it now? (y/n)");

        const equip = await this.terminal.prompt();
        if (equip.toLowerCase() === 'y') {
            this.character.weapon = name;
            this.terminal.print(`You equip the ${name}!`);
        } else {
            this.terminal.print(`You keep the ${name} in your inventory for later.`);
        }

        this.terminal.print(`You have ${this.terminal.goldText(this.character.gold)} remaining.`);
    }

    /**
     * Purchase a shield
     */
    async purchaseShield(name, price, defense) {
        if (this.character.gold < price) {
            this.terminal.print(`\nYou don't have enough gold! You need ${price} gold but only have ${this.character.gold}.`);
            return;
        }

        this.terminal.print(`\nYou're about to purchase ${name} for ${price} gold.`);
        this.terminal.print("Confirm purchase? (y/n)");

        const confirm = await this.terminal.prompt();
        if (confirm.toLowerCase() !== 'y') {
            this.terminal.print("Purchase cancelled.");
            return;
        }

        this.character.gold -= price;

        const currentDefense = this.character.getShieldDefense();
        this.terminal.print(`\nYour current shield: ${this.character.shield} (${currentDefense} defense)`);
        this.terminal.print(`New shield: ${name} (${defense} defense)`);
        this.terminal.print("Would you like to equip it now? (y/n)");

        const equip = await this.terminal.prompt();
        if (equip.toLowerCase() === 'y') {
            this.character.shield = name;
            this.terminal.print(`You equip the ${name}!`);
        } else {
            this.terminal.print(`You keep the ${name} in your inventory for later.`);
        }

        this.terminal.print(`You have ${this.terminal.goldText(this.character.gold)} remaining.`);
    }

    /**
     * Purchase a potion
     */
    async purchasePotion(name, price) {
        if (this.character.gold < price) {
            this.terminal.print(`\nYou don't have enough gold! You need ${price} gold but only have ${this.character.gold}.`);
            return;
        }

        this.terminal.print(`\nYou're about to purchase ${name} for ${price} gold.`);
        this.terminal.print("Confirm purchase? (y/n)");

        const confirm = await this.terminal.prompt();
        if (confirm.toLowerCase() !== 'y') {
            this.terminal.print("Purchase cancelled.");
            return;
        }

        this.character.gold -= price;

        if (name === "Health Potion") {
            this.character.potions++;
            this.terminal.print(`You now have ${this.character.potions} Health Potions.`);
        } else if (name === "Strength Elixir") {
            this.character.tempAttackBoost = 2;
            this.terminal.print("You feel stronger! Your attacks will deal +2 damage in your next battle.");
        } else if (name === "Defense Potion") {
            this.character.tempDefenseBoost = 2;
            this.terminal.print("You feel more protected! You'll take less damage in your next battle.");
        }

        this.terminal.print(`You have ${this.terminal.goldText(this.character.gold)} remaining.`);
    }

    /**
     * Purchase an advanced potion
     */
    async purchaseAdvancedPotion(name, price) {
        if (this.character.gold < price) {
            this.terminal.print(`\nYou don't have enough gold! You need ${price} gold but only have ${this.character.gold}.`);
            return;
        }

        this.terminal.print(`\nYou're about to purchase ${name} for ${price} gold.`);
        this.terminal.print("Confirm purchase? (y/n)");

        const confirm = await this.terminal.prompt();
        if (confirm.toLowerCase() !== 'y') {
            this.terminal.print("Purchase cancelled.");
            return;
        }

        this.character.gold -= price;

        if (name === "Superior Health Potion") {
            this.character.superiorPotions++;
            this.terminal.print("You bought a Superior Health Potion!");
            this.terminal.print("This potion will restore HP completely AND temporarily boost max HP by 10.");
            this.terminal.print(`You now have ${this.character.superiorPotions} Superior Health Potions.`);
        } else if (name === "Master's Strength Elixir") {
            this.character.tempAttackBoost = 5;
            this.terminal.print("You bought a Master's Strength Elixir!");
            this.terminal.print("Your attack will be increased by +5 for your next battle.");
        } else if (name === "Ultimate Defense Potion") {
            this.character.tempDefenseBoost = 5;
            this.terminal.print("You bought an Ultimate Defense Potion!");
            this.terminal.print("Your defense will be increased by +5 for your next battle.");
        }

        this.terminal.print(`You have ${this.terminal.goldText(this.character.gold)} remaining.`);
    }

    /**
     * Purchase a spell
     */
    async purchaseSpell(name, price) {
        if (this.character.spells.includes(name)) {
            this.terminal.print(`You already know ${name}!`);
            return;
        }

        if (this.character.gold < price) {
            this.terminal.print(`\nYou don't have enough gold! You need ${price} gold but only have ${this.character.gold}.`);
            return;
        }

        this.terminal.print(`\nYou're about to purchase ${name} for ${price} gold.`);
        this.terminal.print("Confirm purchase? (y/n)");

        const confirm = await this.terminal.prompt();
        if (confirm.toLowerCase() !== 'y') {
            this.terminal.print("Purchase cancelled.");
            return;
        }

        this.character.gold -= price;
        this.character.spells.push(name);

        this.terminal.print(`\nYou have learned [magenta]${name}[/magenta]!`);
        this.terminal.print("The spell has been added to your spellbook.");
        this.terminal.print(`You have ${this.terminal.goldText(this.character.gold)} remaining.`);
    }
}
