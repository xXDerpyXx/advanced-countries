/*jshint esversion: 6 */
var vars = require("../../struct/vars.js");

module.exports = class GovernmentCommand extends vars.Commando.Command {
	constructor(client){
		super(client, {
			name: "government",
			group: "options",
			memberName: "government",
			description: "Change your government type. Check details for options.",
			details: vars.oneline`Options: republic, dictatorship, monarchy, democracy, or facist.
			Not very strategic, set your government at the start.
			Affects loyalty _very_ negatively.
			Affects sway _very_ negatively.
			Affects resource.
			Affects war ability.`,
			examples: ["!government facist"],
			args: [
				{
					key: "govChosen",
					prompt: "You gotta choose a government!",
					type: "string"
				}
			]
		});
	}
	run(msg, {govChosen}){
		id = msg.author.id;
		c = vars.countries[id];
		if (govChosen == "facist") {
			vars.countries[id].governmentType = "facist";
			vars.countries[id].loyalty = 0;
			vars.countries[id].sway = -0.5;
			vars.save(vars.countries, vars.map);
			msg.channel.send("Government type set!");
		} else if (govChosen == "dictatorship") {
			vars.countries[id].governmentType = "dictatorship";
			vars.countries[id].genocidePercent = 0;
			vars.countries[id].population.loyalty = 0;
			vars.countries[id].population.sway = -0.5;
			vars.save(vars.countries, vars.map);
			msg.channel.send("Government type set!");
		} else if (govChosen == "monarchy") {
			vars.countries[id].governmentType = "monarchy";
			vars.countries[id].genocidePercent = 0;
			vars.countries[id].population.loyalty = 0;
			vars.countries[id].population.sway = -0.5;
			vars.save(vars.countries, vars.map);
			msg.channel.send("Government type set!");
		} else if (govChosen == "democracy") {
			vars.countries[id].governmentType = "democracy";
			vars.countries[id].genocidePercent = 0;
			vars.countries[id].population.loyalty = 0;
			vars.countries[id].population.sway = -0.5;
			vars.save(vars.countries, vars.map);
			msg.channel.send("Government type set!");
		} else if (govChosen == "republic") {
			vars.countries[id].governmentType = "republic";
			vars.countries[id].genocidePercent = 0;
			vars.countries[id].population.loyalty = 0;
			vars.countries[id].population.sway = -0.5;
			vars.save(vars.countries, vars.map);
			msg.channel.send("Government type set!");
		} else {
			msg.channel.send("Sorry, you can only be a republic, dictatorship, monarchy, democracy, or a facist.");
		}
		
	}
};
