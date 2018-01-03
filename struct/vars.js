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
	Faction    : require("./Faction.js"),            // Faction Stucture
	country    : require("./country.js"),            // Country Structure
	rgb        : require("./rgb.js"),                // RGB Structure
	guns       : require("../consts/guns.json"),     // Gun Constants
	government : require("../struct/Government.js"), // Government Structure
	location   : require("../struct/Location.js"),   // Location Structure
	economy    : require("../struct/Economy.js"),    // Economic Structure
	cell       : require("../struct/Cell.js"),       // Map Cell Structure
	war        : require("../struct/War.js"),        // War Structure
	gun        : require("../struct/Gun.js"),        // Gun Structure
	countries  : require("../data/data.json"),       // Country Data
	sqlite     : require("sqlite"),                  // Sqlite
	path       : require("path"),                    // Path
	oneline    : require("common-tags").oneLine,     // Oneline
	Commando   : require("discord.js-commando"),     // Commando
	fs         : require("fs"),                      // Filesystem
	ai         : require("./ai.js")                  // AI Structure
};
