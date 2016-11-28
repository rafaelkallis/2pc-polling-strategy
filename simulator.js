const Promise = require('bluebird');
const Coordinator = require('./coordinator');
const Subordinate = require('./subordinate');
const Strategies = require('./strategies');

/**
     * options: {
     *      n_subordinates: value,
     *      request_delay: value,
     *      concurrency: value,
     *      timeout: value,
     *      response_delay: value,
     *      processing_delay: value,
     *      error_rate: value
     *      reboot_delay: value,
     * }
     */
function sample(options) {
    let const_time = [];
    let lin_time = [];
    let exp_time = [];

    let const_options = JSON.parse(JSON.stringify(options));
    let lin_options = JSON.parse(JSON.stringify(options));
    let exp_options = JSON.parse(JSON.stringify(options));

    const_options.strategy = Strategies.constant;
    lin_options.strategy = Strategies.linear;
    exp_options.strategy = Strategies.exponential;

    let promise = Promise.resolve();

    for (let sample = 100; --sample;) {
        promise = promise.then(() => time_commit(const_options))
            .then(time => const_time.push(time))
            .then(() => time_commit(lin_options))
            .then(time => lin_time.push(time))
            .then(() => time_commit(exp_options))
            .then(time => exp_time.push(time));
    }

    return promise.then(() => {
        let avg_const_time = Math.round(const_time.reduce((a, b) => a + b) / const_time.length);
        let avg_lin_time = Math.round(lin_time.reduce((a, b) => a + b) / lin_time.length);
        let avg_exp_time = Math.round(exp_time.reduce((a, b) => a + b) / exp_time.length);

        return Promise.resolve([avg_const_time, avg_lin_time, avg_exp_time]);
    });
}

function time_commit(options) {
    const coordinator = new Coordinator();
    for (let i = options.n_subordinates; i--;) {
        coordinator.attach_subordinate(new Subordinate());
    }
    const start_time = Date.now();
    return coordinator.commit(options)
        .then(() => Date.now() - start_time);
};

const options = {
    n_subordinates: 100,
    request_delay: 0,
    concurrency: 10,
    timeout: 0,
    response_delay: 0,
    processing_delay: 0,
    error_rate: 0,
    reboot_delay: 0
};

sample(options).tap(console.log);