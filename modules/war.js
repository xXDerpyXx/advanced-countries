const war = require('../struct/War.js');

module.exports = {
    declareWar: (x,y,a,d,warAll, wars, map, countries) => {
        if(wars[x + "|" + y] == undefined) {
            if(map[x][y].owner == "none") {
                if(wars[x + "|" + y] == undefined){
                    wars[x + "|" + y] = new war(a, "none" ,x ,y, map);
                    return null;
                }
            }
            if(a != d && !(countries[a].allies.includes(d)) && (map[x][y].owner == d || warAll)) {
                if(warAll) {
                    d = map[x][y].owner;
                }
                if(wars[x + "|" + y] == undefined) {
                    wars[x + "|" + y] = new war(a,d,x,y, map);
                }
            }
        }
    }
}
