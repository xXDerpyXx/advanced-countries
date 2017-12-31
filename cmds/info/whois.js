/*jshint esversion: 6 */
var {
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

module.exports = class WhoIsCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "whois",
			group: "info",
			memberName: "whois",
			description: "Mention a person to see what country they own.",
			examples: ["!whois @TbK"],
			args: [
				{
					key: "mention",
					label: "mention",
					type: "string",
					default: "idkwhatyouwant",
					prompt: "asdf"
				}
			]
		});
	}
	run(msg, {mention}){
		id = msg.author.id;
		c = countries[id];
		
		if (msg.mentions.members.first()) {
			id = msg.mentions.members.first().id, c = countries[id];
			msg.channel.send(`${msg.mentions.members.first().toString()} is the country of '${c.name}'`);
		} else {
			msg.channel.send("Please actually mention someone...");
		}
	}
};



