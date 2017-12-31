/*jshint esversion: 6 */
const {
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
} = require("../../struct/vars.js");

module.exports = class MoveCapitalCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "movecapital",
			group: "options",
			memberName: "movecapital",
			description: "Moves your capital to said location.",
			details: oneline`Can be used strategically.
			If an enemy is near your capital, you can move it further away.`,
			examples: ["!movecapital 50 50"],
			args: [
				{
					key: "x",
					prompt: "You need to have coords...",
					type: "integer"
				},
				{
					key: "y",
					prompt: "You need to have coords...",
					type: "integer"
				}
			]
		});
	}
	run(msg, {x,y}){
		id = msg.author.id;
		c = countries[id];
		if (map[y[x]].owner == id) {
			countries[id].capital.x = y;
			countries[id].capital.y = x;
			msg.channel.send("Capital moved!");
		} else {
			msg.channel.send("You don't own that land!");
		}
	}
};
