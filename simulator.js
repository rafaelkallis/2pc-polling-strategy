const Promise = require('bluebird');
const Coordinator = require('./coordinator');
const Subordinate = require('./subordinate');
const Strategies = require('./strategies');

let coordinator = new Coordinator({ concurrency: 1 });

for (let i = 0; i < 1000; ++i) {
    coordinator.attach_subordinate(new Subordinate());
}

coordinator.commit({
    strategy: Strategies.constant,
    error_rate: 0.001
})
    .then(() => console.log('drained'));