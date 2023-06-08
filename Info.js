var cnv = document.getElementById('gameCanvas');
var ctx = cnv.getContext('2d');

const MAP_SIZE = 10000;
const MAX_TREE_COUNT = 100;
const MAX_ROCK_COUNT = 100;

var inGame = false;
var scaleSize = 1;
var nolight;

var offsetToNativeTop = 0;
var offsetToNativeLeft = 0;

var offsetTop = 0;
var offsetLeft = 0;

var DisplayWidth = 0;
var DisplayHeight = 0;

var world = {
  day: 1,
  time: 1,
  windSpeed: 1,
  tiles: []
}
var particles = [];

var player_img = new Image();
var player_eyes_img = new Image();
var player_hat_img = new Image();
var rightHand_img = new Image();
var leftHand_img = new Image();
var hat_rightHand_img = new Image();
var hat_leftHand_img = new Image();
var mouth_img = new Image();
var playerTemp_img = new Image();
var rightHandTemp_img = new Image();
var leftHandTemp_img = new Image();
var leaf_0_img = new Image();
var leaf_1_img = new Image();
var blood_img = new Image();

player_img.src = 'Player-0.svg';
player_eyes_img.src = 'PlayerEyes-0.svg';
player_hat_img.src = 'Hat-1.svg';
rightHand_img.src = 'RightHand-0.svg';
leftHand_img.src = 'LeftHand-0.svg';
hat_rightHand_img.src = 'HatRightHand-0.svg';
hat_leftHand_img.src = 'HatLeftHand-0.svg';
mouth_img.src = 'PlayerMouth.svg';
playerTemp_img.src = 'PlayerCold.svg';
rightHandTemp_img.src = 'RightHandTemp.svg';
leftHandTemp_img.src = 'LeftHandTemp.svg';
leaf_0_img.src = 'Leaf-0.svg';
leaf_1_img.src = 'Leaf-1.svg';
blood_img.src = 'Blood-2.svg';

$(function() {
  $(document).keydown(function(evt) {
    switch(evt.keyCode) {
      case 87: // W key
        key.w = true;
        break;
      case 83: // S key
        key.s = true;
        break;
      case 68: // D key
        key.d = true;
        break;
      case 65: // A key
        key.a = true;
        break;
      case 16:
        key.shift = true;
        break;
    }
  }).keyup(function(evt) {
    switch(evt.keyCode) {
      case 87: // W key
        key.w = false;
        break;
      case 83: // S key
        key.s = false;
        break;
      case 68: // D key
        key.d = false;
        break;
      case 65: // A key
        key.a = false;
        break;
      case 16:
        key.shift = false;
        break;
      case 88:
        player.hidden = !player.hidden;
        break;
    }
  });
});

$('body').mousedown(function(evt) {
  switch(evt.which) {
    case 1:
      mouse.lmb = true;
      break;
  }
}).mouseup(function(evt) {
  switch(evt.which) {
    case 1:
      mouse.lmb = false;
      LMBup();
      break;
  }
});

document.onmousemove = function(evt) {
  mouse.x = evt.pageX;
  mouse.y = evt.pageY;
}

function LMBup() {
  if (inGame === false) {
    var mouseX = mouse.x/scaleSize;
    var mouseY = mouse.y/scaleSize;

    if (mouseX >= -65-offsetLeft && mouseX <= -45-offsetLeft && mouseY >= -10-offsetTop && mouseY <= 10-offsetTop) {
      newColor = 0;
      localStorage.setItem('color', 0);
    }
    if (mouseX >= -35-offsetLeft && mouseX <= -15-offsetLeft && mouseY >= -10-offsetTop && mouseY <= 10-offsetTop) {
      newColor = 1;
      localStorage.setItem('color', 1);
    }
    if (mouseX >= -5-offsetLeft && mouseX <= 15-offsetLeft && mouseY >= -10-offsetTop && mouseY <= 10-offsetTop) {
      newColor = 2;
      localStorage.setItem('color', 2);
    }
    if (mouseX >= 25-offsetLeft && mouseX <= 45-offsetLeft && mouseY >= -10-offsetTop && mouseY <= 10-offsetTop) {
      newColor = 3;
      localStorage.setItem('color', 3);
    }
    if (mouseX >= 55-offsetLeft && mouseX <= 75-offsetLeft && mouseY >= -10-offsetTop && mouseY <= 10-offsetTop) {
      newColor = 4;
      localStorage.setItem('color', 4);
    }
  }
}

Math.dist=function(x1, y1, x2, y2) {
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

ctx.roundRect=function(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}
