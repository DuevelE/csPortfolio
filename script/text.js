let x  = "Welcome to my portfolio";
let xarr = [];
let yarr = [];
let up = [];
go = false;

function setup() {
  createCanvas(720, 400);
  background(49, 116, 207);
  for (let i = 0; i < x.length; i++)
  {
    xarr[i] = 25 + i * 30
    yarr[i] = 200
    up[i] = i % 2 == 0;
    textSize(32);
    stroke(255)
    strokeWeight(4)
    textStyle(BOLD);
    text(x[i], xarr[i], yarr[i]);
    
  }

}

function draw() {
  
  if(go)
  {
    background(49, 116, 207);
    for (let i = 0; i < x.length; i++)
    {
      stroke(255)
      strokeWeight(4)
      textStyle(BOLD);
      text(x[i], xarr[i], yarr[i]);
      xarr[i] = xarr[i] + random(-3,3);
      if (up[i])
      { 
        yarr[i] = yarr[i] + random(0,2);
      }
      else
      { 
        yarr[i] = yarr[i] - random(0,2);
      }
    }
      
  }
  
  
}

function mouseClicked() {
  if (!go)
  {
    go = true
  }
  else
  {
    go = false
    setup()
  }
}





