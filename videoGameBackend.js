// GLOBAL OBJECTS ///////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
const Player = {
  //TO DO: add a persistent display for player and opponent stats
  // STATS ////
  type: 'player',
  name: "Crispy",
  inventory: [],
  maxInventory: 1,
  level: 1,
  health: 10,
  maxHealth: 10,
  strength: 1,
  attack: 1,
  dexterity: 1,
  attackSpeed: 2000,
  defense: 0,
  stamina: 1,
  experience: 0,
  experienceValue: 100,
  experienceThreshold: 1,
  modifiers: {},
  greetings: ["Hello!", "I'll fucking kill you!", "Do you know who I am?", "Wanna get clapped?", "I'm terribly sorry about this.", "Easy way, hard way. You choice.", "I'm just as confused as you are.", "Hi-ya!!", "Go home.", "You don't need to do this.", "I've come a long way for this.", "You haven't got a chance.", "Have at you!"],

  // METHODS ////
  greet: function (optionalMessage) {
    if (optionalMessage) {
      logGameEvent(this.name + ' says "' + optionalMessage + '"')
      "gameLog", ("gameLog", this.name + ' says "' + optionalMessage + '"')
    } else {
      let greetingNumber = getRandomInt(0, this.greetings.length - 1);
      logGameEvent(this.name + ' says "' + this.greetings[greetingNumber] + '"')
      displayGameEvent("gameLog", this.name + ' says "' + this.greetings[greetingNumber] + '"')
    }
  },

  gainExperience: function (source) {
      this.experience += source.experienceValue;
      // Continually level up until the character's experience value is less than the character's experienceThreshold
      // Fixes an issue where a large amount of experience was gained, but the appropriate levels were not
      while (this.experience >= this.experienceThreshold) {
        this.levelUp();
      }
      logGameEvent(this.name + ' gained ' + source.experienceValue + ' XP')
  },

  levelUp: function () {
    //NOTE: still working on balancing stats. Values are subject to change.
    this.level += 1;
    this.maxHealth += 1;
    this.health = this.maxHealth;
    this.maxInventory += 1;
    this.strength += 1;

    if (this.modifiers.strength) {
      this.attack = this.strength + this.modifiers.strength;
    } else {
      this.attack = this.strength;
    }

    this.dexterity += 1;
    this.attackSpeed = (this.attackSpeed - (100 * (1 / this.dexterity))).toFixed(2);
    this.stamina += 1;
    this.experienceValue = Math.ceil(this.experienceValue * 1.1);;
    this.experienceThreshold = Math.ceil(this.experienceThreshold * 1.5);

    logGameEvent(this.name + " LEVELED UP!\n" + this.name + ' is now level ' + this.level);
    displayGameEvent("gameLog", this.name + " LEVELED UP!" + "<br>" + this.name + ' is now level ' + this.level)
    updateCharacterInfo("characterInfo", Player.name + "<br><br>" + 'Level: ' + Player.level + "<br>" + 'Health: ' + Player.health + "<br>" + 'Max Health: ' + Player.maxHealth + "<br>" + 'Strength: ' + Player.strength + "<br>" + 'Attack: ' + Player.attack + "<br>" + 'Dexterity: ' + Player.dexterity + "<br>" + 'Attack Speed: ' + Player.attackSpeed + "<br>" + 'Defense: ' + Player.defense + "<br>" + 'Stamina: ' + Player.stamina + "<br>" + 'Experience: ' + Player.experience + "<br>" + 'Experience Value: ' + Player.experienceValue + "<br>" + 'Experience Threshold: ' + Player.experienceThreshold + "<br>" + 'Modifiers: ' + JSON.stringify(Player.modifiers) + "<br>" + 'Max Inventory: ' + Player.maxInventory + "<br>" + 'Inventory: ' + JSON.stringify(Player.inventory) )
    },

  strike: function (target) {
    // these have to be here to display information in the correct order
    logGameEvent(this.name + ' strikes ' + target.name)
    displayGameEvent("attackInfo", this.name + ' strikes ' + target.name)

    let damage = this.strength;

    applyDamage(this, target, damage, "attackInfo");// "applyDamamge" uses "this" to access the Player's name

  },

  pickup: function (item) {
    if (item.modifiers) {
      procItemModifiersOnItemPickup(item, this);
    }

    this.inventory.push(item);

    logGameEvent(this.name + ' picks up the ' + item.name)
    displayGameEvent("gameLog", this.name + ' picks up the ' + item.name)
  },

  drop: function (item) {
    if (item.modifiers) {
      removeItemModifiers(item, this);
    }

    let itemLocation = this.inventory.indexOf(item);

    this.inventory.splice(itemLocation, 1);

    logGameEvent(this.name + ' drops the ' + item.name);
    displayGameEvent("gameLog", this.name + ' drops the ' + item.name);
  }

};//end Player object
// This has to be globally accessible. I know it's messy, I wrote it when I was but a padawan (in many ways, I always will be)
updateCharacterInfo("characterInfo", Player.name + "<br><br>" + 'Level: ' + Player.level + "<br>" + 'Health: ' + Player.health + "<br>" + 'Max Health: ' + Player.maxHealth + "<br>" + 'Strength: ' + Player.strength + "<br>" + 'Attack: ' + Player.attack + "<br>" + 'Dexterity: ' + Player.dexterity + "<br>" + 'Attack Speed: ' + Player.attackSpeed + "<br>" + 'Defense: ' + Player.defense + "<br>" + 'Stamina: ' + Player.stamina + "<br>" + 'Experience: ' + Player.experience + "<br>" + 'Experience Value: ' + Player.experienceValue + "<br>" + 'Experience Threshold: ' + Player.experienceThreshold + "<br>" + 'Modifiers: ' + JSON.stringify(Player.modifiers) + "<br>" + 'Max Inventory: ' + Player.maxInventory + "<br>" + 'Inventory: ' + JSON.stringify(Player.inventory) )


const items = {
  // A global list of items
  // Used to populate character inventories
  // All items are stored as objects
  // All rarities are arrays of objects
  // Item modifiers must be formatted as a string the has these values in this order: "characterStat amountModified"
  // The functions that modify character stats use that string
  // NOTE: still working on developing more items and balancing stat modifiers
  // Items can be accessed globally using this format: items.type.rarity[index] or items.type.rarity.arrayMethod()
  // Just be sure your arrayMethod callback operates on objects

  weapons: {
    // UNIQUE WEAPONS
    // Should always be stored at the top of the weapons object
    unique: [
      {
        name: 'Wareworlf Hunter\'s Crossbow',
        modifiers: ['attack +7', 'unlocks rangedAttack'],
        rarity: 'unique',
        value: 0,
        quote: 'Rumor has it a rogue used this to take out a warewolf. Story goes, that warewolf turned out to be his own brother.'
      },
      {
        name: 'Silver Sword',
        modifiers: ['attack +4', 'dexterity +1'],
        rarity: 'rare',
        value: 100,
        quote: "It's shine alone can cut. Perfect for dealing with warewolves."
      }
    ],
    // COMMON WEAPONS
    common: [
      {
        name: 'Basic Axe',
        modifiers: ['attack +1'],
        rarity: 'common',
        value: 3,
        quote: 'A sturdy common axe.'
      },
    ],
    // UNCOMMON WEAPONS
    uncommon: [
      {
      name: 'Big Sword',
      modifiers: ['strength +3'],
      rarity: 'uncommon',
      value: 10,
      quote: 'A big dang sword.'
      }
    ],
    // RARE WEAPONS
    rare: [
      {
        name: 'Battle Axe',
        modifiers: ['attack +7', 'dexterity -2'],
        rarity: 'rare',
        value: 50,
        quote: 'I got a battle axe in my cadillac.'
      }
    ]
  }, // End of weapons object

  armor: {
    unique: [],// Nothing here at the moment.
    common: [
      {
      name: 'Small Shield',
      modifiers: ['defense +1'],
      rarity: 'common',
      value: 3,
      quote: 'A sturdy common shield.'
      },
    ],
    uncommon: [
      {
        name: 'Big Shield',
        modifiers: ['defense +4', 'dexterity -2'],
        rarity: 'uncommon',
        value: 10,
        quote: 'A big uncommon shield.'
      }
    ],
    rare: [
      {
        name: 'Beskar Helmet',
        modofiers: ['defense + 50'],
        rarity: 'rare',
        value: 10000,
        quote: 'A very sturdy helmet.'
      }
    ]
  },

  scrolls: [
    {
      name: 'Scroll of Fireball',
      modifiers: ['unlocks casting'],
      rarity: 'unique',
      value: 100000000,
      quote: 'Some knowledge, men were not supposed to possess...'
    },
    {
      name: 'Scroll of Frost',
      modifiers: ['unlocks casting'],
      rarity: 'unique',
      value: 100000000,
      quote: 'Some knowledge, men were not supposed to possess...'
    }
  ] // End of scrolls array
} // End of items object

const trackers = {
  // Used to track the numbers of certain game events
  numberOfFights: 0
}

// FUNCTION DEFINITIONS /////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// NPC FUNCTIONS ////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
function NPC (type = 'NPC', name = randomName(), inventory = [], maxInventory = 1, level = 1, health = 5, maxHealth = 5, strength = 1, dexterity = 1, attackSpeed = 2000, defense = 0, stamina = 3, experience = 0, experienceValue = 1, experienceThreshold = 1, greetings = ['Hello!', '[bleep] you!']) {

  // STATS ////
  this.type = type;
  this.name = name;
  this.inventory = inventory;
  this.maxInventory = maxInventory;
  this.level = level;
  this.health = health;
  this.maxHealth = maxHealth;
  this.strength = strength;
  this.attack = this.strength;
  this.dexterity = dexterity;
  this.attackSpeed = attackSpeed;
  this.defense = defense;
  this.stamina = stamina;
  this.experience = experience;//NOTE: if you set experience to be greater than the experienceThreshold when the object is created, it will trigger levelUp
  this.experienceValue = experienceValue;
  this.experienceThreshold = experienceThreshold;
  this.modifiers = {};
  this.greetings = greetings;

  //NPC METHODS ////
  this.drop = function (item) {
    // NOTE:
    let droppedItem = this.inventory.splice(this.inventory.indexOf(item), 1);
    console.log(droppedItem[0])

    logGameEvent(this.name + ' dropped the ' + item.name);
    displayGameEvent("gameLog", this.name + ' dropped the ' + item.name);

    removeItemModifiers(droppedItem[0], this);

    return droppedItem[0];
  };

  this.dropInventory = function () {
    // Drops the entire inventory
    if (this.inventory.length > 0) {
      let tempInventory = [];
      let inventoryLength = this.inventory.length;// necessary because the NPC inventory is being modified
      for (let i=0; i<inventoryLength; i++) {
        let droppedItem = this.drop(this.inventory[0])
        tempInventory.push(droppedItem);
      }
    return tempInventory;
    }
  };

  this.gainExperience = function (source) {
    this.experience += source.experienceValue;
    while (this.experience >= this.experienceThreshold) {
      this.levelUp();
    }

    logGameEvent(this.name + ' gained ' + source.experienceValue + ' XP')
    displayGameEvent("gameLog", this.name + ' gained ' + source.experienceValue + ' XP')
  };

  this.greet = function () {
    let greetingNumber = getRandomInt(0, this.greetings.length - 1);
    logGameEvent(this.name + ' says "' + this.greetings[greetingNumber] + '"');
    displayGameEvent("gameLog", this.name + ' says "' + this.greetings[greetingNumber] + '"');
  };

  this.levelUp= function () {
    //NOTE: still working on balancing stats. Values are likely to change.
    this.level += 1;
    this.maxHealth += 1;
    this.health = this.maxHealth;
    this.maxInventory += 1;
    this.strength += 1;
    this.dexterity += 1;
    this.attackSpeed = (this.attackSpeed - (100 * (1 / this.dexterity))).toFixed(2);
    this.stamina += 1;
    this.experienceValue = Math.ceil(this.experienceValue * 1.1);;
    this.experienceThreshold = Math.ceil(this.experienceThreshold * 1.5);
    // DISPLAY INFO
    logGameEvent(this.name + " LEVELED UP!\n" + this.name + ' is now level ' + this.level);
    displayGameEvent("gameLog", this.name + " LEVELED UP!" + "<br>" + this.name + ' is now level ' + this.level)
    },

  this.pickup = function (item) {
    // these need to be here to display information in proper order
    logGameEvent(this.name + ' picks up the ' + item.name);
    displayGameEvent("gameLog", this.name + ' picks up the ' + item.name);

    if (item.modifiers) {
      procItemModifiersOnItemPickup(item, this);
    }

    this.inventory.push(item);
  };

  this.strike = function (target) {
    // these have to be here to display info in the correct order
    logGameEvent(this.name + ' strikes ' + target.name)
    displayGameEvent("attackInfo", this.name + ' strikes ' + target.name)

    let damage = this.strength;
    applyDamage(this, target, damage, "attackInfo");
  };
}//end NPC constructor

function createNewNPC (type, name, inventory, maxInventory, level, health, maxHealth, strength, dexterity, attackSpeed, defense, stamina, experience, experienceValue, experienceThreshold, itemsToSpawn, rarity, greetings) {
  let newDude = new NPC (type, name, inventory, maxInventory, level, health, maxHealth, strength, dexterity, attackSpeed, defense, stamina, experience, experienceValue, experienceThreshold, greetings)
    // Spawn items to NPC inventory on NPC creation
  if(itemsToSpawn > 0) {
    logGameEvent('Populating ' + itemsToSpawn + ' ' + rarity + ' item(s) to ' + newDude.name + "'s inventory")
    populateInventory(newDude, itemsToSpawn, rarity);
  };
  return newDude;
}

function randomName () {
  let names = ['Webby', 'Samaria', 'Caroline', 'Maylani', 'Aziah', 'Baynayah', 'Darby', 'Amanda', 'Kevin', 'Bathroom Cauldron', 'Lorna', 'Cody', 'Mike', 'Nick', 'Alena', 'Matt', 'Jane', 'Manuel', 'Sam']
  return names[getRandomInt(0, names.length - 1)];
}

function randomBugName () {
  let names = ["Beetle", "Dragonfly", "Preying Mantis"];
  return names[getRandomInt(0, names.length - 1)];
}

function randomFoxName () {
  let names = ["Red Fox", "Silver Fox", "Arctix Fox", "Sly Fox"];
  return names[getRandomInt(0, names.length - 1)];
}

function randomHumanName () {
  let names = ['Webby', 'Samaria', 'Caroline', 'Maylani', 'Aziah', 'Baynayah', 'Darby', 'Amanda', 'Kevin', 'Bathroom Cauldron', 'Lorna', 'Cody', 'Mike', 'Nick', 'Alena', 'Matt', 'Jane', 'Manuel', 'Sam'];
  return names[getRandomInt(0, names.length - 1)];
}

// NPC AND PLAYER FUNCTIONS /////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

function cast (spell, target) {
  console.log(this.name + ' casts ' + spell.name + ' on ' + target.name)
  spell(this, target)
}

function unlockSpell (character, spell) {
  character.mana = 10;
  character.cast = spell;
}

function populateInventory (character, itemsToSpawn, rarity) {
  // Spawn a given number of items in the character's inventory
  for (let i=0; i<itemsToSpawn; i++) {
    let spawnedItem = items.weapons[rarity][getRandomInt(0, items.weapons[rarity].length - 1)];

    logGameEvent('Spawned ' + spawnedItem.name);
    displayGameEvent("gameLog", 'Spawned ' + spawnedItem.name)
    character.pickup(spawnedItem)
  }
}

function procItemModifiersOnItemPickup (item, character) {
  /*
      When a character picks up an item, the item modifies that character's stats
      and abilities.

      Each item has a 'modifiers' property storing an array consisting some formatted strings.

      This function splits the string into two parts, the stat to be modified, and the amount to modify it, represented by a positive or negative integer.

      It's sister function, removeItemModifiersOnItemPickup, performs the reverse work when an item is dropped.

      Items like "Scroll of Fireball" can also unlock abilities. Its 'modifiers' property is "unlock casting".

      This function uses a conditional function called "unlockAbility" to perform the work necessary to add abilities to the character being modified. It is triggered by the "unlock" keyword in the item's 'modifiers' property.
  */

  for (let i=0; i<item.modifiers.length; i++) {
    let currentItemModifier = item.modifiers[i].split(' ');

    let statToModify = currentItemModifier[0];
    let amount = currentItemModifier[1];

    if (!character.modifiers[statToModify]) {
      character.modifiers[statToModify] = Number(amount)
    } else {
      character.modifiers[statToModify] += Number(amount)
    }

    if (statToModify === 'unlocks') {
      let ability = currentItemModifier[1];
      unlockAbility(character, ability);

    } else {
      character[statToModify] += Number(amount);
      logGameEvent(character.name + ' ' + statToModify + ' ' + amount);
      displayGameEvent("gameLog", character.name + ' ' + statToModify + ' ' + amount);
      updateCharacterInfo("characterInfo", Player.name + "<br><br>" + 'Level: ' + Player.level + "<br>" + 'Health: ' + Player.health + "<br>" + 'Max Health: ' + Player.maxHealth + "<br>" + 'Strength: ' + Player.strength + "<br>" + 'Attack: ' + Player.attack + "<br>" + 'Dexterity: ' + Player.dexterity + "<br>" + 'Attack Speed: ' + Player.attackSpeed + "<br>" + 'Defense: ' + Player.defense + "<br>" + 'Stamina: ' + Player.stamina + "<br>" + 'Experience: ' + Player.experience + "<br>" + 'Experience Value: ' + Player.experienceValue + "<br>" + 'Experience Threshold: ' + Player.experienceThreshold + "<br>" + 'Modifiers: ' + JSON.stringify(Player.modifiers) + "<br>" + 'Max Inventory: ' + Player.maxInventory + "<br>" + 'Inventory: ' + JSON.stringify(Player.inventory) )    }

  }
}

function removeItemModifiers (item, character) {
  for (let i=0; i<item.modifiers.length; i++) {
    // Split the modifier into the stat it's modifying, and the amount
    let currentItemModifier = item.modifiers[i].split(' ');
    // Set a variable to represent the stat being modified
    let statToModify = currentItemModifier[0];
    let amount = -(Number(currentItemModifier[1]))
    character.modifiers[statToModify] += amount

    character[statToModify] += amount;
    // Write game events
    logGameEvent(character.name + ' ' + statToModify + ' ' + amount);
    displayGameEvent("gameLog", character.name + ' ' + statToModify + ' ' + amount);
    console.log(character.name + ' ' + statToModify + ': ' + character[statToModify])
    updateCharacterInfo("characterInfo", Player.name + "<br><br>" + 'Level: ' + Player.level + "<br>" + 'Health: ' + Player.health + "<br>" + 'Max Health: ' + Player.maxHealth + "<br>" + 'Strength: ' + Player.strength + "<br>" + 'Attack: ' + Player.attack + "<br>" + 'Dexterity: ' + Player.dexterity + "<br>" + 'Attack Speed: ' + Player.attackSpeed + "<br>" + 'Defense: ' + Player.defense + "<br>" + 'Stamina: ' + Player.stamina + "<br>" + 'Experience: ' + Player.experience + "<br>" + 'Experience Value: ' + Player.experienceValue + "<br>" + 'Experience Threshold: ' + Player.experienceThreshold + "<br>" + 'Modifiers: ' + JSON.stringify(Player.modifiers) + "<br>" + 'Max Inventory: ' + Player.maxInventory + "<br>" + 'Inventory: ' + JSON.stringify(Player.inventory) )  }
}

function spawnItemOnChance (item, rangeMax) {
  let value = getRandomInt(1, rangeMax);
  if (value === 1) {
    return item;
  }
  // "rangeMax" allows control over the level of probability that an item will spawn
  // if you use "1" for "rangeMax" the item will always spawn
}

function unlockAbility (character, ability) {
  if (ability === 'casting') {
    character.cast = cast
    logGameEvent(character.name + ' unlocked ' + '"' + ability + '"')
    displayGameEvent("gameLog", character.name + ' unlocked ' + '"' + ability + '"')
  }
}

// SPELLS ////////////////

function fireball (source, target) {
  let damage = source.strength * 2;
  applyDamage(source, target, damage);
}

function iceSpear (source, target) {
  let damage = source.strength * 2;
  applyDamage(source, target, damage);
}

// LOGGERS AND DISPLAY WRITERS //////////////////////////////////////////////////////
function logGameEvent (event) {
  console.log(event)
}

function displayGameEvent (divID, event) {
  document.getElementById(divID).innerHTML += "<br>" + event;
}

function updateCharacterInfo (divID, event) {
  document.getElementById("characterInfo").innerHTML = event;
}

function damageLogger (source, target, damage, divID, message) {
  if (message) {
    logGameEvent(message + '\nSource: ' + source.name + '\nTarget: ' + target.name + '\nDamage: ' + damage)
    displayGameEvent(divID, message + '<br>' + 'Source: ' + source.name + '<br>' + 'Target: ' + target.name + '<br>' + 'Damage: ' + damage)
  } else {
    logGameEvent(source.name + " " + damage + " damage to " + target.name + '\n' + target.name + ' defense: ' + target.defense + '\n' + target.name + ' health: ' + target.health)
    displayGameEvent(divID, source.name + " deals " + damage + " damage to " + target.name + '<br>' + target.name + ' defense: ' + target.defense + '<br>' + target.name + ' health: ' + target.health)
  }
}

function clearDisplay (divID) {
  document.getElementById(divID).innerHTML = '';
}

// FIGHT FUNCTIONS //////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
function fight (dude1, dude2) {
/* TO DO:
      - rework this function to incorporate casting spells
*/

  // Write game events
  clearDisplay("gameLog")
  clearDisplay("attackInfo")
  logGameEvent("FIGHT BEGINS!")
  displayGameEvent("gameLog", "FIGHT BEGINS!")

  trackers.numberOfFights += 1;

  console.log(dude1)
  console.log('VERSUS')
  console.log(dude2)

  // If there is an optional message provided, assign it to a variable

  // Have the opponents greet each other
  dude1.greet();
  dude2.greet();

  logGameEvent(dude1.name + ' attack interval set to ' + (dude1.attackSpeed / 1000) + ' seconds\n' +  dude2.name + ' attack interval set to ' + (dude2.attackSpeed / 1000) + ' seconds')

  // DUDE1 ////////////////
  function dude1Attack () {
    // PHYSICAL DAMAGE //
    dude1.strike(dude2);
    updateCharacterInfo("characterInfo", Player.name + "<br><br>" + 'Level: ' + Player.level + "<br>" + 'Health: ' + Player.health + "<br>" + 'Max Health: ' + Player.maxHealth + "<br>" + 'Strength: ' + Player.strength + "<br>" + 'Attack: ' + Player.attack + "<br>" + 'Dexterity: ' + Player.dexterity + "<br>" + 'Attack Speed: ' + Player.attackSpeed + "<br>" + 'Defense: ' + Player.defense + "<br>" + 'Stamina: ' + Player.stamina + "<br>" + 'Experience: ' + Player.experience + "<br>" + 'Experience Value: ' + Player.experienceValue + "<br>" + 'Experience Threshold: ' + Player.experienceThreshold + "<br>" + 'Modifiers: ' + JSON.stringify(Player.modifiers) + "<br>" + 'Max Inventory: ' + Player.maxInventory + "<br>" + 'Inventory: ' + JSON.stringify(Player.inventory) )
    if (dude2.health <= 0) {
      endFight(dude1, dude2, dude1AttackInterval, dude2AttackInterval)
    }
    /*
    if (dude1.cast) {
      dude1.cast(fireball, dude2)
    }
    */
  }

  // DUDE2 ////////////////
  function dude2Attack () {
    dude2.strike(dude1);
    updateCharacterInfo("characterInfo", Player.name + "<br><br>" + 'Level: ' + Player.level + "<br>" + 'Health: ' + Player.health + "<br>" + 'Max Health: ' + Player.maxHealth + "<br>" + 'Strength: ' + Player.strength + "<br>" + 'Attack: ' + Player.attack + "<br>" + 'Dexterity: ' + Player.dexterity + "<br>" + 'Attack Speed: ' + Player.attackSpeed + "<br>" + 'Defense: ' + Player.defense + "<br>" + 'Stamina: ' + Player.stamina + "<br>" + 'Experience: ' + Player.experience + "<br>" + 'Experience Value: ' + Player.experienceValue + "<br>" + 'Experience Threshold: ' + Player.experienceThreshold + "<br>" + 'Modifiers: ' + JSON.stringify(Player.modifiers) + "<br>" + 'Max Inventory: ' + Player.maxInventory + "<br>" + 'Inventory: ' + JSON.stringify(Player.inventory) )
    if (dude1.health <= 0) {
      endFight(dude1, dude2, dude1AttackInterval, dude2AttackInterval)
    }
    //TODO: enable casting to be part of attack
  }
  // The below intervals are set by the individual's attack speed, and cleared by "endFight()"
  let dude1AttackInterval = setInterval(dude1Attack, dude1.attackSpeed);
  let dude2AttackInterval = setInterval(dude2Attack, dude2.attackSpeed);
}

function endFight (dude1, dude2, dude1AttackInterval, dude2AttackInterval, message) {
  clearInterval(dude1AttackInterval);
  clearInterval(dude2AttackInterval);

  let winner = determineWinner(dude1, dude2);
  let loser = determineLoser(dude1, dude2);

  if (JSON.stringify(loser) === JSON.stringify(Player)) {
    console.log("YOU DIED")
  };
  declareWinner(winner, loser);
  distributeGoodies(winner, loser);
  declareExperience(winner, loser);
  if (message) {
    displayOptionalMessage(message);
  }
}

// FIGHT OPERATIONS ///////////
function applyDamage (source, target, damage, divID) {
  if (target.defense > 0) {
    for (let i=damage; i>0; i--) {
      if (target.defense > 0) {
        target.defense--;
      } else {
        target.health--
      }
    }
    damageLogger(source, target, damage, divID)
  } else {
    target.health = target.health - damage;
    damageLogger(source, target, damage, divID)
  }
}

function declareWinner (winner) {
  logGameEvent(winner.name + ' WON THE FIGHT!');
  displayGameEvent("gameLog", '<br>' + winner.name + ' WON THE FIGHT!');
};

function declareExperience (winner, loser) {
  logGameEvent(winner.name +
  '\nExperience gained: ' + loser.experienceValue + '\nTotal experience: ' + winner.experience + '\nExperience to next level: ' + (winner.experienceThreshold - winner.experience));
  displayGameEvent("gameLog", 'Experience gained: ' + loser.experienceValue + '<br>' + 'Total experience: ' + winner.experience + '<br>' + 'Experience to next level: ' + (winner.experienceThreshold - winner.experience))
}

function determineLoser (dude1, dude2) {
  if (dude1.health <= 0) {
    return dude1;
  } else {
    return dude2;
  }
}

function determineWinner (dude1, dude2) {
  if (dude1.health > 0) {
    return dude1;
  } else {
    return dude2;
  }
}

function displayOptionalMessage (divID, optionalMessage) {
  logGameEvent(optionalMessage)
  displayGameEvent(divID, optionalMessage)
}

function distributeGoodies (winner, loser) {
  winner.gainExperience(loser);
  if (loser.inventory.length > 0) {
    // First, the loser drops all their items
    let loserInventory = loser.dropInventory();
    // Them returned "tempInventory" from "dropInventory()" is looped through
    for (let i=0; i<loserInventory.length; i++) {
      // And the winner picks up each item, causing any modifiers to proc
      winner.pickup(loserInventory[i]);
    }
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}// the classic ripped from GitHub

function findUltimateWinner (champion, challenger) {
  //run a simulated fight between two NPCs and then make the winner fight the next challenger. Continue the process till we run out of NPCs to fight against each other, and return the ultimate winner of all fights
  //only two NPCs can fight each other at a time
  //the winner moves on, the loser is eliminated
  //the winner continues to fight until they are victorious against all challengers, or until they are defeated and die, making the challenger the new champion. The simulation should continue running in this way until all challengers are exhausted
  //Use promises?
  //Use Array.reduce()?
  //Use both together?
}


// ASSERTIONS TO BE USED ////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

function assertEqual (actual, expected, testName) {
  if (actual === expected) {
    console.log('passed: ' + '[ ' + testName + ']');
  } else {
    console.log('FAILED: [' + testName + '] \nexpected: ' + expected + '\nactual: ' + actual);
  }
}

// DEBUGGERS ////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

function greet (input) {
  console.log(input)
}

// TEST CASES ///////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
const makeOgre = function () {
  return createNewNPC('ogre', 'Malgroth', [], 5, 10, 50, 50, 8, 2, 4000, 10, 10, 60, 1000, 120, 2, 'common', ['You should never have come here!'])
};

const Malgaroth = makeOgre()

Malgaroth.pickup(items.scrolls[0])

// DEFAULT BUG ENEMY ////
const makeBug = function () {
  return createNewNPC( 'bug', 'Buggo', [], 1, 1, 3, 3, 1, 3, 1500, 0, 3, 0, 1, 1, 0, '', ['*buzzing noises*', 'Buzz buzz bitch', '*bug sounds*'] )
};

// DEFAULT FOX ENEMY ////
const makeFox = function () {
  return createNewNPC( 'fox', 'Foxy', [], 1, 1, 6, 6, 2, 6, 2000, 0, 5, 1, 10, 1, 0, '', ['What does the fox say?', 'Ring ting ting ting ting, t-ting t-ting'] )
};

// DEFAULT HUMAN ENEMY ////
const makeHuman = function () {
  return createNewNPC( 'human', 'Greg', [], 2, 1, 20, 20, 2, 2, 3500, 0, 5, 1, 20, 1, 2, 'common', ['Hello!', 'I mean you no harm!', 'I come in peace!', 'Alright, time to die!', "I'll fucking kill you!", 'Die!', 'Ahoy!', "You've met your match!", "You killed my friend!"] )
};

// TEST NPC ////
let testNPC = new NPC ('shapeshifter', 'The Enduring One', [], 2, 1, 100, 100, 20, 5, 500, 50, 25, 100, 100, 200, ['D̴̗̯̏ŭ̵̝̄i̸̛ͅs̷ ĝ̶̖r̷̢̨̎a̵̦̎v̷͎̿ǐ̴͕́ͅd̷͔̐ͅą̷̃ ̸̜̔ę̷̕n̶̘̟̕ḯ̷̪ͅṁ̸̮̥͑ ̷͓͎͝d̶̗̞͆͆u̴͍̰̓̇i̶̬͇͂͆', 'S̶̜̃e̷͕͘d̴͓͑ ĉ̶̞o̴̬̐n̴̰͘s̸̳̆e̷̚ͅć̷̠t̸̢̾ě̴̢t̴͑͜u̸̢͘r̶̛͕', 'c̷̱̊o̴̪͛n̵̩̑s̶͐ͅè̴͕ĉ̵̹ṯ̸̈́ę̸́t̵̯͑u̵̥͝ŕ̶̩ ̴̣̽f̴̤̎a̴͔͊ù̴͇c̴͎̊i̴͕͆b̵̧̾ú̸͓ś̵̗'])

let lineup = [makeBug(), makeFox(), makeHuman()];

console.log(lineup)

// GAMEPLAY /////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

//I want to hit a button, and run a simulation where the first character in an array of characters fights the second till one of them dies.

//I want this process to continue until all characters in the array have died except for one, who is then declared the ultimate winner.

//I want them to level up too if they gain enough experience. I want them to randomly find items that they can then equip, which will help them perform better in the fights.

//I want this to happen automatically.

//STEPS

// 1) determine data structure
// 2) find a way to make the fight function happen in the expected sequence
// 3) get the algorithm working properly
// 4) level balance the vanilla characters
// 5) add in equipment and item drops
// 6) level balance the equipment
// 7) run the simulation a bunch of times
// 8) add graphics and sound

// IMPLEMENTATION
// 1) determine data structure

// Each character should be an object, stored in an array.

/*
const lineup = [];
lineup.push(new NPC('Champoin', 1, 10, 10, 0, 1, 1, 1, 0, 1, 2))
lineup.push(new NPC('Contender', 1, 10, 10, 0, 1, 1, 1, 0, 1, 2))
lineup.push(new NPC('On Deck', 1, 10, 10, 0, 1, 1, 1, 0, 1, 2))
*/


//2) find a way to make the fight function happen in the expected sequence
//3) get the algorithm working properly
//4) level balance the vanilla characters
//5) add in equipment and item drops
//6) level balance the equipment
//7) run the simulation a bunch of times
//8) add graphics and sound