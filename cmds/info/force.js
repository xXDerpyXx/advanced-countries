/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class ForceCommand extends vars.Commando.Command {
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
					type: "string",
					prompt: "asdf"
				}
			]
		});
	}
	run(msg, {mention}){
		id = msg.author.id;
		c = vars.countries[id];

		var toSend = "";
		if (msg.mentions.members.first()) id = msg.mentions.members.first().id;

			vars.countries[id].gun = guns["M1"];
		}
		var cMilitaryPop = Math.round((vars.countries[id].population.size * vars.countries[id].population.manpower) / 100);
		var armedPercent = 1;

		/*if (vars.countries.resource < vars.countries[id].gun.cost * cMilitaryPop) {

				}*/
		armedPercent = vars.countries[id].resource / (cMilitaryPop * vars.countries[id].gun.cost);
		if (armedPercent > 1) {
			armedPercent = 1;
		}
		var cost = Math.round(vars.countries[id].gun.cost * cMilitaryPop) * armedPercent;
		toSend += `${msg.mentions.members.first() ? msg.mentions.members.first().toString() + " has " : "You have "}` + ((((vars.countries[id].population.size * vars.countries[id].population.manpower) / (vars.countries[id].ownedCells)) * vars.countries[id].gun.modifier))*armedPercent + " force on average per cell";
		if (mention.toLowerCase() == "webint") {
			msg.channel.send(toSend + "\nYour army is armed with " + vars.countries[id].gun.name + " and you can give " + Math.round(armedPercent * 100) + "% of your " + (cMilitaryPop * 100) + " troops, this gun for the cost of " + vars.formatMass(Math.round(cost)) + " resource\n" + msg.author.id + "WEBINT_FORCE");
		} else {
			msg.channel.send(toSend + "\nYour army is armed with " + vars.countries[id].gun.name + " and you can give " + Math.round(armedPercent * 100) + "% of your " + (cMilitaryPop * 100) + " troops, this gun for the cost of " + vars.formatMass(Math.round(cost)) + " resource");
		}



	}
};




/*
if (parseInt(content[2]) == content[2] && parseInt(content[2]) + " " != "NaN ") {
						var found = false;
						var c = "";
						for (k in vars.countries) {
							if (vars.countries[k].name.toLowerCase() == content[1]) {
								found = true;
								c = k;
							}
						}
						if (found) {
							if (vars.countries[id].population.size >= parseInt(content[2])) {
								msg.channel.send("giving " + vars.countries[c].name + " " + content[2] + " people!");
								vars.countries[id].population.size -= parseInt(content[2]);
								vars.countries[c].population.size += parseInt(content[2]);
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
