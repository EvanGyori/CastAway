function generateWorld() {
  var forest = false;
  var arctic = false;
  for(i=0; i<9; i++) {
    do {
      var exists = false;
      var setX = Math.round(Math.random()*2)+1;
      var setY = Math.round(Math.random()*2)+1;
      for (i2=0; i2<world.tiles.length; i2++) {
        if (world.tiles[i2].x == setX && world.tiles[i2].y == setY) {
          exists = true;
        }
      }
    } while(exists === true);
    if (forest === false) {
      var setType = 0;
      forest = true;
    } else if (arctic === false) {
      var setType = 1;
      arctic = true;
    } else {
      var setType = Math.round(Math.random());
    }
    world.tiles[i] = {
      type: setType,
      x: setX,
      y: setY
    }
  }
}

function playerAnimations() {
  if (Math.random() < 0.001) {
    player.eye_animation[0] = 1;
    player.eye_animation[1] = Math.floor(Math.random()*20)+10;
  }
  if (player.eye_animation[1] > 0) {
    if (player.eye_animation[0] == 1 && player.eye_animation[1] == 1) {
        player.eye_animation[0] = 0;
    }
    player.eye_animation[1]--;
  }
  if (player.hp <= player.maxHp/2 && player.eye_animation[1] == 0) {
    player.eye_animation[0] = 2;
  } else if (player.eye_animation[1] == 0) {
    player.eye_animation[0] = 0;
  }

  if (player.eat_animation[1] > 0) {
    if (player.eat_animation[1] == 1) {
      player.eat_animation[0] = false;
    }
    player.eat_animation[1]--;
  }
}

function playerDisplay() {
  if (player.color == 0) {
    player_img.src = 'Player-0.svg';
    rightHand_img.src = 'RightHand-0.svg';
    leftHand_img.src = 'LeftHand-0.svg';
  } else if (player.color == 1) {
    player_img.src = 'Player-1.svg';
    rightHand_img.src = 'RightHand-1.svg';
    leftHand_img.src = 'LeftHand-1.svg';
  } else if (player.color == 2) {
    player_img.src = 'Player-2.svg';
    rightHand_img.src = 'RightHand-2.svg';
    leftHand_img.src = 'LeftHand-2.svg';
  } else if (player.color == 3) {
    player_img.src = 'Player-3.svg';
    rightHand_img.src = 'RightHand-3.svg';
    leftHand_img.src = 'LeftHand-3.svg';
  } else if (player.color == 4) {
    player_img.src = 'Player-4.svg';
    rightHand_img.src = 'RightHand-4.svg';
    leftHand_img.src = 'LeftHand-4.svg';
  }

  if (player.hat == 0) {
    player_hat_img.src = 'Hat-0.svg';
    hat_rightHand_img.src = 'HatRightHand-0.svg';
    hat_leftHand_img.src = 'HatLeftHand-0.svg';
  } else if (player.hat == 1) {
    player_hat_img.src = 'Hat-1.svg';
  } else if (player.hat == 2) {
    player_hat_img.src = 'Hat-2.svg';
    hat_rightHand_img.src = 'HatRightHand-2.svg';
    hat_leftHand_img.src = 'HatLeftHand-2.svg';
  }

  if (player.eye_animation[0] == 0) {
    player_eyes_img.src = 'PlayerEyes-0.svg';
  } else if (player.eye_animation[0] == 1) {
    player_eyes_img.src = 'PlayerEyes-1.svg';
  } else if (player.eye_animation[0] == 2) {
    player_eyes_img.src = 'PlayerEyes-2.svg';
  }
}

function playerMovement() {
  player.speed = 0;
  if (key.w === true || key.s === true || key.a === true || key.d === true) {
    if (key.shift === true) {
      player.speed = player.runSpeed;
    } else {
      player.speed = player.walkSpeed;
    }
  }
  if (key.w === true) {player.y -= player.speed;}
  if (key.s === true) {player.y += player.speed;}
  if (key.a === true) {player.x -= player.speed;}
  if (key.d === true) {player.x += player.speed;}

}

function playerPhysics() {
  for(i=0; i<world.tiles.length; i++) {
    if (world.tiles[i].x == Math.floor(player.x/(MAP_SIZE/3))+1 && world.tiles[i].y == Math.floor(player.y/(MAP_SIZE/3))+1) {
      player.area = world.tiles[i].type;
    }
  }

  // Restricts player from crossing border
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.x > MAP_SIZE) {
    player.x = MAP_SIZE;
  }
  if (player.y > MAP_SIZE) {
    player.y = MAP_SIZE;
  }

  //Decreases players tempature depending on time of day
  if (world.time >= 3000 && world.time <= 5600) {
    if (player.area == 0) {
      player.tempature -= 0.02;
    } else if (player.area == 1) {
      player.tempature -= 0.06;
    }
  } else {
    if (player.area == 0) {
      player.tempature += 0.02;
    } else if (player.area == 1) {
      player.tempature -= 0.02;
    }
  }
  if (player.tempature <= 0) {
    player.tempature = 0;
    player.hp -= 0.02;
  } else if (player.tempature > player.maxTempature) {
    player.tempature = player.maxTempature;
  }
  if (player.hp > player.maxHp) {
    player.hp = player.maxHp;
  } else if (player.hp <= 0) {
    inGame = false;
    lookX = 0;
    lookY = 0;
    nameForm.classList.remove('hide');
  }

  //Player bleeds below half health
  if (player.hp <= player.maxHp/2 && Math.random() <= 0.01) {
    particles[particles.length] = {
      id: 1,
      type: 0,
      x: player.x + (Math.floor(Math.random()*80)-40),
      y: player.y + (Math.floor(Math.random()*80)-40),
      xSpeed: 0,
      ySpeed: 0,
      angle: Math.random()*5,
      turnSpeed: 0,
      lifeTime: 2000
    };
  }
}

function particlePhysics() {
  for(i=0; i<particles.length; i++) {
    particles[i].x += particles[i].xSpeed;
    particles[i].y += particles[i].ySpeed;
    particles[i].angle += particles[i].turnSpeed;
    particles[i].lifeTime--;
    if (particles[i].lifeTime <= 0) {
      particles.splice(i, 1);
    } else if (particles[i].id == 0 && Math.dist(player.x, player.y, particles[i].x, particles[i].y) <= 60) {
      particles.splice(i, 1);
      player.eat_animation = [true, 10];
    }
  }
}

function seasonEffects(area) {
  if (area == 0) {
    var setId = 0;
    var setType = Math.round(Math.random());
  } else if (area == 1) {
    var setId = 1;
    var setType = 0;
  }
  if (area == 0 || area == 1) {
    if (Math.random() < 0.0025*world.windSpeed) {
      particles[particles.length] = {
        id: setId,
        type: setType,
        x: Math.floor(Math.random()*(cnv.width/scaleSize))+player.x-Math.floor(cnv.width/scaleSize/2),
        y: Math.floor(player.y-(cnv.height/scaleSize)/2-50),
        xSpeed: (Math.random()/5)*world.windSpeed,
        ySpeed: (Math.random()/5)*world.windSpeed,
        angle: Math.random()*2,
        turnSpeed: (Math.random()/100-0.005)*world.windSpeed,
        lifeTime: 5000
      };
    }
    if (Math.random() < 0.0025*world.windSpeed) {
      particles[particles.length] = {
        id: setId,
        type: setType,
        x: Math.floor(player.x-(cnv.width/scaleSize)/2-50),
        y: Math.floor(Math.random()*(cnv.height/scaleSize))+player.y-Math.floor(cnv.height/scaleSize/2),
        xSpeed: (Math.random()/5)*world.windSpeed,
        ySpeed: (Math.random()/5)*world.windSpeed,
        angle: Math.random()*2,
        turnSpeed: (Math.random()/100-0.005)*world.windSpeed,
        lifeTime: 5000
      };
    }
    if (Math.random() < 0.0025*world.windSpeed && key.s === true) {
      particles[particles.length] = {
        id: setId,
        type: setType,
        x: Math.floor(Math.random()*(cnv.width/scaleSize))+player.x-Math.floor(cnv.width/scaleSize/2),
        y: Math.floor(player.y+(cnv.height/scaleSize)/2+50),
        xSpeed: (Math.random()/5)*world.windSpeed,
        ySpeed: (Math.random()/5)*world.windSpeed,
        angle: Math.random()*2,
        turnSpeed: (Math.random()/100-0.005)*world.windSpeed,
        lifeTime: 5000
      };
    }
    if (Math.random() < 0.0025*world.windSpeed && key.d === true) {
      particles[particles.length] = {
        id: setId,
        type: setType,
        x: Math.floor(player.x+(cnv.width/scaleSize)/2+50),
        y: Math.floor(Math.random()*(cnv.height/scaleSize))+player.y-Math.floor(cnv.height/scaleSize/2),
        xSpeed: (Math.random()/5)*world.windSpeed,
        ySpeed: (Math.random()/5)*world.windSpeed,
        angle: Math.random()*2,
        turnSpeed: (Math.random()/100-0.005)*world.windSpeed,
        lifeTime: 5000
      };
    }
  }
}

function darken(x, y, w, h, darkenColor, amount) {
  ctx.fillStyle = darkenColor;
  ctx.globalAlpha = amount;
  ctx.fillRect(x, y, w, h);
  ctx.globalAlpha = 1;
}

function lighten(x, y, radius) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var rnd = 0.05 * Math.sin(1.1 * Date.now() / 1000);
    radius = radius * (1 + rnd);
    var radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    radialGradient.addColorStop(0.1, '#AA8'); // BB9
    // radialGradient.addColorStop(0.2 + rnd, '#AA8');
    radialGradient.addColorStop(0.6 + rnd, '#330');
    radialGradient.addColorStop(0.90, '#110');
    radialGradient.addColorStop(1, '#000');
    ctx.fillStyle = radialGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
}

function squareCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  if (x1 < x2 + w2 && x2 < x1 + w1 && y1 < y2 + h2 && y2 < y1 + h1) {
    return true;
  } else {
    return false;
  }
}

function circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
  var distX = Math.abs(cx - rx-rw/2);
  var distY = Math.abs(cy - ry-rh/2);

  if (distX > (rw/2 + cr)) {return false;}
  if (distY > (rh/2 + cr)) {return false;}

  if (distX <= (rw/2)) {return true;}
  if (distY <= (rh/2)) {return true;}

  var dx = distX - rw/2;
  var dy = distY - rh/2;
  return (dx*dx + dy*dy <= (cr*cr));
}
