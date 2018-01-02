var sqlite = require("sqlite");
var path = require("path");
var oneline = require("common-tags").oneLine;
var Commando = require("discord.js-commando");
var fs = require("fs");
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

var government = require("../struct/Government.js"); // Government Structure
var location   = require("../struct/Location.js");   // Location Structure
var economy    = require("../struct/Economy.js");    // Economic Structure
var cell       = require("../struct/Cell.js");       // Map Cell Structure
var war        = require("../struct/War.js");        // War Structure
var gun        = require("../struct/Gun.js");        // Gun Structure
var countries  = require("../data/data.json");       // Country Data
var factions = {};
try{
	factions   = require("../data/factions.json");   // Faction Data
}catch(err){
	factions    = {};                                // Leave empty if missing
}

try{
	map        = require("../data/map.json");        // Map Data
}catch(err){
	map        = generateMapPerlin();                // Generate if missing
}

guns           = require("../consts/guns.json");     // Gun Data
var Faction    = require("./Faction.js");            // Faction Stucture
var country    = require("./country.js");            //Country Structure
var rgb        = require("./rgb.js");                //RGB Structure









module.exports = {
	sqlite,
	path,
	oneline,
	Commando,
	fs,
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
	government,
	location,
	economy,
	cell,
	war,
	gun,
	countries,
	map,
	wars,
	guns,
	factions,
	Faction,
	country,
	randInt,
	rgb
};
