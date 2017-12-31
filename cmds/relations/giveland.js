/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class GiveLandCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "giveland",
			group: "relations",
			memberName: "giveland",
			description: "Gives another country a square of land.",
			details: vars.oneline`Will give a square to that country.
			Useful for wars and payment.`,
			examples: ["!giveland Skeylis 50 50 10"],
			args: [
				{
					key: "sendTo",
					label: "country",
					prompt: "You can't send to nobody!",
					type: "string"
				},
				{
					key: "x",
					label: "x",
					type: "integer",
					prompt: "Specify x & y!"
				},
				{
					key: "y",
					label: "y",
					type: "integer",
					prompt: "Specify x & y!"
				},
				{
					key: "size",
					type: "integer",
					prompt: "Specify a size!"
				}
			]
		});
	}
	run(msg, {sendTo, x, y, size}){
		id = msg.author.id;
		c = vars.countries[id];	
		
		var foundTarget = false;
		var target = "";
		for (k in vars.countries) {
			//console.log(vars.countries[k].name);
			if (vars.countries[k].name.toLowerCase() == sendTo.toLowerCase()) {
				target = k;
				foundTarget = true;
			}
		}
		if (!foundTarget) {
			msg.channel.send("They dont exist!");
		} else {
			
			var targetX = y;
			var targetY = x;
			var size = Math.floor(size / 2);
			var givenLand = 0;
			for (var x = targetX - size; x < targetX + size + 1; x++) {
				for (var y = targetY - size; y < targetY + size + 1; y++) {
					try {
						if (vars.map[x][y].owner == id) {
							vars.map[x][y].owner = target;
							givenLand++;
						}
					} catch (err) {
						console.log(err.toString());
					}
				}
			}
			vars.save(vars.countries,vars.map);
			msg.channel.send("you gave " + vars.countries[target].name + " " + givenLand + " cells");
		}
	}
};



