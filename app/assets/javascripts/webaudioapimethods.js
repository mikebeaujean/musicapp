window.AudioContext = window.webkitAudioContext;
context = new AudioContext();
var bufferLoader;
var ABuffer, BBuffer, CSharpBuffer, DBuffer, EBuffer, FSharpBuffer, GSharpBuffer, HighABuffer;

// function loadNote(url) {
//   var request = new XMLHttpRequest();
//   request.open('GET', url, true);
//   request.responseType = 'arraybuffer';

//   request.onload = function() {
//     context.decodeAudioData(request.response, function(buffer) {
//     	noteBuffer = buffer;
//     });
//   };
//   request.send();
//   return noteBuffer;
// };

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
  // Create two sources and play them both together.
  ABuffer = context.createBufferSource();
  BBuffer = context.createBufferSource();
  CSharpBuffer = context.createBufferSource();
  DBuffer = context.createBufferSource();
  EBuffer = context.createBufferSource();
  FSharpBuffer = context.createBufferSource();
  GSharpBuffer = context.createBufferSource();
  HighABuffer = context.createBufferSource();

  ABuffer.buffer = bufferList[0];
  BBuffer.buffer = bufferList[1];
  CSharpBuffer.buffer = bufferList[2];
  DBuffer.buffer = bufferList[3];
  EBuffer.buffer = bufferList[4];
  FSharpBuffer.buffer = bufferList[5];
  GSharpBuffer.buffer = bufferList[6];
  HighABuffer.buffer = bufferList[7];

  ABuffer.connect(context.destination);
  BBuffer.connect(context.destination);
  CSharpBuffer.connect(context.destination);
  DBuffer.connect(context.destination);
  EBuffer.connect(context.destination);
  FSharpBuffer.connect(context.destination);
  GSharpBuffer.connect(context.destination);
  HighABuffer.connect(context.destination);
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


function playSound(buffer) {
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.start(0);                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);
};