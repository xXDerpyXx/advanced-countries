vars = require("./vars.js");
exports.Faction = class Faction{
	constructor(id, name){
		//ownerColor = vars.countries[id].color;
		this.id = id;
		this.name = name;
		this.owner = id;
		this.members= new Array(id);
		this.color = vars.countries[id].color;
		vars.countries[id].inFaction = true;
		/*
		this.color.r = ownerColor.r;
		this.color.g = ownerColor.g;
		this.color.b = ownerColor.b;
		*/
	}
}
