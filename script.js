(function(){
var mouse = document.getElementById("mouse");
var head = document.getElementById("head");
var pupils = document.querySelectorAll(".pupil");

var angle = 0;          // where the mouse is on its path
var cx = 300, cy = 300; // centre of the path
var rx = 230, ry = 120; // size of the path

function move() {
  angle += 0.02;

  // position of the mouse on the oval
  var x = cx + rx * Math.cos(angle);
  var y = cy + ry * Math.sin(angle);

  // turn the mouse to face the way it is running
  var turn = Math.atan2(ry * Math.cos(angle), -rx * Math.sin(angle));
  mouse.style.left = (x - 20) + "px";
  mouse.style.top = (y - 11) + "px";
  mouse.style.transform = "rotate(" + turn + "rad)";

  // mouse goes behind the cat when it is at the back
  mouse.style.zIndex = y < cy ? 1 : 10;

  // cat looks at the mouse
  var dx = x - 300, dy = y - 195;
  var d = Math.sqrt(dx * dx + dy * dy);
  var px = dx / d, py = dy / d;
  head.style.transform = "translate(" + px * 10 + "px," + py * 5 + "px)";
  for (var i = 0; i < pupils.length; i++) {
    pupils[i].style.transform = "translate(" + px * 5 + "px," + py * 6 + "px)";
  }

  requestAnimationFrame(move);
}
move();

})();
(function(){
var car = document.getElementById("car");
var slider = document.getElementById("speed");
var deg = document.getElementById("deg");

var angle = 0;
var cx = 300, cy = 225, radius = 160;

function drive() {
  angle += Number(slider.value) * 0.01;

  var x = cx + radius * Math.cos(angle);
  var y = cy + radius * Math.sin(angle);

  // move the car and turn it to face the way it is going
  car.style.transform = "translate(" + (x - 30) + "px," + (y - 15) + "px) rotate(" + (angle + Math.PI / 2) + "rad)";
  deg.textContent = Math.round((angle * 180 / Math.PI) % 360) + "°";

  requestAnimationFrame(drive);
}
drive();

})();
(function(){
var stage = document.getElementById("stage");
var me = document.getElementById("me");
var foe = document.getElementById("foe");
var bubble = document.getElementById("bubble");
var flash = document.getElementById("flash");
var replay = document.getElementById("replay");

// the conversation: who speaks, what they say, and an optional effect
var lines = [
  { who: "foe", text: "Sit down. Look at you. One leg. You will never reach the top." },
  { who: "me",  text: "The mountain never asked how many legs I brought." },
  { who: "foe", text: "You will fall. And nobody will come back for you." },
  { who: "me",  text: "Then I will fall forward.", fx: "flash" },
  { who: "foe", text: "Why? Why do you keep going?" },
  { who: "me",  text: "Because strength was never in the legs.", fx: "shake" },
  { who: "foe", text: "...", fx: "bow" },
  { who: "me",  text: "Watch me.", fx: "walk" }
];
var i = 0;
var pos = 100;   // where "me" stands (left, in pixels)

// make the rain
for (var r = 0; r < 70; r++) {
  var drop = document.createElement("div");
  drop.className = "drop";
  drop.style.left = Math.random() * 700 + "px";
  drop.style.animationDuration = (0.6 + Math.random() * 0.6) + "s";
  drop.style.animationDelay = (-Math.random()) + "s";
  stage.appendChild(drop);
}

// hop forward on the crutch
function moveTo(x, seconds) {
  pos = x;
  me.style.transition = "left " + seconds + "s linear";
  me.style.left = x + "px";
  me.classList.add("hop");
  setTimeout(function () { me.classList.remove("hop"); }, seconds * 1000);
}

function effect(fx) {
  if (fx == "flash") { flash.classList.remove("on"); void flash.offsetWidth; flash.classList.add("on"); }
  if (fx == "shake") { stage.classList.remove("shake"); void stage.offsetWidth; stage.classList.add("shake"); }
  if (fx == "bow") { foe.classList.add("bow"); }
}

function showLine() {
  if (i >= lines.length) {
    setTimeout(function () { replay.style.display = "inline-block"; }, 3000);
    return;
  }
  var line = lines[i];
  bubble.className = line.who;
  bubble.textContent = "";
  effect(line.fx);

  // every time "me" speaks he hops a little closer; at the end he walks right up
  if (line.who == "me") {
    if (line.fx == "walk") moveTo(380, 3);
    else moveTo(pos + 40, 1.2);
    bubble.style.left = Math.max(10, Math.min(pos - 90, 410)) + "px";
  } else {
    bubble.style.left = "";
  }

  var speaker = line.who == "me" ? me : foe;
  speaker.classList.add("talk");
  var n = 0;
  var timer = setInterval(function () {
    n++;
    bubble.textContent = line.text.slice(0, n);   // one letter at a time
    if (n >= line.text.length) {
      clearInterval(timer);
      speaker.classList.remove("talk");
      setTimeout(function () { i++; showLine(); }, 1800);
    }
  }, 45);
}

replay.onclick = function () {
  replay.style.display = "none";
  i = 0;
  pos = 100;
  me.style.transition = "none";
  me.style.left = "100px";
  foe.classList.remove("bow");
  showLine();
};

showLine();

})();
