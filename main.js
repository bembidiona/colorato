var imgOriginal;
var imgExist = false;
var img;
var uiSizeW = 195;
var fuckingFirefoxFile;
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

var colorUI = "#12120f";
var colorBG = "#efefef";

var current_colormatrix_already_applied = true

var sl_blend;
var sl_brightness;
var sl_contrast;
var sl_saturation;
var sl_hue;
var sl_r;
var sl_g;
var sl_b;

var sl_split;

var menuTxt = [
"COLORATO:",
"A simple but handy ",
"color matrix editor."
]

var copyButton;
function preload() {
	img = loadImage("assets/drophere.png");
	imgExist = true;
}

function setup() {
  	imgOriginal = img.get();

	//drop
	var c = createCanvas(windowWidth, windowHeight);
	c.drop(gotFileHack); 

	textFont("Consolas");
	
	sl_brightness = createSlider(-255, 255);  
	sl_brightness.value(0);
	// NOTE: input() triggers every time the slider is moved, changed() only do so after the movement has finished.
	sl_brightness.input(tweakSlider);
	sl_brightness.class("slider");

	sl_contrast = createSlider(0, 500);
	sl_contrast.value(100);
	sl_contrast.input(tweakSlider);
	sl_contrast.class("slider");

	sl_saturation = createSlider(0, 200);
	sl_saturation.value(100);
	sl_saturation.input(tweakSlider);
	sl_saturation.class("slider");

	sl_hue = createSlider(0, 360);
	sl_hue.value(0);
	sl_hue.input(tweakSlider);
	sl_hue.class("slider");

	sl_r = createSlider(-255, 255);
	sl_r.value(0);
	sl_r.input(tweakSlider);
	sl_r.class("slider");

	sl_g = createSlider(-255, 255);
	sl_g.value(0);
	sl_g.input(tweakSlider);
	sl_g.class("slider");

	sl_b = createSlider(-255, 255);
	sl_b.value(0);
	sl_b.input(tweakSlider);
	sl_b.class("slider");

	sl_blend = createSlider(0, 100);
	sl_blend.value(100);
	sl_blend.input(tweakSlider);
	sl_blend.class("slider");

	copyButton = createButton("COPY");
	copyButton.mousePressed(copyMatrix);
	copyButton.class("btn");

	new ClipboardJS(copyButton.elt);

	sl_split = createSlider(0, 100);
	sl_split.value(100);
	sl_split.class("slider");

	link = createA("http://www.jeremiasbabini.me","bini", "_blank");
}

function draw() {  

	background(colorBG);

	noStroke();
	fill(colorUI);
	rect(0, 0, uiSizeW, windowHeight);	

	fill(200);
	noStroke();
	textSize(12);
	textAlign(LEFT);	
	textLeading(11);
	var breaks = 0;
	var ui_x = 20;
	var ui_y = 0;
	var spacer = 20;
	var slider_margen = 40;
	var sliderText_y = -6;	

	for(var i = 0; i < menuTxt.length; i++){
		var txt = menuTxt[i];		
		ui_y = 20*(i+1) + 11*breaks + 10;
		text(txt, ui_x, ui_y);	
	}
	ui_y += 25;
	text(" - - - - - - - - - - - ", ui_x, ui_y);	
	ui_y += 30;	

	sl_brightness.position(ui_x, ui_y);
	text('brightness', ui_x, ui_y + sliderText_y); 
	ui_y += slider_margen;

	sl_contrast.position(ui_x, ui_y);
	text('contrast', ui_x, ui_y + sliderText_y); 
	ui_y += slider_margen;

	ui_y += spacer;

	sl_saturation.position(ui_x, ui_y);
	text('saturation', ui_x, ui_y + sliderText_y); 
	ui_y += slider_margen;	

	sl_hue.position(ui_x, ui_y);
	text('hue', ui_x, ui_y + sliderText_y); 
	ui_y += slider_margen;
	
	ui_y += spacer;	

	sl_r.position(ui_x, ui_y);
	text('R', ui_x, ui_y + sliderText_y); 
	ui_y += slider_margen;

	sl_g.position(ui_x, ui_y);
	text('G', ui_x, ui_y + sliderText_y); 
	ui_y += slider_margen;

	sl_b.position(ui_x, ui_y);
	text('B', ui_x, ui_y + sliderText_y); 
	ui_y += slider_margen;
	
	ui_y += spacer;

	sl_blend.position(ui_x, ui_y);	
	text('blend', ui_x, ui_y + sliderText_y);
	ui_y += slider_margen;
	
	text(" - - - - - - - - - - - ", ui_x, ui_y);	
	ui_y += 15;	

	copyButton.position(ui_x, ui_y);

	fill("#12120f");
	noStroke();
	textSize(16);
	textAlign(RIGHT);
	text('by', windowWidth - 45, windowHeight - 10);
	link.position(windowWidth-45, windowHeight-25);
	

	{
		x = ceil(windowWidth/2 - img.width/2 + uiSizeW/2);
		y = ceil(windowHeight/2 - img.height/2 - 25);

		noStroke();
		fill(0,50);		
		rect(x+6, y+6, img.width+6, img.height+6);
		strokeWeight(16);
		stroke(100);
		rect(x, y, img.width, img.height);
		strokeWeight(12);
		stroke("255");
		rect(x, y, img.width, img.height);

		var split = img.width - ceil(img.width * (1 - sl_split.value()/100));

		if (!current_colormatrix_already_applied)
		{
			img = imgOriginal.get();
			applyColorMatrix(img);
			current_colormatrix_already_applied = true
		}
		

		image(imgOriginal, x, y, img.width, img.height);
		if(split != 0){
			image(img.get(0,0,split,img.height), x, y, split, img.height);
		}
		stroke(255);
		strokeWeight(1);
		line(x + split, y , x + split, y + img.height);	

		var extraW = 15;
		sl_split.attribute("style", "width:"+ (img.width + extraW) +"px !important; height: 20px;");
		sl_split.position(x - extraW/2, y + img.height + 15);		
	}	
	
}

function gotFile(file) {  	

	if (file.type === 'image') {    
		

		var imgDropped = createImg(file.data);		
		imgDropped.hide();

		imgDroppedW = imgDropped.width;
		imgDroppedH = imgDropped.height;				

		var maxW = windowWidth - uiSizeW - 40;
		var maxH =  windowHeight - 30;

		noStroke();
		fill(255);

		if(imgDroppedW > maxW || imgDroppedH > maxH){
			if(imgDroppedW > imgDroppedH){
				if(imgDroppedW > maxW){			
					rect(0,0,maxW, (imgDroppedH*maxW)/imgDroppedW);
					image(imgDropped, 0, 0, maxW, (imgDroppedH*maxW)/imgDroppedW);
					img = get(0,0,maxW, (imgDroppedH*maxW)/imgDroppedW);

					if(img.height > maxH){
						imgDropped = img;
						imgDroppedW = imgDropped.width;
						imgDroppedH = imgDropped.height;

						rect(0,0,(imgDroppedW*maxH)/imgDroppedH, maxH);
						image(imgDropped, 0, 0, (imgDroppedW*maxH)/imgDroppedH, maxH);
						img = get(0,0,(imgDroppedW*maxH)/imgDroppedH, maxH);
						
					} 
				}
			}
			else {
				rect(0,0,(imgDroppedW*maxH)/imgDroppedH, maxH);
				image(imgDropped, 0, 0, (imgDroppedW*maxH)/imgDroppedH, maxH);
				img = get(0,0,(imgDroppedW*maxH)/imgDroppedH, maxH);
				
			}
		}		
		else{
			rect(0,0,imgDroppedW,imgDroppedH);
			image(imgDropped, 0, 0, imgDroppedW, imgDroppedH);			
			img = get(0,0,imgDroppedW,imgDroppedH);
			

		} 		

		imgOriginal = img.get(); // simply imgOriginal = img don't work
		imgExist = true;
		stepNum = 0;		

	} else {
		println('Not an image file!');
	}	
}
function gotFileHack(file){
	fuckingFirefoxFile = file;

	// TODO: this should not be needed...
	// hack for show droped image. If not, you have to drag it two times to make it show
	if(true){
		setTimeout(function() {gotFile(fuckingFirefoxFile) ;}, 100);
		if(!imgExist) setTimeout(function() {gotFile(fuckingFirefoxFile) ;}, 200);
	}

	gotFile(file);	 
}

function applyColorMatrix(_img){
	var lr = 0.3086;
	var lg = 0.6094;
	var lb = 0.0820;

	var identityMat = [
		1, 0, 0, 0, 0,
		0, 1, 0, 0, 0,
		0, 0, 1, 0, 0,
		0, 0, 0, 1, 0,
		0, 0, 0, 0, 1,
	];
	var b = sl_brightness.value();
	var brightMat= [
		1, 0, 0, 0, b,
		0, 1, 0, 0, b,
		0, 0, 1, 0, b,
		0, 0, 0, 1, 0,
		0, 0, 0, 0, 1
	];
	var c = sl_contrast.value()/100;
	var cShift = (1.0 - c ) / 2.0;
	var contrastMat= [
		c, 0, 0, 0, cShift,
		0, c, 0, 0, cShift,
		0, 0, c, 0, cShift,
		0, 0, 0, 1, 0,
		0, 0, 0, 0, 1
	];		
	var s = sl_saturation.value()/100;	
	var sR = (1 - s) * lr;
	var sG = (1 - s) * lg;
	var sB = (1 - s) * lb;
	var saturationMat= [
		sR+s, sG, sB, 0, 0,
		sR, sG+s, sB, 0, 0,
		sR, sG, sB+s, 0, 0,
		0, 0, 0, 1, 0,
		0, 0, 0, 0, 1
	];	
	var hue = sl_hue.value();
	hue *= Math.PI/180;			
	var c = Math.cos( hue );
    var s = Math.sin( hue );
    var hueMat = [
	    // (lr + (c * (1 - lr))) + (s * (-lr)),    (lg + (c * (-lg))) + (s * (-lg)),     (lb + (c * (-lb))) + (s * (1 - lb)), 0, 0,
	    // (lr + (c * (-lr))) + (s * 0.143),       (lg + (c * (1 - lg))) + (s * 0.14),   (lb + (c * (-lb))) + (s * -0.283), 0, 0,
	    // (lr + (c * (-lr))) + (s * (-(1 - lr))), (lg + (c * (-lg))) + (s * lg),        (lb + (c * (1 - lb))) + (s * lb), 0, 0,
	    (lr + (c * (1 - lr))) + (s * (-lr)),    (lg + (c * (-lg))) + (s * (-lg)),     (lb + (c * (-lb))) + (s * (1 - lb)), 0, 0,
	    (lr + (c * (-lr))) + (s * 0.143),       (lg + (c * (1 - lg))) + (s * 0.14),   (lb + (c * (-lb))) + (s * -0.283), 0, 0,
	    (lr + (c * (-lr))) + (s * (-(1 - lr))), (lg + (c * (-lg))) + (s * lg),        (lb + (c * (1 - lb))) + (s * lb), 0, 0,
	    0, 0, 0, 1, 0, 
	    0, 0, 0, 0, 1
    ];
	var rShift = sl_r.value();
	var gShift = sl_g.value();
	var bShift = sl_b.value();
	var shiftMat= [
		1, 0, 0, 0, rShift,
		0, 1, 0, 0, gShift,
		0, 0, 1, 0, bShift,
		0, 0, 0, 1, 0,
		0, 0, 0, 0, 1
	];

	//merge all matrices
	var matrixArray = [brightMat, contrastMat, saturationMat, hueMat, shiftMat];
	var composedMat = identityMat;
	for (var m=0; m < matrixArray.length; m++){ 
		composedMat = mergeMats(composedMat, matrixArray[m]);
	}
	//blend with original
	var blend = sl_blend.value()/100;
	for (var i=0; i < 25; i++){
		composedMat[i] = blend * composedMat[i] + (1 - blend) * identityMat[i];
	}
	//reduce to a max of 3 decimals. More is overkill for flash?
	for (var i=0; i < 25; i++){
		composedMat[i] = Math.round(composedMat[i] * 1000) / 1000;
	}

	copyButton.attribute("data-clipboard-text", "["+composedMat+"]");

	//apply final matrix to pixels
	_img.loadPixels();
	for(var i = 0; i < _img.pixels.length; i += 4){
		var r = _img.pixels[i];
		var g = _img.pixels[i+1];
		var b = _img.pixels[i+2];

		// papers read it vertically
		// for(var c = 0; c < 3; c++){
		// 	_img.pixels[i+c] =	r * composedMat[0+c] +
		// 				  		g * composedMat[5+c] +
		// 					    b * composedMat[10+c] +
		// 					    	composedMat[3+c*5] +
		// 					    	composedMat[4+c*5] ;
		// }

		// pixi and flash read it horizontally
		for(var c = 0; c < 3; c++){
			_img.pixels[i+c] =	r * composedMat[0+c*5] +
						  		g * composedMat[1+c*5] +
							    b * composedMat[2+c*5] +
							    	composedMat[3+c*5] +
							    	composedMat[4+c*5] ;
		}	
	}	
	_img.updatePixels();
	return _img;
}

function mergeMats(M1, M2){
	var newMat = [];

	for (var y=0; y < 5; y++){
		for (var x=0; x < 5; x++){
			if (x > 2 || y > 2){
				newMat[x + y * 5] = M1[x + y*5] + M2[x + y*5];
			}
			else{
				newMat[x + y * 5] = M1[0 + y*5] * M2[x + 0 * 5] + 
									M1[1 + y*5] * M2[x + 1 * 5] +
									M1[2 + y*5] * M2[x + 2 * 5] +
									M1[3 + y*5] * M2[x + 3 * 5] +
									M1[4 + y*5] * M2[x + 4 * 5];							
			}						
		}; 
	};			

	//these just set to 1 
	newMat[18] = 1
	newMat[24] = 1

	return newMat;
};

function copyMatrix(){
	if (!copyButton.elt.classList.contains('btnClicked')) { //check if already has the class!
		copyButton.addClass('btnClicked');
	}
	copyButton.html("COPIED");	
}
function tweakSlider(){
	copyButton.removeClass('btnClicked');
	copyButton.html("COPY");

	current_colormatrix_already_applied = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  buttonLeftXOrg = windowWidth/2 - 159 + uiSizeW/2;
  buttonRightXOrg = windowWidth/2 + 120 + uiSizeW/2;
}


