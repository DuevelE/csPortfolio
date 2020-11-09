let DieArray = {};
let begin = true;
let highScore = 0;
class die { 
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.v = int(random(0, 2));
  }  
}

function setup() {
  createCanvas(650, 575);
  mouseClicked(); 
  textStyle(BOLD);
}

function draw() {
  background(49, 116, 207);
  if(begin){
    let count = 0;
    for (let i = 0; i <= 53; i++)
    {
       if (DieArray[i].v == 1)
       {
         count++;
         fill(0, 255, 0);
         square(DieArray[i].x, DieArray[i].y, 50);
         textSize(15);
         fill(255, 0, 0);
         textStyle(BOLD);
         text(String(count), DieArray[i].x + 17, DieArray[i].y + 30)
       }
       else 
       {
         fill(255, 255, 255);
         square(DieArray[i].x, DieArray[i].y, 50);
       }
    } 
    if (count > highScore)
    {
        highScore = count;
    }
    textSize(30);
    fill(255,255,255);
    text('Your Score: ' +String(count)+ '  High Score: '+highScore, 100, 500);
  }
  else {
    for (let i = 0; i <= 53; i++){
       if (DieArray[i].v == 1)
       {         
         fill(0, 255, 0);
         square(DieArray[i].x, DieArray[i].y, 50);
       }
       else 
       {
         fill(255, 255, 255);
         square(DieArray[i].x, DieArray[i].y, 50);
       }
    }
    textSize(30);
    fill(255,255,255);
    text('Click to roll', 250, 500);
    waiting();
  }
}

function mouseClicked(){
  
  for (let i = 0; i <= 26; i++)
  { 
    let temp = i;
    temp = int(temp / 9) * 25;
    let d = new die(int(i/3) * 55 + 50 + temp, int(i%3) * 55 + 50);
    DieArray[i] = d;
  }
  for (let i = 27; i <= 53; i++)
  { 
    let temp = i - 27;
    let Atemp = int(temp / 9) * 25;
    let d = new die(int(temp/3) * 55 + 55 + Atemp, int(temp%3) * 55 + 250);
    DieArray[i] = d;
  }
  if (begin){
    begin = false;
}
  else{
    begin = true;
  }
}

function waiting(){
  for (let i = 0; i <= 26; i++)
  { 
    let temp = i;
    temp = int(temp / 9) * 25;
    let d = new die(int(i/3) * 55 + 50 + temp, int(i%3) * 55 + 50);
    DieArray[i] = d;
  }
  for (let i = 27; i <= 53; i++)
  { 
    let temp = i - 27;
    let Atemp = int(temp / 9) * 25;
    let d = new die(int(temp/3) * 55 + 55 + Atemp, int(temp%3) * 55 + 250);
    DieArray[i] = d;
  }
}
