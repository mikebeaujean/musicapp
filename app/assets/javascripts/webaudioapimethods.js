window.AudioContext = window.webkitAudioContext;
context = new AudioContext();
var bufferLoader;
var ABuffer, BBuffer, CSharpBuffer, DBuffer, EBuffer, FSharpBuffer, GSharpBuffer, HighABuffer;
var RhythmSample = {};

var tempo = 120; // BPM (beats per minute)
var eighthNoteTime = (60 / tempo) / 2;


function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
};

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
};

function finishedLoading(bufferList) {
  ABuffer = bufferList[0];
  BBuffer = bufferList[1];
  CSharpBuffer = bufferList[2];
  DBuffer = bufferList[3];
  EBuffer = bufferList[4];
  FSharpBuffer = bufferList[5];
  GSharpBuffer = bufferList[6];
  HighABuffer = bufferList[7];
};

bufferLoader = new BufferLoader(
	context,
	[
	  '/A3-220.wav',
	  '/B3-246.wav',
	  '/Csharp4-277.wav',
	  '/D4-293.wav',
	  '/E4-329.wav',
	  '/Fsharp4-369.wav',
	  '/GSharp4-415.wav',
	  '/A4-440.wav'
	],
	finishedLoading
	);

bufferLoader.load();

function playSound(buffer, time) {

	var length = buffer.length;
	var color = DICTIONARY[length];
	var div = "#" + length;

	blink(div, color);

	var source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	if (!source.start)
	  source.start = source.noteOn;
	source.start(time);
};


RhythmSample.play = function() {

  // We'll start playing the rhythm 100 milliseconds from "now"
  var startTime = context.currentTime + 0.100;

  // Play 2 bars of the following:
  for (var bar = 0; bar < 2; bar++) {
    var time = startTime + bar * 8 * eighthNoteTime;
    // Play the bass (kick) drum on beats 1, 5
    playSound(ABuffer.buffer, time);
    playSound(ABuffer.buffer, time + 4 * eighthNoteTime);

    // Play the snare drum on beats 3, 7
    playSound(EBuffer.buffer, time + 2 * eighthNoteTime);
    playSound(EBuffer.buffer, time + 6 * eighthNoteTime);

    // Play the hi-hat every eighth note.
    for (var i = 0; i < 8; ++i) {
      playSound(HighABuffer.buffer, time + i * eighthNoteTime);
    }
  }
};
