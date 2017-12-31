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

module.exports = class GovernmentCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "government",
			group: "options",
			memberName: "government",
			description: "Change your government type. Check details for options.",
			details: oneline`Options: republic, dictatorship, monarchy, democracy, or facist.
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
		c = countries[id];
		if (govChosen == "facist") {
			countries[id].governmentType = "facist";
			countries[id].loyalty = 0;
			countries[id].sway = -0.5;
			save(countries, map);
			msg.channel.send("Government type set!");
		} else if (govChosen == "dictatorship") {
			countries[id].governmentType = "dictatorship";
			countries[id].genocidePercent = 0;
			countries[id].loyalty = 0;
			countries[id].sway = -0.5;
			save(countries, map);
			msg.channel.send("Government type set!");
		} else if (govChosen == "monarchy") {
			countries[id].governmentType = "monarchy";
			countries[id].genocidePercent = 0;
			countries[id].loyalty = 0;
			countries[id].sway = -0.5;
			save(countries, map);
			msg.channel.send("Government type set!");
		} else if (govChosen == "democracy") {
			countries[id].governmentType = "democracy";
			countries[id].genocidePercent = 0;
			countries[id].loyalty = 0;
			countries[id].sway = -0.5;
			save(countries, map);
			msg.channel.send("Government type set!");
		} else if (govChosen == "republic") {
			countries[id].governmentType = "republic";
			countries[id].genocidePercent = 0;
			countries[id].loyalty = 0;
			countries[id].sway = -0.5;
			save(countries, map);
			msg.channel.send("Government type set!");
		} else {
			msg.channel.send("Sorry, you can only be a republic, dictatorship, monarchy, democracy, or a facist.");
		}
		
	}
};
