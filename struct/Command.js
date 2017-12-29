module.exports = class Command {
	constructor(name, jsName, numArgs) {
		this.call = name;
		this.js = jsName;
		this.args = numArgs;
	}
};