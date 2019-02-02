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


var sampleNumbers = []

for (var i = 0; i < 5438; i++) {
  sampleNumbers.push(("0000" + (i+1)).slice(-4));
}

var gridController = {key: {}};

function prepareTheSound(theBox, theSound, elementIndex){
  theBox.onclick = function() {
    console.log("playing " + elementIndex);
    theSound.play();// <-- Prints the number you expect
  };
}

for (var i = 0; i < 4096; i++) {
  var keyId = ("key_" + ("0000" + (i+1)).slice(-4));
  var theIndex = Math.floor(Math.random() * sampleNumbers.length);
  var theColor = controllerColors[Math.floor(Math.random() * controllerColors.length)]
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
  var keyNumberText = document.createTextNode(theElement);
  keyNumber.classList.add("key-number");
  keyNumber.append(keyNumberText);
  box.append(keyNumber);
  console.log("thisSound: " + "https://s3.amazonaws.com/ll-musiclab/public/mp3_samples/sample_" + theElement + ".mp3");
  var thisSound = new Howl({
    src: [("https://s3.amazonaws.com/ll-musiclab/public/mp3_samples/sample_" + theElement + ".mp3")],
    loop: false,
  });
  prepareTheSound(box, thisSound, keyId);
  instrument.append(box);
}

console.log(JSON.stringify(gridController, null, 4));
