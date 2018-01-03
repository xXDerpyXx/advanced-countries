var countries = {};
var map = {};
var wars = {};
var guns = {};
var factions = {};
var {
	formatMass,
	save,
	recursiveWait,
	getOwnedCells,
	loadGuns,
	saveImage,
	randInt
} = require("../modules/util.js");
var {
	token,
	call,
	width,
	height,
	tickSpeed,
	adminList
} = require("../config.js");
var {
	generateMap,
	generateMapPerlin,
	getLocalMap
} = require("../modules/map.js");
var {
	makeImage
} = require("../modules/canvas-map-gen.js");
var {
	declareWar
} = require("../modules/war.js");


var factions   = {};
try{
	factions   = require("../data/factions.json");   // Faction Data
}catch(err){
	factions   = {};                                // Leave empty if missing
}

try{
	map        = require("../data/map.json");        // Map Data
}catch(err){
	map        = generateMapPerlin();                // Generate if missing
}
module.exports = {
	formatMass,
	save,
	recursiveWait,
	getOwnedCells,
	loadGuns,
	saveImage,
	token,
	call,
	width,
	height,
	tickSpeed,
	adminList,
	generateMap,
	generateMapPerlin,
	getLocalMap,
	makeImage,
	declareWar,
	map,
	wars,
	factions,
	randInt,
	Faction    : require("./Faction.js"),           // Faction Stucture
	country    : require("./country.js"),            //Country Structure
	rgb        : require("./rgb.js"),
	guns       : require("../consts/guns.json"),
	government : require("../struct/Government.js"), // Government Structure
	location   : require("../struct/Location.js"),   // Location Structure
	economy    : require("../struct/Economy.js"),    // Economic Structure
	cell       : require("../struct/Cell.js"),       // Map Cell Structure
	war        : require("../struct/War.js"),        // War Structure
	gun        : require("../struct/Gun.js"),        // Gun Structure
	countries  : require("../data/data.json"),
	sqlite     : require("sqlite"),
	path       : require("path"),
	oneline    : require("common-tags").oneLine,
	Commando   : require("discord.js-commando"),
	fs         : require("fs"),
	ai         : require("ai.js")
};
