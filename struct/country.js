var vars = require("./vars.js");
module.exports = class country {
	constructor(id, name, chosenEconomy = "capitalist", chosenGov = "dictatorship") {
		this.id = id;
		this.name = name;
		this.owner = vars.client.users.get(id).tag;
		this.allies = [];
		this.economyType = chosenEconomy;
		this.governmentType = chosenGov;
		this.resource = 0;
		this.allies[0] = id;
		this.population = {};
		this.ownedCells = 0;
		this.genocidePercent = 0.0;
		this.population.size = 1000;
		this.population.loyalty = 1;
		this.population.sway = 0;
		this.population.manpower = 0.2;
		this.capital = new location(Math.round(Math.random() * width), Math.round(Math.random() * height));
		//this.capital = new location(11, 15);
		console.log(this.capital.x, this.capital.y);
		var owner = vars.map[this.capital.x][this.capital.y].owner;
		let tries = 0;

		while (vars.map[this.capital.x][this.capital.y].elevation > 4 || vars.map[this.capital.x][this.capital.y].elevation < 0) {
			this.capital = new location(Math.round(Math.random() * width), Math.round(Math.random() * height));
		}

		if (owner != "none") {
			while (owner != "none") { //&& tries < 200){
				this.capital = new location(Math.round(Math.random() * width), Math.round(Math.random() * height));
				try {
					owner = vars.map[this.capital.x][this.capital.y].owner;
					if (vars.map[this.capital.x][this.capital.y].elevation > 3 && vars.map[this.capital.x][this.capital.y].elevation < 0) {
						owner = "";
					}
				} catch (err) {
					console.log(err.toString());
				}

				tries++;
			}
		}
		if (tries > 1999) {
			this.population.size = 0;
		} else {
			for (var x = this.capital.x - 2; x < this.capital.x + 3; x++) {
				for (var y = this.capital.y - 2; y < this.capital.y + 3; y++) {
					try {
						if (vars.map[x][y].owner == "none" && vars.map[x][y].elevation < 10 && vars.map[x][y].elevation > 0) {
							vars.map[x][y].owner = id;
						}
					} catch (err) {
						console.log(err.toString());
					}
				}
			}

			for (var x = this.capital.x - 1; x < this.capital.x + 2; x++) {
				for (var y = this.capital.y - 1; y < this.capital.y + 2; y++) {
					try {
						vars.map[x][y].owner = id;
					} catch (err) {
						console.log(err.toString());
					}
				}
			}

			vars.map[this.capital.x][this.capital.y].owner = id;
			save(vars.countries, vars.map);
		}
	}
};