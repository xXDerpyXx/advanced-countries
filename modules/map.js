const { token, call, width, height, tickSpeed } = require("../config.js");
const cell = require("../struct/Cell.js");
var SimplexNoise = require("simplex-noise");
const simplex = new SimplexNoise();

exports.generateMap = () => {
	let map = {};

	for(var x = 0; x < width; x++) {
		map[x] = {};

		for(var y = 0; y < height; y++) {
			map[x][y] = new cell(x, y);
		}
	} 
	
	for(var k = 0; k < 10; k++) {
		for(var x = 0; x < width; x++) {
			for(var y = 0; y < height; y++) {
				var total = 0;
				var count = 0;

				for(var i = x - 1; i < x + 2; i++){
					for(var j = y - 1; j < y + 2; j++){
						try {
							total += map[i][j].elevation;
							count++;
							//console.log(count);
						} catch(err) {
							//console.log(err);
						}
					}
				}
				if(count > 0) {
					map[x][y].elevation = (total / count) + (((Math.round(Math.random() * 10)) - 5) / 5);
					if(map[x][y].elevation > 7) {
						map[x][y].elevation = map[x][y].elevation+0.5;
					} else if(map[x][y].elevation < 3) {
						map[x][y].elevation = map[x][y].elevation-0.75;
					}
				}

				console.log(map[x][y].elevation);
			}
		} 
	}
    
	return map;
};




exports.generateMapPerlin = () => {
	let map = {};
	
	for(var x = 0; x < width; x++) {
		map[x] = {};

		for(var y = 0; y < height; y++) {
			map[x][y] = new cell(x, y);
		}
	} 
	
	for(var x = 0; x < width; x++) {
		for(var y = 0; y < height; y++) {
			var temp = simplex.noise2D(x/50,y/50);
			temp = (temp * 10) + 5;
			if(temp > 5){
				temp - ((temp)/2);
			}
			if(temp < 5){
				temp + (Math.abs(Math.abs(temp))/2)+5;
			}
			map[x][y].elevation = temp;
			/*
			var temp = simplex.noise2D(x/16,y/16);
			map[x][y].elevation = (temp * 12);*/
			//console.log(map[x][y].elevation);
		}
	}    
	return map;
};


exports.getLocalMap = (sx,sy,width,height,c) => {
	temp = "";
	//console.log((sx-width)+","+(sx+width)+"|"+(sy-height)+","+(sy+height));
	try {
		for(var x = parseInt(sx) + parseInt(width); x > (sx-width) - 1; x--) {
			for(var y = sy - height; y < parseInt(sy) + parseInt(height) + 1; y++) {
				try {
					if(x == sx && y == sy) {
						temp += "+";
					} else {
						if(wars[x+"|"+y] != undefined) {
							temp += "░";
						}else {
							
							if(countries[map[x][y].owner] != undefined) {
								if(countries[map[x][y].owner].capital.x == x && countries[map[x][y].owner].capital.y == y) {
									temp += "*";
								} else {
									try {
										var o = map[x][y].owner;
										if((map[x + 1][y].owner != o || map[x - 1][y].owner != o || map[x][y + 1].owner != o || map[x][y - 1].owner != o) && wars[x + "|" + y] == undefined) {
											if(countries[o] != undefined) {
												if((countries[o].allies.includes(map[x + 1][y].owner) && map[x + 1][y].owner != o) || (countries[o].allies.includes(map[x - 1][y].owner) && map[x - 1][y].owner != o) || (countries[o].allies.includes(map[x][y + 1].owner)&& map[x][y + 1].owner != o) || (countries[o].allies.includes(map[x][y - 1].owner)&& map[x][y - 1].owner != o)) { 
													temp += "▓";
												} else {
													temp += "█";
												}
											} else {
												temp += "█";
											}
										} else {
											temp += countries[map[x][y].owner].name.charAt(0);
										}
										
										
									}catch(err) {
										temp += countries[map[x][y].owner].name.charAt(0);
										//console.log(err);
									}
								}
							} else {
								if(map[x][y].elevation > 5) {
									if(map[x][y].elevation > 7) {
										if(map[x][y].elevation > 9) {
											temp += "^";
										} else {
											temp += "x";
										}
									} else {
										temp += ".";
									}
								} else {
									if(map[x][y].elevation < 0) {
										temp += "~";
									} else {
										temp += " ";
									}
								}
								
								//map[x][y].own▓er = "none";
							}
						}
					}
				} catch(err) {
					temp += "█";
				}
			}
			temp += "\n";
		}
		//console.log(temp);
		return temp;
	} catch(err) {
		return "Error occured";
	}
};
