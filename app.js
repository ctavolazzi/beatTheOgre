$( document ).ready(function() {
  console.log( 'ready!' );
  // Select already existing HTML elements
  var $app = $('#app');

  // Create new HTML elements
  var $title = $('<h1 class="title">Beat the Ogre</h1>');
  var $subtitle = $('<div class="subtitle">by Christopher Tavolazzi</div>');
  var $display = $('<div class="display"></div>');
  var $controls = $('<div class="controls"></div>');
  var $attackButton = $('<button class="button attack">Attack</button>');
  var $defendButton = $('<button class="button defend">Defend</button>');
  var $retreatButton = $('<button class="button retreat">Retreat</button>');
  var $healButton = $('<button class="button heal">Heal</button>');

  // Create event handler functions
  function handleAttackButtonClick () {
    attack();
  };
  function handleDefendButtonClick () {
    defend();
  };
  function handleRetreatButtonClick () {
    retreat();
  };
  function handleHealButtonClick () {
    heal();
  };

  // Append new HTML elements to the DOM
  $title.appendTo($app);
  $subtitle.appendTo($app);
  $display.appendTo($app);
  $attackButton.appendTo($controls);
  $defendButton.appendTo($controls);
  $retreatButton.appendTo($controls);
  $healButton.appendTo($controls);
  $controls.appendTo($app);

  // Set event listeners (providing appropriate handlers as input)
  $attackButton.on("click", handleAttackButtonClick);
  $defendButton.on("click", handleDefendButtonClick);
  $retreatButton.on("click", handleRetreatButtonClick);
  $healButton.on("click", handleHealButtonClick);
});