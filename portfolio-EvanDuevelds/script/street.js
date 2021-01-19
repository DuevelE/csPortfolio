let xarr = [];
let yarr = [];
let speed = 10;
let still = false;

function setup() {
  createCanvas(720, 400);
  for (let x = 0; x < 100; x++)
  {
    xarr[x] = random(0,720);
    yarr[x] = random(0,400);
  }

}

function draw() {
  
  background(49, 116, 207);
  for (let i = 0; i < 100; i++)
  {
    // Circle
    stroke(50);
    fill(255);
    ellipse(xarr[i], yarr[i], 24, 24);

    // Jiggling x
    if (!still)
    {
      xarr[i] = xarr[i] + random(-1, 1);
    }
    
    // Random up
    yarr[i] = yarr[i] - random(0,speed);

    // Reset 
    if (yarr[i] < 0) {
      yarr[i] = height;
  
    }
  }
}

function mouseClicked() {
  if (speed != 1)
  {
    speed = 1;
  }
  else {
    speed = 10;
  }
  
  if (still)
  {
    still = false;
  }
  else {
    still = true;
  }
}








