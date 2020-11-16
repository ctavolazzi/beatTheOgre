// GLOBAL OBJECTS
const Player = {
  //TO DO: add a persistent display for player and opponent stats
    name: "Crispy",
    age: 30,
    type: 'player',
    level: 1,
    inventory: [],
    health: 10,
    maxHealth: 10,
    defense: 0,
    strength: 1,
    dexterity: 1,
    endurance: 1,
    experience: 0,
    experienceValue: 10,
    experienceThreshold: 1,
    greetings: ["Hello!", "I'll fucking kill you!"],

    //Player object methods
    greet: function (optionalMessage) {
      if (optionalMessage) {
        logGameEvent(this.name + ' says "' + optionalMessage + '"')
        declareGameEvent(this.name + ' says "' + optionalMessage + '"')
      } else {
        let greetingNumber = getRandomInt(0, this.greetings.length - 1);
        logGameEvent(this.name + ' says "' + this.greetings[greetingNumber] + '"')
        declareGameEvent(this.name + ' says "' + this.greetings[greetingNumber] + '"')
      }
    },

    gainExperience: function (loser) {
      this.experience += loser.experienceValue;
      while (this.experience >= this.experienceThreshold) {
        this.levelUp();
      }
    },
    levelUp: function () { 
      console.log(this.name + " LEVEL UP!")
      this.level += 1;
      this.maxHealth += 1;
      this.health = this.maxHealth;
      this.maxInventory += 1;
      this.defense += 1;
      this.strength += 1;
      this.dexterity += 1;
      this.endurance += 1;
      this.experienceValue = Math.ceil(this.experienceValue * 1.1);;
      this.experienceThreshold *= 2;
      console.log(this)
     },

    strike: function (target) { 
      let damage = this.strength;
      applyDamage(this, target, damage);
    },

    pickup: function (item) {
      logGameEvent(this.name + ' picks up the ' + item.name)
      if (item.attributes) {
        for (let i=0; i<item.attributes.length; i++) {
          let currentItemAttribute = item.attributes[i].split(' ');
          let PlayerProperty = currentItemAttribute[0];
          this[PlayerProperty] += (Number(currentItemAttribute[1]));
          console.log(Player.name + ' ' + PlayerProperty + ' ' + currentItemAttribute[1])
          document.getElementById('gameLog').innerHTML += '<br>' + this.name + ' ' + PlayerProperty + ' ' + currentItemAttribute[1];
        }
      }
      this.inventory.push(item);
    },

    drop: function (item) {
      for (let i=0; i<item.attributes.length; i++) {
        logGameEvent(Player.name + ' drops the ' + item.name);
        let currentItemAttribute = item.attributes[i].split(' ');
        let PlayerProperty = currentItemAttribute[0];

        let modifier = Number(currentItemAttribute[1]);
        this[NPCProperty] -= modifier;
        
        console.log(Player.name + ' ' + PlayerProperty + ' ' + currentItemAttribute[1])
        document.getElementById('gameLog').innerHTML += '<br>' + this.name + ' ' + PlayerProperty + ' ' + currentItemAttribute[1];
      }
    }
}//end Player object

const items = [
  //TO DO: make items modify character attributes while in the character's inventory
  {
    name: 'Basic Axe',
    attributes: ['strength +1'],
    rarity: 'common',
    value: 3,
    quote: 'A sturdy common axe.'
  },
  {
    name: 'Big Shield',
    attributes: ['defense +4', 'dexterity -2','endurance -1'],
    rarity: 'uncommon', 
    value: 10,
    quote: 'A big uncommon shield.'
  },
  {
    name: 'Scroll of Fireball',
    attributes: ['unlock casting'],
    rarity: 'unique',
    value: 100000000,
    quote: 'Some knowledge, men were not supposed to possess...'
  }
];



// FUNCTION DEFINITIONS
function NPC (type, name, level, inventory, itemsToSpawn, maxInventory, health, maxHealth, defense, strength, dexterity, endurance, experience, experienceValue, experienceThreshold) {
  //TO DO: random name generator
  this.type = type;
  this.name = name;
  this.level = level;
  this.inventory = inventory;
  this.maxInventory = maxInventory;
  this.health = health;
  this.maxHealth = maxHealth;
  this.defense = defense;
  this.strength = strength;
  this.dexterity = dexterity;
  this.endurance = endurance;
  this.experience = experience;
  this.experienceValue = experienceValue;
  this.experienceThreshold = experienceThreshold;
  this.greetings = ["Hello!"];
  //NPC METHODS
  this.strike = function (target) { 
    let damage = this.strength;
    applyDamage(this, target, damage);
  };

  this.gainExperience = function (loser) {
    this.experience += loser.experienceValue;
    while (this.experience >= this.experienceThreshold) {
      this.levelUp();
    }
    console.log(this.name + ' gained ' + loser.experienceValue + ' XP')
  };

  this.pickup = function (item) {
    logGameEvent(this.name + ' picks up the ' + item.name);
    declareGameEvent(this.name + ' picks up the ' + item.name);

    if (item.attributes) {
      for (let i=0; i<item.attributes.length; i++) {
        let currentItemAttribute = item.attributes[i].split(' ');
        let NPCProperty = currentItemAttribute[0];

        this[NPCProperty] += (Number(currentItemAttribute[1]));

        logGameEvent(this.name + ' ' + NPCProperty + ' ' + currentItemAttribute[1]);
        declareGameEvent(this.name + ' ' + NPCProperty + ' ' + currentItemAttribute[1]);

        console.log(this.name + ' ' + currentItemAttribute[0] + ': ' + this[currentItemAttribute[0]]);
      }
    }

    this.inventory.push(item);
  };

  this.drop = function (item) {
    logGameEvent(this.name + ' drops the ' + item.name);
    declareGameEvent(this.name + ' drops the ' + item.name);
    for (let i=0; i<item.attributes.length; i++) {
      let currentItemAttribute = item.attributes[i].split(' ');
      let NPCProperty = currentItemAttribute[0];

      let modifier = Number(currentItemAttribute[1]);
      this[NPCProperty] -= modifier;

      logGameEvent(this.name + ' ' + NPCProperty + ' ' + '-' + modifier)
      declareGameEvent(this.name + ' ' + NPCProperty + ' ' + '-' + modifier)
    };

    let droppedItem = this.inventory.splice(inventory.indexOf(item), 1)
    return droppedItem[0];
  };

  if(itemsToSpawn > 0) {
    populateInventory(this, itemsToSpawn);
  };

  this.dropInventory = function () {
    if (this.inventory.length > 0) {
      let tempInventory = [];
      let inventoryLength = this.inventory.length;
      for (let i=0; i<inventoryLength; i++) {
        let droppedItem = this.drop(this.inventory[0])
        tempInventory.push(droppedItem);
        this.inventory.pop();
      }
    return tempInventory;
    }
  };

  this.levelUp = function () { 
    this.level += 1,
    this.maxHealth += 1,
    this.health = this.maxHealth,
    this.maxInventory += 1,
    this.defense += 1,
    this.strength += 1,
    this.dexterity += 1,
    this.endurance += 1
    this.experienceValue = Math.ceil(experienceValue * 1.1);
    this.experienceThreshold *= 2;
    console.log(this);
  };

  this.greet = function () {
    let greetingNumber = getRandomInt(0, this.greetings.length - 1);
    logGameEvent(this.name + ' says "' + this.greetings[greetingNumber] + '"');
    declareGameEvent(this.name + ' says "' + this.greetings[greetingNumber] + '"');
  }
}//end NPC constructor

function fight (dude1, dude2, optionalMessage) {
  logGameEvent("FIGHT BEGINS!")
  declareGameEvent("<br> FIGHT BEGINS!")
  let message = optionalMessage;
  dude1.greet();
  dude2.greet();
  //each dude strikes the dude until one of them dies, according to their dexterity
  function dude1Strike () {
    dude1.strike(dude2);
    if (dude2.health <= 0) {
      endFight(dude1, dude2, dude1StrikeInterval, dude2StrikeInterval, message)
    }
  }
  
  function dude2Strike () {
    dude2.strike(dude1);
    if (dude1.health <= 0) {
      endFight(dude1, dude2, dude1StrikeInterval, dude2StrikeInterval, message)
    }
  }

  let dude1StrikeInterval = setInterval(dude1Strike, convertDexterityToInterval(dude1));
  let dude2StrikeInterval = setInterval(dude2Strike, convertDexterityToInterval(dude2));
}

/*
function cast (spell, target) {
  spell(target);
}

function fireball (target) {
  applyDamage(target);
}
*///I want to figure out how to add a method to the Player object on magical item pickup. 
//I could use something like:
//when the item is added to the Player's inventory, it redefines Player.cast to the above function

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnItemOnChance (item) {
  let value = getRandomInt(1, 3);
  if (value === 2) {
    return item;
  } 
}

function populateInventory (character, itemsToSpawn) {
  for (let i=0; i<itemsToSpawn; i++) {
    let spawnedItem = spawnItemOnChance(items[0]);

    if (spawnedItem !== undefined) {
      logGameEvent('Spawned ' + spawnedItem.name + ' to ' + character.name + ' inventory.')
      character.pickup(spawnedItem);//ERROR: LOGGING TOO MANY TIMES
    } else {
      console.log('No items spawned to ' + character.name + ' inventory.')
    }
    console.log(character.inventory)
  }
}

function applyDamage (source, target, damage) {
  if (target.defense > 0) {
    for (let i=damage; i>0; i--) {
      if (target.defense > 0) {
        target.defense--;
      } else {
        target.health--
      }
    }
    damageDebugger(source, target, damage)
  } else {
    target.health = target.health - damage;
    damageDebugger(source, target, damage)
  }
}

function distributeGoodies (winner, loser) {
  winner.gainExperience(loser);
  if (loser.inventory.length > 0) {
    let loserInventory = loser.dropInventory();
    for (let i=0; i<loserInventory.length; i++) {
      winner.pickup(loserInventory[i]);
    }
  }
}

function displayOptionalMessage (optionalMessage) {
  if (optionalMessage) {
    console.log(optionalMessage);
  }
}

function convertDexterityToInterval (dude) {
  //convert dude's dexterity to a usable setInterval attack interval number
  if (dude.dexterity < 0) {
    dude.dexterity = 0;
  }
  return 1000 + (1000 * (1 / dude.dexterity))
}

function endFight (dude1, dude2, dude1StrikeInterval, dude2StrikeInterval, message) {
  clearInterval(dude1StrikeInterval);
  clearInterval(dude2StrikeInterval);

  let winner = determineWinner(dude1, dude2);
  let loser = determineLoser(dude1, dude2);

  if (JSON.stringify(loser) === JSON.stringify(Player)) {
    console.log("YOU DIED")
  };
  declareWinner(winner, loser);
  distributeGoodies(winner, loser);
  declareExperience(winner, loser);
  displayOptionalMessage(message);
  characterDebugger(winner);
  characterDebugger(loser);
}

function declareWinner (winner) {
  logGameEvent(winner.name + ' WON THE FIGHT!');
  declareGameEvent(winner.name + ' WON THE FIGHT!');
}

function declareExperience (winner, loser) {
  logGameEvent(winner.name + 
  '\nExperience gained: ' + loser.experienceValue + '\nTotal experience: ' + winner.experience + '\nExperience to next level: ' + (winner.experienceThreshold - winner.experience));
  declareGameEvent('Experience gained: ' + loser.experienceValue + '<br>' + 'Total experience: ' + winner.experience + '<br>' + 'Experience to next level: ' + (winner.experienceThreshold - winner.experience))
}

function determineWinner (dude1, dude2) {
  if (dude1.health > 0) {
    return dude1;
  } else {
    return dude2;
  }
}

function determineLoser (dude1, dude2) {
  if (dude1.health === 0) {
    return dude1;
  } else {
    return dude2;
  }
}

function findUltimateWinner (champion, challenger) {
  //run a simulated fight between two NPCs and then make the winner fight the next challenger. Continue the process till we run out of NPCs to fight against each other, and return the ultimate winner of all fights
  //only two NPCs can fight each other at a time
  //the winner moves on, the loser is eliminated
  //the winner continues to fight until they are victorious against all challengers, or until they are defeated and die, making the challenger the new champion. The simulation should continue running in this way until all challengers are exhausted
}


// ASSERTIONS TO BE USED
function assertEqual (actual, expected, testName) {
  if (actual === expected) {
    console.log('passed: ' + '[ ' + testName + ']');
  } else {
    console.log('FAILED: [' + testName + '] \nexpected: ' + expected + '\nactual: ' + actual);
  }
}

// DEBUGGERS 
function damageDebugger (source, target, damage, message) {
  if (message) {
    logGameEvent(message + '\nSource: ' + source.name + '\nTarget: ' + target.name + '\nDamage Remaining: ' + damage)
    declareGameEvent(message + '<br>' + 'Source: ' + source.name + '<br>' + 'Target: ' + target.name + '<br>' + 'Damage Remaining: ' + damage)
  } else {
    logGameEvent(source.name + " ATTACKS " + target.name + " for " + damage + " points of damage!\n" + target.name + ' defense: ' + target.defense + '\n' + target.name + ' health: ' + target.health)
    declareGameEvent(source.name + " ATTACKS " + target.name + " for " + damage + " points of damage!" + '<br>' + target.name + ' defense: ' + target.defense + '<br>' + target.name + ' health: ' + target.health)
  }
}

function logGameEvent (event) {
  console.log(event)
}

function declareGameEvent (event) {
  document.getElementById('gameLog').innerHTML += '<br>' + event;
}

function characterDebugger (character) {
  console.log(character);
}

// TEST CASES
let ogre = new NPC ('ogre', 'Malgroth', 4, [items[2]], 1, 5, 50, 50, 10, 8, 1, 1, 16, 100, 32)

//GAMEPLAY

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