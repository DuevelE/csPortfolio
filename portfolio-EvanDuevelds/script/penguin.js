var clicked = false

function setup(){
	createCanvas(750, 600)
	background(30, 211, 255)
	textSize(28)
    fill(0,0,0)
    textFont('Georgia')
	text("Don't Click The Penguin", 10, 30)
    text("Clear", 660, 580)
  
	//Penguin
	//feet
	fill(255, 255, 255)
	triangle(260, 575, 300, 450, 340, 575)
	triangle(260 + 100, 575, 300 + 100, 450, 340 + 100, 575)
	//body
	fill(0, 0, 0)
	ellipse(350, 350, 200 * 1.25, 300 * 1.25)
	fill(255, 255, 255)
	ellipse(350, 350, 200, 300)
	//head
	fill(0, 0, 0)
	ellipse(350, 175, 175 * 1.25, 175 * 1.25)
	fill(255, 255, 255)
	ellipse(350, 175, 175, 175)
	//eyes
	fill(0, 0, 0)
	ellipse(315, 150, 50, 50)
	ellipse(385, 150, 50, 50)
	//nose
	fill(255, 135, 30)
	triangle(325, 190, 350, 225, 375, 190)
	//arms
	fill(0, 0, 0)
	ellipse(305, 360, 75, 150)
	ellipse(395, 360, 75, 150)
  
  
    //Menu
    
    //Red
    fill(255,0,0)
    square(700, 150, 40)
    
    //Green
    fill(34, 139, 34)
    square(700, 200, 40)
  
    //Blue
    fill(0,0,255)
    square(700, 250, 40)
  
    //Heavy
    fill(255,255,255)
    ellipse(715, 350, 40, 40)
        
    //Medium
    fill(255,255,255)
    ellipse(715, 400, 40, 40)
    
  
    //Light
    fill(255,255,255)
    ellipse(715, 450, 40, 40)
    
  
  
}

function mouseClicked(){
	
	if((mouseX > 225 && mouseX < 475) && (mouseY > 65 && mouseY < 575))
	{
			strokeWeight(1);
			stroke(0, 0, 0)
			fill(250, 0, 0)
			rect(290, 115, 50, 15)
			rect(360, 115, 50, 15)
            fill(250, 255, 255)
			fill(30, 211, 255)
			fill(255,0,0)
	}
  
    //Clicked Red Box
    else if((mouseX > 700 && mouseX < 740) && (mouseY > 150 && mouseY < 190))
    {
      stroke(255, 0, 0)
    }
  
    //Clicked Green Box
    else if((mouseX > 700 && mouseX < 740) && (mouseY > 200 && mouseY < 240))
    {
      stroke(34, 139, 34)
    }
  
    //Clicked Blue Box
    else if((mouseX > 700 && mouseX < 740) && (mouseY > 250 && mouseY < 290))
    {
      stroke(0, 0, 255)
    }
  
    //Clicked C1
    else if((mouseX > 700 && mouseX < 735) && (mouseY > 330 && mouseY < 370))
    {
      strokeWeight(8)
    }
  
    //Clicked C2
    else if((mouseX > 700 && mouseX < 735) && (mouseY > 380 && mouseY < 420))
    {
      strokeWeight(4)
    }
  
    //Clicked C3
    else if((mouseX > 700 && mouseX < 735) && (mouseY > 430 && mouseY < 470))
    {
      strokeWeight(1)
    }
    
    //Clicked Clear
    else if((mouseX > 660 && mouseX < 740) && (mouseY > 560 && mouseY < 595))
    {
      setup()
    }
  
    else
    {
      if(clicked)
        {
          clicked = false
        }
      else
        {
          clicked = true
        }
    }
}

function draw() {
  
  if(clicked == true)
  {
    
    if((mouseX > 225 && mouseX < 475) && (mouseY > 65 && mouseY < 575)){}
    
    else{line(pmouseX, pmouseY, mouseX, mouseY)}
    
  }
  
}




