const Random = require('random-js');
const random = new Random(Random.engines.mt19937().autoSeed());
const fs = require('fs');

let values = [];

for (let i = 0; i < 1000000; ++i) {
    values.push(Math.random());
}

fs.writeFile('random.csv', values.join('\n'), () => { });