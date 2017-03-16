/**
 * Flags a perk as dangerous if it can give an opponent an edge on you.
 *
 * @param {String} type Name of the weapon type.
 * @param {Number} perk Perk Hash
 * @returns {String | Undefined} Indication if the perk is dangerous.
 * @public
 */
export function danger(type, perk) {
  const weapon = danger.weapons[type];

  if (!weapon) return;
  return weapon[perk];
}

/**
 * Item specific perks you need to watch out for.
 *
 * @type {Object} Perks mapped by weapon type.
 * @private
 */
danger.weapons = {
  'Hand Cannon': {
    386636896: 'Increased damage by random bullets, can proc multiple times', // LitC.
    3125734432: 'Decreases damage falloff, can compete from longer ranges',   // Rangefinder.
    1085914778: 'Increased in air accuracy.',                                 // Icarus.
    2110331143: 'Increased range, slower reload',                             // Rifled Barrel.
    4081260527: 'Increased damage after reload',                              // Reactive reload.
    3528431156: 'Increases Aim Assist by 25%',                                // Hidden Hand
  },
  'Pulse Rifle': {
    3058480256: 'High Call Rounds, increases flinch',                         // HCR.
    1923295819: 'Hand-laid stock, pulse rifle dmg falloff is minimal',        // Hand-Laid stock.
    265561391: 'Counterbalance, only upwards recoil',                         // Counter balance.
  },
  'Rocket Launcher': {
    1628173634: 'Grenades and horse shoes',                                   // G&H.
    2998213953: 'Can carry 3 rockets in tube without reloading',              // Tripod.
    2935707225: 'Picks up more ammo.',                                        // Fieldscout.
  },
  'Sniper Rifle': {
    3528431156: 'Increases Aim Assist by 25%',                                // Hidden Hand
    788826872: 'Low zoom scope',                                              // Shortgaze.
    3409718360: 'Faster weapon switching',                                    // Quickdraw.
    3756868213: 'Increased magazine size and picks up more bullets',          // Casket mag.
    3845139909: 'Low zoom scope',                                             // Ambush.
    855592488: 'Less flinch',                                                 // Unflinching.
    423261833: 'Removes 1 frame of ADS',                                      // Linear compensator.
  },
  'Sidearm': {
    3528431156: 'Increases Aim Assist by 25%',                                // Hidden Hand
    186107093: 'Increased Damage',                                            // Aggballs
    3125734432: 'Decreases damage falloff, can compete from longer ranges',   // Rangefinder.
    3058480256: 'High Call Rounds, increases flinch',                         // HCR.
    4081260527: 'Increased damage after reload',                              // Reactive reload.
  },
  'Shotgun': {
    186107093: 'Increased Damage',                                            // Aggballs
    3125734432: 'Decreases damage falloff, can compete from longer ranges',   // Rangefinder.
    695712111: 'Increased damager after a kill',                              // Crowd Control.
    3342147638: 'Increased range, less stability',                            // Reinforced Barrel.
    2110331143: 'Increased range, slower reload',                             // Rifled Barrel.
    3006914496: 'Kills can return ammo',                                      // Perforamnce Bonus.
    868135889: 'Full auto, increased RoF',                                    // Full Auto.
  },
  'Machine Gun': {
    2935707225: 'Picks up more ammo.',                                        // Fieldscout.
    186107093: 'Increased Damage',                                            // Aggballs.
  },
  'Artifact': {
    2632303983: 'Resistance to damage over time (burn, poison)',              // Silimar.
    2012298495: 'Reduced sprint cooldown',                                    // Jolder.
    4168601465: 'Fucking skorry noob',                                        // Skorry.
    3677983167: 'Double melee, double grenade, increased stats',              // Fellwinter.
    3171054489: 'Increased radar and free third eye for primaries',           // Gheleon.
    994364243: 'Highlights low health and full super opponents',              // Timur
    3099205873: 'Sword block returns bullets/grenades/super/rockets'          // Radegast
  }
};

/**
 * Check if we need to hide a perk from the UI.
 *
 * @param {Number} perk Node's perkHash
 * @returns {Boolean}
 * @public
 */
export function hide(perk) {
  return !!~hide.nodes.indexOf(perk);
}

/**
 * List of stepNodeHashes that we don't want to show up as weapon perks.
 *
 * @type {Array}
 * @private
 */
hide.nodes = [
  21956111,   // Orange Chroma
  73039185,   // Blue Chroma
  74523350,   // Cannibalism
  193091484,  // Increase Strength
  213547364,  // Will of Light
  217480046,  // Twist Fate
  300289986,  // Dreg Burn
  431265444,  // Mutineer
  472357138,  // Void Damage
  519240296,  // White Chroma
  617082448,  // Reforge Ready
  643689081,  // Kinetic Damage
  994456416,  // Burgeoning Hunger
  1034209669, // Increase Intellect
  1259277924, // Red Chroma
  1263323987, // Increase Discipline
  1270552711, // Infuse
  1305317488, // Aspect Swap
  1450441122, // Demotion
  1516989546, // Magenta Chroma
  1644354530, // Sword Strike
  1782221257, // Shank Burn
  1891493121, // Dark Breaker
  1920788875, // Ascend
  1975859941, // Solar Damage
  2086308543, // Upgrade Defense
  2133116599, // Deactivate Chroma
  2470010183, // Hive Disruptor
  2493487228, // Green Chroma
  2688431654, // Arc Damage
  2689436406, // Upgrade Damage
  2845051978, // Ice Breaker
  2978058659, // Oracle Disruptor
  3200611139, // Scabbard
  3575189929, // Hands-On
  3707521590, // Vandal Burn
  3742851299, // Lich Bane
  3838454323, // Yellow Chroma
  3985040583, // Disciplinarian
  4197414939, // Inverse Shadow
  889765000,  // Spec ops.
  3714326989, // Artic Survival.
  4021291143, // Dunemaker.
  2102232042, // Nanohance.
  2490282438, // Fallen Ass.
  888337503,  // Crucible ass.
  3823075448, // Rose of Acid.
  533595882,  // Rose of Corruption.
  194511534,  // Sequel.
  1463501299, // Addendum.
  1361713467, // Not a toy.
  1415759877, // Shock hazard.
  3914911278, // Storms reproach.
  2483806592, // Iconoclast.
  1526284575, // Wolves Remember.
  3537067099, // Born in Fire.
  1061944774, // Heart of gold.
  3764272115, // Prototype.
  3638091012, // Queens Command.
  3111908153, // Lingering Vestege.
  1745108047, // Dragons Bane.
  2456762628, // Hoodoom.
  968615526,  // Bureau of Aeronautics.
  239679421,  // Last Warmind.
  1427027527, // Carrion.
  961419189,  // Moon glow.
  2435978606, // Superspy.
  773941200,  // Royal Flush.
  539788817,  // Meteorite.
  1622904372, // Silver Bullet.
  3435035717, // Spliced Cosmoclast Greaves
  1332177923, // Siva Re-Roll raid gear.
];
