var sqlite = require("sqlite");
var path = require("path");
var oneline = require("common-tags").oneLine;
var Commando = require("discord.js-commando");
var fs = require("fs");
var countries = {};
var map = {};

var wars = {};
var guns = {};
var {
	formatMass,
	save,
	recursiveWait,
	getOwnedCells,
	loadGuns,
	saveImage
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
	getLocalMap
} = require("../modules/map.js");
var {
	makeImage
} = require("../modules/canvas-map-gen.js");
var {
	declareWar
} = require("../modules/war.js");
var government = require("../struct/Government.js");
var location = require("../struct/Location.js");
var economy = require("../struct/Economy.js");
var cell = require("../struct/Cell.js");
var war = require("../struct/War.js");
var gun = require("../struct/Gun.js");
countries = require("../data/data.json");
map = require("../data/map.json");
loadGuns().then(g => guns = g);
var country = require("../struct/country.js");
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
	country,
	wars,
	guns
};