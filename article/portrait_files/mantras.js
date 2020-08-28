$(document).ready(function() {

  // mantras
  var mantras_mon = [
  	"Commute, work, commute, sleep ...",
  	"Don’t beg for the right to live — take it.",
  	"Run, comrade, the old world is behind you!",
  	"Quick!",
    "Less, better things."
  ];

  var mantras_tues = [
  	"Don’t liberate me — I’ll take care of that.",
  	"You will end up dying of comfort.",
  	"Live without dead time.",
  	"Power to the imagination.",
    "Grab yourself by the hand and frolic through endless acres of continuous inspiration!",
    "Try it for five minutes, human.",
    "Love then change then love then change then love then change then love then change then......"
  ];

  var mantras_wed = [
  	"Chance must be systematically explored.",
  	"Unbutton your mind as often as you fly.",
  	"Life is elsewhere.",
  	"Forget everything you’ve been taught. Start by dreaming."
  ];

  var mantras_thurs = [
  	"Form dream committees.",
    "Thought that stagnates rots.",
    "Write everywhere.",
    "I don’t have time to write!!!",
    "The world is big.",
    "Open every window!"
  ];

  var mantras_fri = [
    "Look in front of you!!!",
    "Open the windows of your heart.",
    "You can no longer sleep quietly once you’ve suddenly opened your eyes.",
    "The future will only contain what we put into it now.",
    "A path is made by walking."
  ];

  var mantras_sat = [
    "Permanent cultural vibration.",
    "When people notice they are bored, they stop being bored.",
    "I'm a breather.",
    "No crying until the ending."
  ];

  var mantras_sun = [
    "An adventure doesn't begin until you enter the forest.",
    "Life is living you.",
    "Experiment on yourself.",
    "Compression is the first grace of style.",
    "When you think you're going fast enough to hit a jump, pedal once more.",
    "positivity, productivity, and peace."
  ];

  // Randomize!
  function select_random(x){
  	y = x[Math.floor(Math.random()*x.length)];
  	return y;
  }

	// Select a random mantra
	var selected_mantra_mon = select_random(mantras_mon);
  var selected_mantra_tues = select_random(mantras_tues);
  var selected_mantra_wed = select_random(mantras_wed);
  var selected_mantra_thurs = select_random(mantras_thurs);
  var selected_mantra_fri = select_random(mantras_fri);
  var selected_mantra_sat = select_random(mantras_sat);
  var selected_mantra_sun = select_random(mantras_sun);

	// Based on what day of the week it is,
  // take the selected mantra and bake it into the footer
  var today = new Date();
  console.log("Today is " + today);
  if(today.getDay() == 1){
    $('.mantra').html(selected_mantra_mon);
  }
  if(today.getDay() == 2){
    $('.mantra').html(selected_mantra_tues);
  }
  if(today.getDay() == 3){
    $('.mantra').html(selected_mantra_wed);
  }
  if(today.getDay() == 4){
    $('.mantra').html(selected_mantra_thurs);
  }
  if(today.getDay() == 5){
    $('.mantra').html(selected_mantra_fri);
  }
  if(today.getDay() == 6){
    $('.mantra').html(selected_mantra_sat);
  }
  if(today.getDay() == 0){
    $('.mantra').html(selected_mantra_sun);
  }

});
