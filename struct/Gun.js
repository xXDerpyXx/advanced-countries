module.exports = class gun {
	constructor(name) {
		this.name = name;
		this.counters = [];
		this.modifier = 1;
		this.cost = 1;
	}
}