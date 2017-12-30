const sqlite = require("sqlite");
const path = require("path");
const oneLine = require("common-tags").oneLine;
const Commando = require("discord.js-commando");
const fs = require("fs");
const {
	formatMass,
	save,
	recursiveWait,
	getOwnedCells,
	loadGuns,
	saveImage
} = require("../modules/util.js");
const {
	token,
	call,
	width,
	height,
	tickSpeed,
	adminList
} = require("../config.js");
const {
	generateMap,
	getLocalMap
} = require("../modules/map.js");
const {
	makeImage
} = require("../modules/canvas-map-gen.js");
const {
	declareWar
} = require("../modules/war.js");
const government = require("../struct/Government.js");
const location = require("../struct/Location.js");
const economy = require("../struct/Economy.js");
const cell = require("../struct/Cell.js");
const war = require("../struct/War.js");
const gun = require("../struct/Gun.js");
countries = require("../data/data.json");
map = require("../data/map.json");
loadGuns().then(g => guns = g);
const country = require("../struct/country.js");
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
	country
};