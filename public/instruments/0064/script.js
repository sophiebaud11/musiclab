var instrument = document.querySelector('#instrument');
var controllerColors = [
  "rgba(255, 40, 3, 0.5)",
  "rgba(0, 40, 233, 0.7)",
  "rgba(255, 230, 3, 0.5)",
  "rgba(150, 40, 253, 0.9)",
  "rgba(0, 140, 173, 0.7)",
  "rgba(20, 40, 203, 0.5)",
  "rgba(40, 40, 50, 0.8)",
  "rgba(0, 240, 133, 0.5)",
  "rgba(0, 255, 20, 0.7)",
  "rgba(255, 0, 253, 0.9)",
  "rgba(255, 0, 150, 0.9)",
  "rgba(255, 130, 0, 0.95)",
  "rgba(255, 0, 20, 0.9)",
  "rgba(255, 200, 0, 0.95)",
  "rgba(150, 40, 255, 0.8)",
]

var synth = new Tone.Synth().toMaster()
var notes = ["C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
                  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
                  "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
                  "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
                  "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
                  "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
                  "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7",
                  "C8", "C#8", "D8", "D#8", "E8", "F8", "F#8", "G8", "G#8", "A8", "A#8", "B8",
                  "C9", "C#9", "D9", "D#9", "E9", "F9", "F#9", "G9", "", "", "", ""
]

var sampleNumbers = []

for (var i = 0; i < 5438; i++) {
  sampleNumbers.push(("0000" + (i+1)).slice(-4));
}

var gridController = {key: {}};

function prepareTheSound(theBox, note, elementIndex){
  theBox.onclick = function() {
    console.log("playing " + elementIndex);
    synth.triggerAttackRelease(note, '8n')
  };
}

var cSharpMajor = [0, 1, 3, 5, 6, 8, 10];

for (var i = 0; i < 108; i++) {
  var keyId = ("key_" + ("0000" + (i+1)).slice(-4));
  var theIndex = Math.floor(Math.random() * sampleNumbers.length);
  if (cSharpMajor.includes((i+12)%12)) {
    var theColor = "rgba(200,0,50,0.7)";
  } else {
    var theColor = "rgba(0,0,0,.3)";
  }
  var theElement = sampleNumbers.splice(theIndex, 1)[0];
  var theUrl = ("https://s3.amazonaws.com/ll-musiclab/public/mp3_samples/sample_" + theElement + ".mp3");
  console.log("creating " + keyId);
  gridController.key[keyId] = {
    id: theElement,
    color: theColor,
    url: theUrl
  }
  var box = document.createElement("div");
  box.id = keyId;
  box.classList.add("grid-controller-button");
  box.style.backgroundColor = theColor;
  var keyNumber = document.createElement("div");
  var keyNumberText = document.createTextNode(notes[i]);
  keyNumber.classList.add("key-number");
  keyNumber.append(keyNumberText);
  box.append(keyNumber);
  console.log("thisSound: " + "https://s3.amazonaws.com/ll-musiclab/public/mp3_samples/sample_" + theElement + ".mp3");

  //create a synth and connect it to the master output (your speakers)
  //play a middle 'C' for the duration of an 8th note
  var note = notes[i];
  prepareTheSound(box, note, keyId);
  instrument.append(box);
}

console.log(JSON.stringify(gridController, null, 4));
