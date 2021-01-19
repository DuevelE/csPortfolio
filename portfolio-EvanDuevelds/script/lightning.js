let startX = 0;
let startY = 300;
let endX = 0;
let endY = 300;
let colr = false;
let mes = "Click for color"

class point {

  constructor(sx, sy, ex, ey) {
    this.sx = sx;
    this.sy = sy;
    this.ex = ex;
    this.ey = ey;
  }
  
}

function setup() {
    createCanvas(1000, 600);
    background(0);
    strokeWeight(1);
    stroke(255, 255, 255);
    textSize(32);
    text(mes, 30, 80);
  
}

function draw(){
    let temp = [];
    while (endX < 1000){

        endX = startX + random(0, 9);
        endY = startY + random(-11, 11);

        if (colr){
          stroke(random(0, 255), random(0, 255), random(0, 255));
          line(startX, startY, endX, endY);         
        }
        else{
            var p = new point(startX, startY, endX, endY);
            temp.push(p);
        }
        startX = endX;
        startY = endY;
    }
    let colrs = endY;
    colrs = int(abs(colrs - 300) * .85);
    stroke(colrs);
    for(let i = 0; i < temp.length; i++)
    {
        line(temp[i].sx, temp[i].sy, temp[i].ex, temp[i].ey);
    }

    startX = 0;
    startY = 300;
    endX = 0;
    endY = 300;
}

function mouseClicked() {
  
  if (colr) {
    colr = false;
  }
  else{
    colr = true;
}
}