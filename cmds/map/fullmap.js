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
	country
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
		save(countries, map);
			//msg.author.send('The Whole Map!',  {files: ["./map.txt"]});
			let buffer = makeImage(map, wars, 0, 0, width, height, countries, true);

			setTimeout(function () {
				msg.channel.send("Fullmap:", {
					files: [{
						attachment: buffer,
						name: "map.png",
					}],
				});
			}, 500);
			//console.log(getLocalMap(width/2,height/2,(width/2)+2,(height/2)+2,"sgkj;ljsfg"));
		}
	}
};
