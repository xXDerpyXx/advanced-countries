module.exports = class Event{
	constructor(name, type, generalChance, minLoyalty = 0,maxLoyalty = 1,minManpower = 0, maxManpower = 1000, requiresWar = false, affectsAllies = false){
		this.name = name;
		this.type = type;
		this.generalChance = generalChance;
		this.minLoyalty = minLoyalty;
		this.maxLoyalty = maxLoyalty;
		this.minManpower = minManpower;
		this.maxManpower = maxManpower;
		this.requiresWar = requiresWar;
		this.affectsAllies = affectsAllies;
		this.description = "Something happened!";
	}
};
