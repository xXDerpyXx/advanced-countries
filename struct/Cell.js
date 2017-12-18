module.exports = class cell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.resource = Math.round(Math.random() * 10);
		this.elevation = Math.round(Math.random() * 10);
		/*
		if(Math.round(Math.random()*10) > 8) {
			this.elevation = 20;
		}*/
		this.climate = 0;
		this.owner = "none";
	}
}