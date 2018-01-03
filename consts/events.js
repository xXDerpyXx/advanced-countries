vars = require("../struct/vars.js");
popBoom = vars.Event("Population Boom","population");
popBoom.generalChance = 0.05;
popBoom.minLoyalty = 0;
popBoom.maxLoyalty = 1;

popBoom.minManpower = 0;
popBoom.maxManpower = 1;

this.requiresWar = false;
this.effectsAllies = false;

this.description = "There was a population boom!";





module.exports = {
    popBoom
}
