const WIDTH = 10;

const Canvas = require("canvas");

const fs = require("fs");
//    , data = JSON.parse(fs.readFileSync('./map.json', 'utf8'));

const {
	token,
	call,
	width,
	height,
	tickSpeed
} = require("../config.js");

Object.size = function (obj) {
	var size = 0,
		key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};


exports.makeImage =  function (data, war, sx, sy, ex, ey, c, showList, showAlliances, mainCountry) {
	ex = parseInt(ex);
	ey = parseInt(ey);

	console.time("Time");
	var ySize = WIDTH * (ey - sy);
	if (showList) {
		//ySize += (10*Object.size(c));
	}
	canvas = new Canvas(WIDTH * (ex - sx), ySize);
	ctx = canvas.getContext("2d");

	var ac = [];
	var ec = [];
	var oc = [];

	if (showAlliances != null) {
		if (showAlliances) {
			for (k in c) {
				if (c[mainCountry].allies.includes(k) && c[k].allies.includes(mainCountry)) {
					ac[ac.length] = (k);
				} else if (!(c[mainCountry].allies.includes(k)) && !(c[k].allies.includes(mainCountry))) {
					ec[ec.length] = (k);
				} else {
					oc[oc.length] = (k);
				}
			}
		}
	}

	for (var x = sx; x < ex; x++) {
		for (var y = sy; y < ey; y++) {
			showAlliances;
			try {
				//console.log((x-sx)+","+(y-sy));
				let e = data[x][y]["elevation"];
				let colonised = data[x][y]["owner"] !== "none";

				border = false;
				currOwner = data[x][y].owner;
                //check for border
				for (let i = parseInt(x) - 1; i < parseInt(x) + 2; i++) {
					for (let j = parseInt(y) - 1; j < parseInt(y) + 2; j++) {
						try {
							if (colonised && data[i][j].owner != currOwner) {
								border = true;
							}
						} catch (err) {
							console.log(err.toString());
						}
					}
				}

				let color = "";
				let r = colonised ? (parseInt(data[x][y]["owner"].substring(0, 2)) % 210) + 40 : null,
					g = colonised ? (parseInt(data[x][y]["owner"].substring(3, 6)) % 210) + 40 : null,
					b = colonised ? (parseInt(data[x][y]["owner"].substring(7, 10)) % 210) + 40 : null
					// , ir = colonised ? ((r + 127) % 255) : null
					// , ig = colonised ? ((g + 127) % 255) : null
					// , ib = colonised ? ((b + 127) % 255) : null;
					,
					ir = colonised ? r - 40 : null,
					ig = colonised ? g - 40 : null,
					ib = colonised ? b - 40 : null;



				if (c[data[x][y]["owner"]] != undefined) {
					if (c[data[x][y]["owner"]].color == undefined) {

                        //give them a default color if they dont have one and they are a border...? im kinda confused
						color = border ? "rgba(" + ir + "," + ig + "," + ib + "," + 50 + ")" : colonised ? "rgba(" + r + "," + g + "," + b + "," + 50 + ")" : null;
                    } else {
                        //get their colors
						r = c[data[x][y]["owner"]].color.r;
						g = c[data[x][y]["owner"]].color.g;
						b = c[data[x][y]["owner"]].color.b;
						ir = r - 40;
						ig = g - 40;
						ib = b - 40;
						if (ir < 0)
							ir = 0;
						if (ig < 0)
							ig = 0;
						if (ib < 0)
                            ib = 0;
                        //set color darker if border
						color = border ? "rgba(" + ir + "," + ig + "," + ib + "," + 0.9 + ")" : colonised ? "rgba(" + r + "," + g + "," + b + "," + 0.60 + ")" : null;
					}
				}
                //again here for the just set color i would think... some things here are repeating. derpy was probably high.
				color = border ? "rgba(" + ir + "," + ig + "," + ib + "," + 0.9 + ")" : colonised ? "rgba(" + r + "," + g + "," + b + "," + 0.60 + ")" : null;

                //for country in countries
				for (k in c) {
                    if (x == c[k].capital.x && y == c[k].capital.y) {
                        //if the current cell is their capital, yellow it.
						color = "rgb(255,255,0)";
					}
				}
				var m = false;
                var w = false;
                //war variable, checking if cell is being warred
				if (war[x + "|" + y] != undefined) {
					//color = "rgb(255,0,0)";
                    //set war var to true
					w = true;
				}

				if (ex - x == (ex - sx) / 2 && ey - y == (ey - sy) / 2) {
					m = true;
					console.log("centrist");
				}
				//console.log((y-sy)+","+ (((ex-x)-(ex-sx))+(ex-sx))+" | "+(ex-sx))

				if (ac.includes(data[x][y]["owner"])) {
					color = "rgba(0,0,255,0.6)";
					if (border) {
						color = "rgba(0,0,255,0.9)";
					}

				}

				if (ec.includes(data[x][y]["owner"])) {
					color = "rgba(255,0,0,0.6)";
					if (border) {
						color = "rgba(255,0,0,0.9)";
					}

				}

				if (oc.includes(data[x][y]["owner"])) {
					color = "rgba(0,255,0,0.6)";
					if (border) {
						color = "rgba(0,255,0,0.9)";
					}

				}


				draw(e, y - sy, (((ex - x) - (ex - sx)) + (ex - sx)), colonised, color, border, m, w);
			} catch (err) {
				var part = Math.round(Math.random() * 120);
				var color = "rgb(" + part + "," + part + "," + part + ")";
				draw(0, y - sy, (((ex - x) - (ex - sx)) + (ex - sx)), false, color, false, false, false, true);


				//console.log(err);
			}
		}
	}
	//rotate270(canvas, ctx,(ey-sy)*WIDTH,(ex-sx)*WIDTH)

	/*
	fs.writeFile('./img.png', canvas.toBuffer(), (err) => { 
		if(err) console.log(err) 
		console.timeEnd('Time')
	})
	*/

	if (showAlliances != null) {
		if (showAlliances) {
			for (k in c) {
				for (j in c[k].allies) {
					try {
						if (mainCountry != null) {
							if (k == mainCountry || j == mainCountry) {
								/*
								ctx.lineWidth = 5;
								//ctx.strokeStyle = "rgb("+c[k].color.r+","+c[k].color.g+","+c[k].color.b+")";
								ctx.beginPath();
								ctx.moveTo(((c[k].capital.y * WIDTH) + ((ex * WIDTH) - (sx * WIDTH))) % ((ex * WIDTH) - (sx * WIDTH)+2)+(WIDTH*2),
								(height * WIDTH) - ((((c[k].capital.x * WIDTH) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH))) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH))+2)+WIDTH;
								ctx.lineTo(((c[c[k].allies[j]].capital.y * WIDTH) + ((ex * WIDTH) - (sx * WIDTH))) % ((ex * WIDTH) - (sx * WIDTH)+2)+(WIDTH*2),
								(height * WIDTH) - ((((c[c[k].allies[j]].capital.x * WIDTH) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH))) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH))+2)+WIDTH;
								ctx.stroke();
								*/
							}
						} else {
							ctx.lineWidth = 5;
							//ctx.strokeStyle = "rgb("+c[k].color.r+","+c[k].color.g+","+c[k].color.b+")";
							ctx.beginPath();
							ctx.moveTo(((c[k].capital.y * WIDTH) + ((ex * WIDTH) - (sx * WIDTH))) % ((ex * WIDTH) - (sx * WIDTH) + 2) + (WIDTH * 2),
								(height * WIDTH) - ((((c[k].capital.x * WIDTH) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH))) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH)) + 2) + WIDTH;
							ctx.lineTo(((c[c[k].allies[j]].capital.y * WIDTH) + ((ex * WIDTH) - (sx * WIDTH))) % ((ex * WIDTH) - (sx * WIDTH) + 2) + (WIDTH * 2),
								(height * WIDTH) - ((((c[c[k].allies[j]].capital.x * WIDTH) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH))) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH)) + 2) + WIDTH;
							ctx.stroke();
						}
					} catch (err) {
						console.log(err.toString());
					}
				}
			}
		}
	}

	if (showList != null) {
		if (showList) {
			spot = 0;
			for (k in c) {
				let r = parseInt((k.substring(0, 2)) % 210) + 40,
					g = parseInt((k.substring(3, 6)) % 210) + 40,
					b = parseInt((k.substring(7, 10)) % 210) + 40;
				ctx.font = "20px Arial";
				//ctx.fillStyle = "rgb("+r+","+g+","+b+")";
				ctx.fillStyle = "rgb(" + 255 + "," + 255 + "," + 255 + ")";
				//ctx.fillText(c[k].name,(c[k].capital.y*WIDTH) - sy,(((ex-(c[k].capital.y*WIDTH)) - (ex-sx)) + (ex - sx)));
				ctx.fillText(c[k].name,
					((c[k].capital.y * WIDTH) + ((ex * WIDTH) - (sx * WIDTH))) % ((ex * WIDTH) - (sx * WIDTH)),
					(height * WIDTH) - ((((c[k].capital.x * WIDTH) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH))) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH)));

				ctx.fillText(c[k].name,
					((c[k].capital.y * WIDTH) + ((ex * WIDTH) - (sx * WIDTH))) % ((ex * WIDTH) - (sx * WIDTH) + 2),
					(height * WIDTH) - ((((c[k].capital.x * WIDTH) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH))) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH)) + 2);



				ctx.fillStyle = "rgb(" + 0 + "," + 0 + "," + 0 + ")";

				ctx.fillText(c[k].name,
					((c[k].capital.y * WIDTH) + ((ex * WIDTH) - (sx * WIDTH))) % ((ex * WIDTH) - (sx * WIDTH)) + 1,
					(height * WIDTH) - ((((c[k].capital.x * WIDTH) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH))) + ((ey * WIDTH) - (sy * WIDTH))) % ((ey * WIDTH) - (sy * WIDTH)) + 1);

				spot++;

				y - sy, (((ex - x) - (ex - sx)) + (ex - sx));
			}
		}
	}
	return canvas.toBuffer();
};



function rgbToHex(r, g, b) {
	function componentToHex(c) {
		return c.toString(16).length == 1 ? "0" + c.toString(16) : c.toString(16);
	}

	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function draw(e, x, y, c, color, b, m, w, forced) {
    y += -1;
	ctx.fillStyle =
		//color // Border
		e < 7 && e > 0 ?
			rgbToHex(0, (parseInt((e / 7) * 127) + 127), 0) // Grass
			:
			e > 7 && e < 10 ?
				rgbToHex((parseInt((e / 10) * 127) + 127), (parseInt((e / 10) * 127) + 127), (parseInt((e / 10) * 127) + 127)) // Rocky / hill
				:
				e > 10 ?
					"#ffffff" // Snow
					:
					rgbToHex(0, 0, parseInt(255 - (e * -20))); // Water

	ctx.fillRect((parseInt(x)) * WIDTH, (parseInt(y)) * WIDTH, WIDTH, WIDTH);

	if (forced != null) {
		if (forced) {
			ctx.fillStyle = color;
		}
	}

	if (color == "rgb(255,255,0)") {
		ctx.fillStyle = color;
	}

	if (m) {
		ctx.fillStyle = "#000000";
	}


	if (c || b) {
		ctx.fillStyle = color;
		ctx.fillRect(((parseInt(x)) * WIDTH), ((parseInt(y)) * WIDTH), WIDTH, WIDTH);
	}


	if (w) {
		ctx.lineWidth = 2;
		ctx.strokeStyle = "rgb(255,0,0)";
		ctx.beginPath();
		ctx.moveTo((x) * WIDTH, (y) * WIDTH);
		ctx.lineTo((x + 1) * WIDTH, (y + 1) * WIDTH);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo((x + 1) * WIDTH, (y) * WIDTH);
		ctx.lineTo((x) * WIDTH, (y + 1) * WIDTH);
		ctx.stroke();
		//ctx.fillRect(((parseInt(x) + 1) * WIDTH)+2, ((parseInt(y) + 1) * WIDTH)+2, WIDTH-4, WIDTH-4)
	}
}

function rotate270(canvas, ctx, height, width) {

	let img = new Canvas.Image;
	img.src = canvas.toBuffer();
	ctx.clearRect(0, 0, 1000, 1000);

	ctx.rotate(270 * Math.PI / 180);


	//img.onload = function(){
	ctx.drawImage(img, 0, 0, width, height);

	//}
}

//makeImage();