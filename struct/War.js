module.exports = class war {
	constructor(a, d, x, y, map) {
		this.attacker = a;
		Math.round(Math.random() * 10);
		this.defender = d;
		this.aForce = 0;
		this.dForce = 0;
		this.cell = map[x][y];
		this.x = x;
		this.y = y;
	}
};