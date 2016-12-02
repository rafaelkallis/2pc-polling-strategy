const Promise = require('bluebird');
const Coordinator = require('./coordinator');
const Subordinate = require('./subordinate');
const Strategies = require('./strategies');


function average(values) {
    return values.reduce((a, b) => a + b) / values.length;
}

function median(values) {
    const sorted = values.sort();
    return sorted[Math.floor(sorted.length / 2)];
}

/**
     * options: {
     *      n_subordinates: value,
     *      concurrency: value,
     *      timeout: value,
     *      error_rate: value
     *      reboot_delay: value,
     * }
     */
function sample(options) {

    let const_times = [];
    let lin_times = [];
    let exp_times = [];

    let const_options = JSON.parse(JSON.stringify(options));
    let lin_options = JSON.parse(JSON.stringify(options));
    let exp_options = JSON.parse(JSON.stringify(options));

    const_options.strategy = Strategies.constant;
    lin_options.strategy = Strategies.linear;
    exp_options.strategy = Strategies.exponential;

    const coordinator = new Coordinator();
    for (let i = options.n_subordinates; i--;) {
        coordinator.attach_subordinate(new Subordinate());
    }

    let promise = Promise.resolve();

    for (let sample = 50; --sample;) {
        promise = promise.then(() => Date.now())
            .then(start_time =>
                coordinator.commit(const_options)
                    .then(() => Date.now() - start_time)
            )
            .then(const_time => const_times.push(const_time))
            .then(() => Date.now())
            .then(start_time =>
                coordinator.commit(lin_options)
                    .then(() => Date.now() - start_time)
            )
            .then(lin_time => lin_times.push(lin_time))
            .then(() => Date.now())
            .then(start_time =>
                coordinator.commit(exp_options)
                    .then(() => Date.now() - start_time)
            )
            .then(exp_time => exp_times.push(exp_time));
    }

    return promise.then(() => {
        // let avg_const_time = Math.round(const_times.reduce((a, b) => a + b) / const_times.length);
        // let avg_lin_time = Math.round(lin_times.reduce((a, b) => a + b) / lin_times.length);
        // let avg_exp_time = Math.round(exp_times.reduce((a, b) => a + b) / exp_times.length);

        let avg_const_time = Math.round(median(const_times) * 100) / 100;
        let avg_lin_time = Math.round(median(lin_times) * 100) / 100;
        let avg_exp_time = Math.round(median(exp_times) * 100) / 100;

        return Promise.resolve([avg_const_time, avg_lin_time, avg_exp_time]);
    });
}

const options = {
    n_subordinates: 100,
    concurrency: 1,
    timeout: 100,
    error_rate: 0.1,
    reboot_delay: 10000
};

sample(options)
    .tap(console.log)
    .then(() => JSON.stringify(options))
    .tap(console.log);