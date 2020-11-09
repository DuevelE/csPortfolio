let startX = 0;
let startY = 300;
let endX = 0;
let endY = 300;
let colr = false;
let mes = "Click for color"

function setup() {
    createCanvas(1000, 600);
    background(0);
    strokeWeight(1);
    stroke(255, 255, 255);
    textSize(32);
    text(mes, 30, 80);
  
}

function draw(){

    while (endX < 1000){

        endX = startX + random(0, 9);
        endY = startY + random(-11, 11);

        if (colr){
          stroke(random(0, 255), random(0, 255), random(0, 255));
          line(startX, startY, endX, endY);         
        }
        else{
            let colr = endY;
            colr = int(abs(colr - 300) * .85);
            stroke(colr);
            line(startX, startY, endX, endY);
        }
        startX = endX;
        startY = endY;
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