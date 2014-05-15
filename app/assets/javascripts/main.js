var simonNotes = [];
var simonCounter = 0;
// var simonDuration = simonCounter * eighthNote;
var playerNotes = [];
var isPlayersTurn = false;
var correctResponse = true;
var expertMode;
var playerScore = 0;

// The keys are the length of the individual note buffers; the values are the hex codes
// for the colors their circles flash.  The Dictionary is ordered from low to high notes.
var DICTIONARY = {
	64849: "#FFFF9C",
	47556: "#9CD2FF",
	43744: "#A6FF9C",
	43604: "#B19CFF",
	43649: "#FF9CF7",
	43656: "#FF9C9C",
	43686: "#FFE19C",
	43601: "#9CFFDC",
};

$(document).ready(function(){

	$("#normal").on('click', function(){
		$("#normal").hide();
		$("#expert").hide();
		expertMode = false;
		playSimon();
	});
	$("#expert").on('click', function(){
		expertMode = false;
		var scale = [ABuffer, BBuffer, CSharpBuffer, DBuffer, EBuffer, FSharpBuffer, GSharpBuffer, HighABuffer];
		var duration = sequenceDuration(scale);

		$("#normal").hide();
		$("#expert").hide();

		playSequence(scale, eighthNote);
		setTimeout(function(){
			expertMode = true;
			playSimon();
		}, (duration * 1000) + (eighthNote * 4000));
	});

	$("#player-score").append(playerScore);

	$("#64849").on('click', function(){
		playSound(ABuffer, 0);
	});
	$("#47556").on('click', function(){
		playSound(BBuffer, 0);
	});
	$("#43744").on('click', function(){
		playSound(CSharpBuffer, 0);
	});
	$("#43604").on('click', function(){
		playSound(DBuffer, 0);
	});
	$("#43649").on('click', function(){
		playSound(EBuffer, 0);
	});
	$("#43656").on('click', function(){
		playSound(FSharpBuffer, 0);
	});
	$("#43686").on('click', function(){
		playSound(GSharpBuffer, 0);
	});
	$("#43601").on('click', function(){
		playSound(HighABuffer, 0);
	});
});

// makes the circles flash
function blink(div, color) {
    $(div).stop().css("background-color", color).animate({ backgroundColor: "rgba(0, 0, 0, 0.5)"}, 1500);
};

// plays a tone and makes the associated circle flash
function playSound(buffer, startTime) {
	// accesses the buffer's length to use as a key for the dictionary, then gets the color
	// value
	var length = buffer.length;
	var color = DICTIONARY[length];
	var div = "#" + length;

	// WebAudioAPI boilerplate I copied from the docs
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);

	// actually plays the note and blinks the div, if in normal mode
	setTimeout(function(){
		source.noteOn(0);
		if (!expertMode) {
			blink(div, color);
		};
	}, (startTime * 1000));

	// if it's the player's turn, adds the note to his/her array of responses
	if (isPlayersTurn) {
		playerNotes.push(buffer);
		playersTurn(buffer);
	};
};

function sequenceDuration(sequence) {
	return sequence.length * eighthNote;
};

function playSequence(sequence, startTime) {
	// plays the notes in the sequence, an eighth-note apart
	for (i=0; i<sequence.length; i++) {
		playSound(sequence[i], startTime);
		startTime += eighthNote;
	};
};

// adds a note to the computer-generated sequence, plays the sequence, then prompts the
// player to repeat it
function playSimon() {
	$("#player-score").html("");
	$("#player-score").append(playerScore);
	simonCounter++;

	// selects a random note of the scale and pushes it to the computer-generated sequence
	var note = _.sample(bufferLoader.bufferList);
	simonNotes.push(note);

	// creates a slight pause before the round starts
	playSequence(simonNotes, eighthNote);
	var nowYou = $("<p>").text("Now you!");

	// an eighth-note after the computer sequence is finished playing, prompts the player
	// to try to match the sequence
	setTimeout(function(){
		$("#gameplay-box").html("");
		$("#gameplay-box").append(nowYou);
		isPlayersTurn = true;
		playersTurn();
	}, (simonCounter * eighthNote * 1000) + (eighthNote * 1000));
};

// evaluates each note the player inputs to see if it matches the corresponding note in
// the computer's sequence, whether the player has inputted the same number of notes
// as are in the sequence, and, if so, if s/he matched the sequence correctly.  Either
// begins a new round or ends the game, as appropriate.
function playersTurn(note){
	var responseLength = playerNotes.length;

	// as long as the game hasn't just started (meaning there's no player input yet),
	// compares the player's most recent note against the corresponding note in the
	// computer-generated sequence.  If they don't match, sets correctResponse to false.
	if ((responseLength > 0) && !(note === simonNotes[responseLength - 1])) {
		correctResponse = false;
	};

	// if the length of the sequence the player has inputted matches the length of the
	// computer's sequence, evaluates whether to begin another round or end the game.
	// correct response increments the playerScore, clears the score div and appends the new score.
	if (responseLength === simonNotes.length) {
		endTurn();
	};
};

function endTurn(){
	$("#gameplay-box").empty();
	playerNotes = [];
	isPlayersTurn = false;

	if (correctResponse) {
		var goodJob = $("<p>").text("Good job!");
		playerScore += simonNotes.length;
		$("#player-score").html("");
		$("#player-score").append(playerScore);

		// creates a double-length pause before beginning the next round
		setTimeout(function(){
			$("#gameplay-box").append(goodJob);
			playSimon();
		}, (eighthNote * 2000));
	}
	else {
		endGame();
	};
};

function endGame(){
	var sorry = $("<p>").text("Sorry!");

	simonNotes = [];
	simonCounter = 0;
	correctResponse = true;
	playerScore = 0;

	$("#player-score").html("");

	$("#gameplay-box").append(sorry);

	$("#player-score").append(playerScore);

	// creates a quadruple-length pause before offering the user a
	// chance to play again
	setTimeout(function(){
		$("#gameplay-box").empty();
		$("#normal").show();
		$("#expert").show();
	}, (eighthNote * 4000));
};
