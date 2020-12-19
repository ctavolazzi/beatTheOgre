# beatTheOgre
"It's a simple game, sir, but it checks out."

12.18.20
UPDATE
v 0.5

I've been in Hack Reactor precourse of 3 weeks and holy crap I've already learned a lot.

This update is a sort of fixing up. 

The biggest change is in the way the program handles the creation of new semi-randomized NPCs on the index.html button calls.

Before, it had a function call with a long and convluted number of arguments passed in.

Now, it has simple function calls with no parameters.

You can now call makeBug, makeFox, and makeHuman to return an NPC of the chosen type.

Malgaroth is now his own object (that's the ogre).

I changed some of the logic and documentation throughout. Some of it was just bad, other stuff was good but could be accomplished in more simple and straightforward ways.

I'm pretty satisfied with where it's at with what I know how to do. 

I still don't know how to import / export files. Sorry. The JS file is like 800 lines.

It works! I'm happy!

UPDATE
v0.2 

In this simple text-based RPG, choose to fight either a Bug, a Fox, or a Man as you grind to become strong enough to Beat the Ogre, Malgroth.

There are three displays:

1) The Game Log, which displays the current events of the game.
2) The Combat Log, which displays the events currently taking place in combat.
3) The Player Stats, which displays the current stats of the player (you).

You can fight as many enemies at once as you like, but the displays get really weird if you do that.

Try to stick to fighting only one enemy at a time.

The buttons above the displays allow you to choose which enemy you wish to fight.

I recommend starting with the Bug, and working your way up from there.



CODE:

PLEASE FEEL FREE TO EXPERIMENT WITH THE CODE TO CREATE MORE ENEMIES, ITEMS, OR TO PLAY WITH THE STAT BALANCES.

I have been learning how to write JavaScript since the beginning of the pandemic. 

I have been gradually learning more and more. This game may not be terribly impressive on its own, but it was a hell of a lot of fun learning how to make it work.

It uses a blend of object-oriented and functional programming techniques.

When the user clicks one of the buttons, a new enemy of the chosen type is constructed.

Some of the enemies properties (name, inventory) are randomly populated.

Then the Player is pitted against the new enemy. They strike each other until one of them dies.

XP is then awarded, level ups may occur, and items may be dropped and picked up. 



FUTURE PLANS:

I intend to return to this project as I pick up more techniques and technologies in the Hack Reactor bootcamp. I expect to graduate April, 2021.


Thanks, enjoy! If you end up making something using this please send it to me! I'd love to see it.
