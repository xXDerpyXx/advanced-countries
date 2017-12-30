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

module.exports = class AlliesCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "allies",
			group: "info",
			memberName: "allies",
			description: "List your or other's allies.",
			examples: ["!allies", "!allies @TheBestCountry'sOwner"],
			args: [
				{
					key: "useless",
					label: "mention",
					type: "string",
					default: "idkwhatyouwant",
					prompt: "asdf"
				}
			]
		});
	}
	run(msg, {useless}){
		id = msg.author.id;
		c = countries[id];

		if (msg.mentions.members.first()) id = msg.mentions.members.first().id;

		temp = "";
		for (k in countries[id].allies) {
			try {
				temp += "" + countries[countries[id].allies[k]].name + "\n";
			} catch (err) {
				console.log(k + " had an error, it's ID = " + countries[id].allies[k]);
			}
		}
		msg.channel.send(temp);
	}
};



