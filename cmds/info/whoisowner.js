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

module.exports = class WhoIsOwnerCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "whoisowner",
			group: "info",
			memberName: "whoisowner",
			description: "Mention a country name to see who owns it.",
			examples: ["!whoisowner DEV_Skeylis"],
			args: [
				{
					key: "mention",
					label: "mention",
					type: "string",
					default: "notacountrylolpleasestop",
					prompt: "asdf"
				}
			]
		});
	}
	run(msg, {mention}){
		id = msg.author.id;
		c = countries[id];
		
		var toSend = "";
		if (mention != undefined) {
			Object.keys(countries).forEach(function (key) {

				if (countries[key].name.toLowerCase() == mention) {
					toSend += `The owner of ${countries[key].name} is ${countries[key].owner}.`;
				}

			});
			if (toSend != "") {
				msg.channel.send(toSend);
			} else {
				msg.channel.send("That country doesn't exist...");
			}
		} else {
			msg.channel.send("Please actually mention a country name...");
		}
	}
};



