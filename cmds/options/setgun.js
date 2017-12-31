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

module.exports = class SetGunCommand extends Commando.Command {
	constructor(client){
		super(client, {
			name: "setgun",
			group: "options",
			memberName: "setgun",
			description: "Set your gun, at the cost of 10% of your resource",
			details: oneline`Use this to set your gun. Be warned, however, as it uses 10% of your resource!
			Use it _wisely_.`,
			examples: ["!setgun m1"],
			args: [
				{
					key: "theGun",
					label: "gun",
					prompt: "Pick a gun! !guns to see them all.",
					type: "string"
				}
			]
		});
	}
	run(msg, {theGun}){
		id = msg.author.id;
		c = countries[id];
		if (guns[theGun] != undefined) {
			msg.channel.send("gun set!");
			countries[id].gun = guns[theGun];
			countries[id].resource = countries[id].resource - (countries[id].resource * 0.1);
			save(countries,map);
		} else {
			msg.channel.send(theGun + " is not a gun that exists");
		}
	}
};
