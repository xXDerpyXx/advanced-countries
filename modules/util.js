const fs = require('fs');
const { getLocalMap } = require('../modules/map.js');
const { token, call, width, height, tickSpeed } = require('../config.js')

module.exports = {
    formatMass: (val) => {
        
        if(Math.floor(val/1000) > 1000) {
            var ton = Math.floor(val / (1000 * 1000));
            var kg = Math.floor((val - ton) / 1000);
            var gram = Math.round((val - ton - kg) * 10) / 10;
            var s = "";
    
            if(ton > 1) {
                s = "s";
            }
    
            return ton + " metric crap ton" + s + " " + kg + "kg " + gram + "g";
        } else if(val > 1000) {
            return Math.floor(val/1000) + "kg " + val%1000 + "g";
        }
    
        return val + "g";
    },
    save: (countries, map) => {
        temp = JSON.stringify(countries);
        fs.writeFile(process.env.PWD + '/data/data.json',temp,function(err) {
            if(err) return console.error(err);
        })
        temp = JSON.stringify(map);
        fs.writeFile(process.env.PWD + '/data/map.json',temp,function(err) {
            if(err) return console.error(err);
        })
        
        fs.writeFile(process.env.PWD + '/data/map.txt', getLocalMap(width/2,height/2,(width/2)+2,(height/2)+2,"sgkj;ljsfg"),function(err) {
            if(err) return console.error(err);
        })
    },
    recursiveWait: (p, time, total) => {
        p.time = total - time;
        if(time < total){
            setTimeout(() => {
                time++;
                recursiveWait(p, time, total);
            }, 1000);
        } else {
            people[p.id].canMine = true;
        }
    },
    getOwnedCells: (c, map, countries) => {
        var temp = 0
        for(x in map){
            for(y in map[x]) {
                if(countries[map[x][y].owner] != undefined) {
                    if(map[x][y].owner == c.id) {
                        temp++;
                    }
                }
            }
        }
    
        return temp;
    }
}