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

module.exports = class GenocideCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "genocide",
			group: "options",
			memberName: "genocide",
			description: "Change the percentage of your population that's killed every turn.",
			details: oneline`Only for facists.
			Affects loyalty.
			Affects war abillity.`,
			examples: ["!genocide 25"],
			args: [
				{
					key: "genocideAmt",
					prompt: "You gotta choose a percent!",
					type: "integer"
				}
			]
		});
	}
	run(msg, {genocideAmt}){
		id = msg.author.id;
		c = countries[id];
		if (countries[id].governmentType == "facist") {
			if (genocideAmt != undefined) {
				if (genocideAmt <= 100) {
					if (genocideAmt >= 0) {
						countries[id].population.genocidePercent = parseFloat(genocideAmt / 100);
						msg.channel.send("Genocide percent set to " + genocideAmt + "%");
						save(countries, map);
					} else {
						msg.channel.send("Genocide % too low!");
					}
				} else {
					msg.channel.send("Genocide % too high!");
				}
			} else {
				msg.channel.send("You need to give a valid percentage, `" + call + "genocide 25` will kill 25% of your population every turn.");

			}
		} else {
			msg.channel.send("Sorry, you have to be facist to use this command.");
		}
	}
};
