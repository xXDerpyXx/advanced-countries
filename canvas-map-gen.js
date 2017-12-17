const WIDTH = 10;

const Canvas = require('canvas');

const fs = require('fs');
//    , data = JSON.parse(fs.readFileSync('./map.json', 'utf8'));

console.time('Time')

exports.makeImage = function(data,war,sx,sy,ex,ey){
	 canvas = new Canvas(WIDTH * (ex-sx), WIDTH * (sy-ey));
     ctx = canvas.getContext('2d');
	
	for(var x = sx; x < ex; x++){
		for(var y = sy; y < sy; y++){
			try{
				let e = data[x][y]['elevation']
				let colonised = data[x][y]['owner'] !== 'none'

				border = false;
				currOwner = data[x][y].owner;

				for(let i = parseInt(x) - 1; i < parseInt(x) + 2; i++) {
					for(let j = parseInt(y) - 1; j < parseInt(y) + 2; j++) {
						try {
							if(colonised && data[i][j].owner != currOwner) {
								border = true;
							}    
						} catch(err) {

						}
					}
				}

				let r = colonised ? (parseInt(data[x][y]['owner'].substring(0, 2)) % 210) + 40 : null
				  , g = colonised ? (parseInt(data[x][y]['owner'].substring(3, 6)) % 210) + 40 : null
				  , b = colonised ? (parseInt(data[x][y]['owner'].substring(7, 10)) % 210) + 40 : null
				  // , ir = colonised ? ((r + 127) % 255) : null
				  // , ig = colonised ? ((g + 127) % 255) : null
				  // , ib = colonised ? ((b + 127) % 255) : null;
				  , ir = colonised ? r - 40 : null
				  , ig = colonised ? g - 40 : null
				  , ib = colonised ? b - 40 : null


				let color = border ? rgbToHex(ir, ig, ib) : colonised ? rgbToHex(r, g, b) : null;
				
				 if(war[x+"|"+y] != undefined){
					color = "rgb(255,0,0)";
				 }
				
				draw(e, x, y, colonised, color, border)
			}catch(err){
				
			}
		};
	};
	rotate270(canvas, ctx)

	fs.writeFile('./img.png', canvas.toBuffer(), (err) => { 
		if(err) console.log(err) 
		console.timeEnd('Time')
	});
}



function rgbToHex(r, g, b) {
    function componentToHex(c) {
        return c.toString(16).length == 1 ? "0" + c.toString(16) : c.toString(16);
    }

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function draw(e, x, y, c, color, b) {
	
    ctx.fillStyle = b ?
        color // Border
        : c ?
        color : // Colonised
        e < 7 && e > 0 ? 
        rgbToHex(0, (parseInt((e/7)*127)+127), 0) // Grass
        : e > 7 && e < 10 ? 
        rgbToHex((parseInt((e/10)*127)+127), (parseInt((e/10)*127)+127), (parseInt((e/10)*127)+127)) // Rocky / hill
        : e > 10 ? 
        '#ffffff' // Snow
        : rgbToHex(0, 0, parseInt(255 - (e * -20))); // Water
    if(color == "rgb(255,0,0)"){
		ctx.fillStyle = color;
	}
    ctx.fillRect((parseInt(x) + 1) * WIDTH, (parseInt(y) + 1) * WIDTH, WIDTH, WIDTH)
}

function rotate270(canvas, ctx) {
    let img = new Canvas.Image
    ctx.clearRect(0, 0, 1000, 1000);
    
    ctx.rotate(270 * Math.PI / 180);
    img.src = canvas.toBuffer();
    
   img.onload = function(){
		ctx.drawImage(img, 0, 0,canvas.width,canvas.height)
	}
}

//makeImage();
