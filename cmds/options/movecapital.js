/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class MoveCapitalCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "movecapital",
			group: "options",
			memberName: "movecapital",
			description: "Moves your capital to said location.",
			details: vars.oneline`Can be used strategically.
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
		c = vars.countries[id];
		if (vars.map[x][y].owner == id) {
			vars.countries[id].capital.x = x;
			vars.countries[id].capital.y = y;
			msg.channel.send("Capital moved!");
		} else {
			msg.channel.send("You don't own that land!");
		}
	}
};
