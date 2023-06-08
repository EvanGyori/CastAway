const btn = document.getElementById('playBtn');
const name = document.getElementById('name');
const user = localStorage.getItem('name');
const nameForm = document.getElementById('nameForm');

var newColor = parseInt(localStorage.getItem('color'));
var player = {};

var key = {}
var mouse = {
  x: 0,
  y: 0,
  lmb: false
}
var lookX = 0;
var lookY = 0;

generateWorld();

btn.addEventListener('click', startGame);

if(user) {
  name.value = user
}

function startGame() {
  var inputName = name.value;
  var newName = inputName.substring(0, 10);
  localStorage.setItem('name', newName);
  if (newColor == undefined) {
    newColor = Math.round(Math.random()*4);
    localStorage.setItem('color', newColor);
  }
  nameForm.classList.add('hide');
  inGame = true;
  //Setup player for the game
  player = {
    name: newName,
    color: newColor,
    angle: 0, //Math.round(Math.random()*5),
    hat: -1,
    x: 1000,
    y: 1000,
    walkSpeed: 2.5,
    runSpeed: 4,
    speed: 0,
    vision: 1,
    hp: 100,
    maxHp: 100,
    tempature: 100,
    maxTempature: 100,
    area: 0,
    xp: 0,
    lvl: 1,
    hidden: false,
    eat_animation: [false, 0], // 0 - mouth, 1 - time
    eye_animation: [0, 0] // 0 - eye image, 1 - time
  }
}

setInterval(function() {
  resize();
  if (inGame === true) {
    lookX = (mouse.x-cnv.width/2)/5;
    lookY = (mouse.y-cnv.height/2)/5;
    player.angle = Math.atan2(mouse.x - cnv.width/2, -(mouse.y - cnv.height/2)) - Math.PI/2;
    seasonEffects(player.area);
    playerMovement();
    playerPhysics();
    particlePhysics();
    playerAnimations();
    playerDisplay();
    drawCanvas();
  } else {
    drawMenu();
  }
}, 10);

setInterval(function() {
  world.time++;
  if (world.time >= 6000) {
    world.time = 1;
    world.day++;
    world.windSpeed = Math.floor(Math.random()*20);
  }
}, 100);

function resize() {
  var nativeWidth = 1280;
  var nativeHeight = 641;

  var deviceWidth = window.innerWidth;
  var deviceHeight = window.innerHeight;

  // fits onto the screen
  // var scaleSize = Math.min(deviceWidth / nativeWidth, deviceHeight / nativeHeight);
  // fills the screen but will crop edges
  scaleSize = Math.max(deviceWidth / nativeWidth, deviceHeight / nativeHeight);
  // To change the players vision decrease the scaleSize
  if (inGame === true) {
    scaleSize /= player.vision;
  }

  cnv.style.width = deviceWidth + "px";
  cnv.style.height = deviceHeight + "px";
  cnv.width = deviceWidth;
  cnv.height = deviceHeight;

    ctx.setTransform(
      scaleSize, 0,
      0, scaleSize,
      Math.floor(deviceWidth/2)-lookX,
      Math.floor(deviceHeight/2)-lookY
    );

  offsetToNativeTop = (-nativeHeight/2)*scaleSize;
  offsetToNativeLeft = (-nativeWidth/2)*scaleSize;

  offsetTop = -(deviceHeight/scaleSize)/2+lookY/scaleSize;
  offsetLeft = -(deviceWidth/scaleSize)/2+lookX/scaleSize;

  displayWidth = deviceWidth/scaleSize;
  displayHeight = deviceHeight/scaleSize;

  if (scaleSize < 1) {
    ctx.imageSmoothingEnabled = true;
  } else {
    ctx.imageSmoothingEnabled = false;
  }
}

function drawMenu() {
  ctx.clearRect(offsetLeft, offsetTop, displayWidth, displayHeight);
  var mouseX = mouse.x/scaleSize;
  var mouseY = mouse.y/scaleSize;

  ctx.lineWidth=5;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#8D5524';
  if (mouseX >= -65-offsetLeft && mouseX <= -45-offsetLeft && mouseY >= -10-offsetTop && mouseY <= 10-offsetTop) {
    ctx.lineWidth=8;
  }
  if (newColor == 0) { ctx.strokeStyle = '#3FBF3F'; }
  ctx.strokeRect(-65, -10, 20, 20);
  ctx.fillRect(-65, -10, 20, 20);

  ctx.lineWidth=5;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#C68642';
  if (mouseX >= -35-offsetLeft && mouseX <= -15-offsetLeft && mouseY >= -10-offsetTop && mouseY <= 10-offsetTop) {
    ctx.lineWidth=8;
  }
  if (newColor == 1) { ctx.strokeStyle = '#3FBF3F'; }
  ctx.strokeRect(-35, -10, 20, 20);
  ctx.fillRect(-35, -10, 20, 20);

  ctx.lineWidth=5;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#E0AC69';
  if (mouseX >= -5-offsetLeft && mouseX <= 15-offsetLeft && mouseY >= -10-offsetTop && mouseY <= 10-offsetTop) {
    ctx.lineWidth=8;
  }
  if (newColor == 2) { ctx.strokeStyle = '#3FBF3F'; }
  ctx.strokeRect(-5, -10, 20, 20);
  ctx.fillRect(-5, -10, 20, 20);

  ctx.lineWidth=5;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#F1C27D';
  if (mouseX >= 25-offsetLeft && mouseX <= 45-offsetLeft && mouseY >= -10-offsetTop && mouseY <= 10-offsetTop) {
    ctx.lineWidth=8;
  }
  if (newColor == 3) { ctx.strokeStyle = '#3FBF3F'; }
  ctx.strokeRect(25, -10, 20, 20);
  ctx.fillRect(25, -10, 20, 20);

  ctx.lineWidth=5;
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#FFDBAC';
  if (mouseX >= 55-offsetLeft && mouseX <= 75-offsetLeft && mouseY >= -10-offsetTop && mouseY <= 10-offsetTop) {
    ctx.lineWidth=8;
  }
  if (newColor == 4) { ctx.strokeStyle = '#3FBF3F'; }
  ctx.strokeRect(55, -10, 20, 20);
  ctx.fillRect(55, -10, 20, 20);

  ctx.lineWidth=1;
}

function drawCanvas() {
  ctx.clearRect(offsetLeft, offsetTop, displayWidth, displayHeight);

  //Grass Background
  for (i=0; i<world.tiles.length; i++) {
    if (world.tiles[i].type == 0) {
      ctx.beginPath();
      ctx.rect((world.tiles[i].x-1)*(Math.floor(MAP_SIZE/3))-player.x, (world.tiles[i].y-1)*(Math.floor(MAP_SIZE/3))-player.y, Math.ceil(MAP_SIZE/3), Math.ceil(MAP_SIZE/3));
      ctx.fillStyle = "#5E8B3B";
      ctx.fill();
    } else if (world.tiles[i].type == 1) {
      ctx.beginPath();
      ctx.rect((world.tiles[i].x-1)*(Math.floor(MAP_SIZE/3))-player.x, (world.tiles[i].y-1)*(Math.floor(MAP_SIZE/3))-player.y, Math.ceil(MAP_SIZE/3), Math.ceil(MAP_SIZE/3));
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
  }

  //Grass Borders
    if (player.area == 0) {
      ctx.fillStyle = "#46692A";
    } else if (player.area == 1) {
      ctx.fillStyle = "#D1D1D1";
    }

  ctx.beginPath();
  ctx.rect(-player.x-displayWidth+lookX/scaleSize, offsetTop, (cnv.width-lookX)/scaleSize, displayHeight);
  ctx.rect(offsetLeft, -player.y-displayHeight+lookY/scaleSize, displayWidth, (cnv.height-lookY)/scaleSize);
  ctx.rect(MAP_SIZE-player.x, offsetTop, (cnv.width+lookX)/scaleSize, displayHeight);
  ctx.rect(offsetLeft, MAP_SIZE-player.y, displayWidth, (cnv.height+lookY)/scaleSize);
  ctx.fill();

  for (i=0; i<particles.length; i++) {
    if (particles[i].id == 1) {
      if (particles[i].x >= player.x-(cnv.width/scaleSize)/2-50 && particles[i].y >= player.y-(cnv.height/scaleSize)/2-50
      && particles[i].x <= player.x+(cnv.width/scaleSize)/2+50 && particles[i].y <= player.y+(cnv.height/scaleSize)/2+50) {
        ctx.save();
        ctx.setTransform(
          scaleSize, 0,
          0, scaleSize,
          (particles[i].x-player.x)*scaleSize+cnv.width/2-lookX,
          (particles[i].y-player.y)*scaleSize+cnv.height/2-lookY
        );
        ctx.rotate(particles[i].angle + Math.PI/2);
        if (particles[i].id == 1) {
          if (particles[i].type == 0) {
            ctx.drawImage(blood_img, -25, -25, 50, 50);
          }
        }
        ctx.restore();
      }
    }
  }

  // if the player isnt hiding then his name will appear above his head
  if (player.hidden === false) {
    ctx.font = '20px Arial';
    ctx.lineWidth = 5;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';
    ctx.strokeText(player.name, 0, -70);
    ctx.fillText(player.name, 0, -70);
  }

  if (player.speed == player.walkSpeed) {
    ctx.save();
    ctx.setTransform(
      scaleSize, 0,
      0, scaleSize,
      (-4*Math.cos(player.angle))*scaleSize+Math.floor(cnv.width/2)-lookX,
      (-4*Math.sin(player.angle))*scaleSize+Math.floor(cnv.height/2)-lookY
    );
    ctx.rotate(player.angle + Math.PI/2);
    ctx.drawImage(rightHand_img, -50, -50, 100, 100);
    ctx.drawImage(leftHand_img, -50, -50, 100, 100);
    ctx.globalAlpha = (player.maxTempature-player.tempature)/200;
    ctx.drawImage(rightHandTemp_img, -50, -50, 100, 100);
    ctx.drawImage(leftHandTemp_img, -50, -50, 100, 100);
    ctx.globalAlpha = 1;
    if (player.hat != -1) {
      ctx.drawImage(hat_rightHand_img, -50, -50, 100, 100);
      ctx.drawImage(hat_leftHand_img, -50, -50, 100, 100);
    }
    ctx.restore();
    ctx.save();
    ctx.setTransform(
      scaleSize, 0,
      0, scaleSize,
      Math.floor(cnv.width/2)-lookX,
      Math.floor(cnv.height/2)-lookY
    );
    ctx.rotate(player.angle + Math.PI/2);
  } else {
    ctx.save();
    ctx.setTransform(
      scaleSize, 0,
      0, scaleSize,
      Math.floor(cnv.width/2)-lookX,
      Math.floor(cnv.height/2)-lookY
    );
    ctx.rotate(player.angle + Math.PI/2);
    ctx.drawImage(rightHand_img, -50, -50, 100, 100);
    ctx.drawImage(leftHand_img, -50, -50, 100, 100);
    ctx.globalAlpha = (player.maxTempature-player.tempature)/200;
    ctx.drawImage(rightHandTemp_img, -50, -50, 100, 100);
    ctx.drawImage(leftHandTemp_img, -50, -50, 100, 100);
    ctx.globalAlpha = 1;

    if (player.hat != -1) {
      ctx.drawImage(hat_rightHand_img, -50, -50, 100, 100);
      ctx.drawImage(hat_leftHand_img, -50, -50, 100, 100);
    }
  }
  ctx.drawImage(player_img, -50, -50, 100, 100);
  ctx.globalAlpha = (player.maxTempature-player.tempature)/200;
  ctx.drawImage(playerTemp_img, -50, -50, 100, 100);
  ctx.globalAlpha = 1;
  ctx.drawImage(player_eyes_img, -50, -50, 100, 100);
  if (player.eat_animation[0] === true) {
    ctx.drawImage(mouth_img, -50, -50, 100, 100);
  }
  if (player.hat != -1) {
    ctx.drawImage(player_hat_img, -100, -100, 200, 200);
  }
  ctx.restore();

  for (i=0; i<particles.length; i++) {
    if (particles[i].id == 0) {
      if (particles[i].x >= player.x-(cnv.width/scaleSize)/2-50 && particles[i].y >= player.y-(cnv.height/scaleSize)/2-50
      && particles[i].x <= player.x+(cnv.width/scaleSize)/2+50 && particles[i].y <= player.y+(cnv.height/scaleSize)/2+50) {
        ctx.save();
        ctx.setTransform(
          scaleSize, 0,
          0, scaleSize,
          (particles[i].x-player.x)*scaleSize+cnv.width/2-lookX,
          (particles[i].y-player.y)*scaleSize+cnv.height/2-lookY
        );
        ctx.rotate(particles[i].angle + Math.PI/2);
        if (particles[i].id == 0) {
          if (particles[i].type == 0) {
            ctx.drawImage(leaf_0_img, -20, -20, 40, 40);
          } else if (particles[i].type == 1) {
            ctx.drawImage(leaf_1_img, -20, -20, 40, 40);
          }
        }
        ctx.restore();
      }
    }
  }

  if (world.time >= 5500) {
    darken(offsetLeft, offsetTop, displayWidth, displayHeight, '#000', (6000-world.time)/510);
  } else if (world.time >= 3000) {
    darken(offsetLeft, offsetTop, displayWidth, displayHeight, '#000', 0.9);
  } else if (world.time >= 2500) {
    darken(offsetLeft, offsetTop, displayWidth, displayHeight, '#000', 0.9/500*(world.time-2500));
  }
  var islight = false;
  if (squareCollision(offsetLeft, offsetTop, displayWidth, displayHeight, -400-player.x, -400-player.y, 800, 800) === true) {
    lighten(-player.x, -player.y, 200);
    nolight = 0;
    islight = true;
  }

  if (islight === false && world.time >= 3000 && world.time < 5500) {
    nolight += 0.001;
    darken(offsetLeft, offsetTop, displayWidth, displayHeight, '#000', nolight);
  }

  ctx.globalAlpha = (player.maxHp-player.hp)/150;
  ctx.save();
  var radialGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, cnv.width/scaleSize/2);
  radialGradient.addColorStop(0.1, '#666666');
  radialGradient.addColorStop(1, '#333333');
  ctx.fillStyle = radialGradient;
  ctx.rect(offsetLeft, offsetTop, displayWidth, displayHeight);
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;
}
