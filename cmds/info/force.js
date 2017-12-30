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

module.exports = class ForceCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "force",
			group: "info",
			memberName: "force",
			description: "Tells you or another user's force.",
			examples: ["!force", "!force @Derpy"],
			args: [
				{
					key: "mention",
					default: "idk",
					type: "string"
				}
			]
		});
	}
	run(msg, {mention}){
		id = msg.author.id;
		c = countries[id];

		var toSend = "";
		if (msg.mentions.members.first()) id = msg.mentions.members.first().id;
		toSend += `${msg.mentions.members.first() ? msg.mentions.members.first().toString() + " has " : "You have "}` + (((countries[id].population.size * countries[id].population.manpower) / (countries[id].ownedCells)) * countries[id].gun.modifier) + " force on average per cell";
		if (countries[id].gun == undefined) {
			countries[id].gun = guns["M1"];
		}
		var cMilitaryPop = Math.round((countries[id].population.size * countries[id].population.manpower) / 100);
		var armedPercent = 1;

		/*if (countries.resource < countries[id].gun.cost * cMilitaryPop) {

				}*/
		armedPercent = countries[id].resource / (cMilitaryPop * countries[id].gun.cost);
		if (armedPercent > 1) {
			armedPercent = 1;
		}
		var cost = Math.round(countries[id].gun.cost * cMilitaryPop) * armedPercent;
		if (mention.toLowerCase() == "webint") {
			msg.channel.send(toSend + "\nYour army is armed with " + countries[id].gun.name + " and you can give " + Math.round(armedPercent * 100) + "% of your " + (cMilitaryPop * 100) + " troops, this gun for the cost of " + Math.round(cost) + " resource\n" + msg.author.id + "WEBINT_FORCE");
		} else {
			msg.channel.send(toSend + "\nYour army is armed with " + countries[id].gun.name + " and you can give " + Math.round(armedPercent * 100) + "% of your " + (cMilitaryPop * 100) + " troops, this gun for the cost of " + Math.round(cost) + " resource");
		}

	}
};




/*
if (parseInt(content[2]) == content[2] && parseInt(content[2]) + " " != "NaN ") {
						var found = false;
						var c = "";
						for (k in countries) {
							if (countries[k].name.toLowerCase() == content[1]) {
								found = true;
								c = k;
							}
						}
						if (found) {
							if (countries[id].population.size >= parseInt(content[2])) {
								msg.channel.send("giving " + countries[c].name + " " + content[2] + " people!");
								countries[id].population.size -= parseInt(content[2]);
								countries[c].population.size += parseInt(content[2]);
							} else {
								msg.channel.send("you don't even have that many people!");
							}
						} else {
							msg.channel.send("They don't exist!");
						}


					} else {
						msg.channel.send("That's not a number...");
					}
					*/