let x;
let y;
let radius = 2;
let angle = .01;
let sw = false;
let pie = 0;
let s = [];
let StartList = [0,3,6,9];
let ColorList = [255, 0, 255, 0, 255, 128, 127, 0, 255, 0, 128, 255];
let fade = true;
let white = false;

class colors {
  constucter(rv, gv, bv) {
    this.r = rv;
    this.g = gv;
    this.b = bv;
  }
}

class Particle {

  constructor(xv, yv) {
    this.x = xv;
    this.y = yv;

    this.angle = Math.random() * (2 * Math.PI); //random direction
    this.xspeed = (float)(Math.random() * 6) - 3; //random speed
    this.yspeed = (float)(Math.random() * 6) - 3;
    this.radius = (float)(Math.random() * 7);
    this.pos = (int)(Math.random() * 4);
  }

  show() {
    //this a mess but it was the only way to do it that made sence to me
    if(white) { fill(255) }
    else {
    fill(ColorList[StartList[this.pos]], ColorList[StartList[this.pos]+1], ColorList[StartList[this.pos]+2]);
    }
    
    ellipse(this.x, this.y, 20, 20);
  }

  move() {
    this.x += this.xspeed;
    this.y += this.yspeed;
    this.x += Math.cos(this.angle) * this.radius;
    this.y += Math.sin(this.angle) * this.radius;

    this.angle += .01;

    if (this.x > width - 10) {
      this.xspeed *= -1;
    }
    if (this.x < 10) {
      this.xspeed *= -1;
    }
    if (this.y > height - 10) {
      this.yspeed *= -1;
    }
    if (y < 10) {
      this.yspeed *= -1;
    }
  }
}

function setup() {
  createCanvas(900, 600);

  for (let i = 0; i < 300; i++) {
    s.push(new Particle((float)(Math.random() * 300) + 20, (float)(Math.random() * 300) + 20));
  }

}

function draw() {

  if (fade) {
    fill(0, random(5, 20));
  } else {
    fill(0);
  }
  noStroke();
  rect(0, 0, width, height);


  for (let i = 0; i < s.length; i++) {
    s[i].show();
    s[i].move();
  }
}

function mousePressed() {

  for (let i = 0; i < s.length; i++) {
    s[i] = new Particle(mouseX, mouseY);
  }

}

function keyPressed() {

  if (keyCode == 65) {
    if(fade){ fade = false}
    else{ fade = true}
  }
  if (keyCode == 83) {
    if(white){ white = false}
    else{ white = true}
  }
}