/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class ResourceCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "resource",
			group: "info",
			memberName: "resource",
			description: "Get the stats of you or other's resource generation.",
			examples: ["!resource", "!resource @TbK"],
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
		c = vars.countries[id];

		var temp = "";
		if (msg.mentions.members.first()) id = msg.mentions.members.first().id;
		temp += (`${msg.mentions.members.first() ? msg.mentions.members.first().toString() + " has " : "You have "}` + vars.countries[id].resource + " resource\n");
		var total = 0;
		for (x in vars.map) {
			for (y in vars.map[x]) {
				try {
					if (vars.map[x][y].owner == id) {
						total += vars.map[x][y].resource;
					}
				} catch (err) {
					console.log(err.toString());
				}
			}
		}

		if (vars.countries[id].gun == undefined) {
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
		var profit = total - cost;
		temp += ("you mine " + Math.round(total) + " resource per turn\n");
		temp += ("and spend " + Math.round(cost) + " per turn on weapons\n");
		temp += ("leaving you with " + Math.round(profit) + " per turn\n");
		if (mention == "webint") {
			msg.channel.send(temp + msg.author.id + "WEBINT_RESOURCE");
		} else {
			msg.channel.send(temp);
		}
	}
};



