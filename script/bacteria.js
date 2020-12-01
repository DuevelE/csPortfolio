var dots = [];
let start = false;
class bacteria {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = random(0, 255);
    this.g = random(0, 255);
    this.b = random(0, 255);
  }
  
  display() {
    fill(this.r, this.g, this.b)
    ellipse(this.x, this.y, 15);
  }
  
  touching(b){
    if(abs(this.x - mouseX) >= 50 || abs(this.y - mouseY) >= 50)
    {
      if(abs(this.x - b.x) <= 15 && abs(this.y - b.y) <= 15)
      {
        this.x = this.x + (this.x - b.x);
        this.y = this.y + (this.y - b.y);
      }
    }
    
  }
  
  move() {
    let rx = int(random(1, 2));
    let ry = int(random(1, 2));
    //Top Left
    if(this.x <= mouseX && this.y >= mouseY){
      this.x = this.x + rx;
      this.y = this.y - ry;      
    }
      
    //Top Right
    else if(this.x >= mouseX && this.y >= mouseY){
      this.x = this.x - rx;
      this.y = this.y - ry;            
    }
      
    //Bottom Left
    else if(this.x <= mouseX && this.y <= mouseY){
      this.x = this.x + rx;
      this.y = this.y + ry;          
    }
      
    //Bottom Right
    else if(this.x >= mouseX && this.y <= mouseY){
      this.x = this.x - rx;
      this.y = this.y + ry;        
    } 
    else{
  
    }
  } 
}

function setup() {
  createCanvas(600, 600);
  for (let i = 0; i < 6; i++)
  {
    var b = new bacteria(((i + 1) * 100) - 50, 0);
    dots[i] = b;
  }
  for (let i = 6; i < 12; i++)
  {
    var b = new bacteria(((i - 5) * 100) - 50, 600);
    dots[i] = b;
  }
  for (let i = 12; i < 18; i++)
  {
    var b = new bacteria(0, ((i - 11) * 100) - 50);
    dots[i] = b;
  }
  for (let i = 18; i < 24; i++)
  {
    var b = new bacteria(600, ((i - 17) * 100) - 50);
    dots[i] = b;
  }
}

function draw() {
  background(49, 116, 207);
  
  if(start){    
    for (let i = 0; i < dots.length; i++)
    {
      dots[i].move();
      for(let j = i + 1; j < dots.length; j++)
      {

        dots[i].touching(dots[j]);

      }
      dots[i].display();
    }
  }
  else{
    textStyle(BOLD);
    textSize(32);
    text("Click to Start", 200, 300)
  }
}

function mouseClicked() {
  if(start){
    setup();
  }
  else{
    start = true;
  }
}