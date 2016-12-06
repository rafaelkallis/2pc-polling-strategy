const Promise = require('bluebird');
const Coordinator = require('./coordinator');
const Subordinate = require('./subordinate');
const Strategies = require('./strategies');
const fs = require('fs');


function average(values) {
    return values.reduce((a, b) => a + b) / values.length;
}

function median(values) {
    const sorted = values.sort();
    return sorted[Math.floor(sorted.length / 2)];
}

function transpose(matrix) {
    if (!matrix.length) return [];
    let transposed = [];
    matrix.forEach((row, i) => row.forEach((value, j) => {
        if (!transposed[j]) transposed[j] = [];
        transposed[j][i] = value;
    }));
    return transposed;
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

    const generate_commits = (options) => {
        const commits = [];
        for (let commit_idx = 0; commit_idx < options.n_commits; ++commit_idx) commits.push(coordinator.commit(options));
        return Promise.all(commits);
    }

    let promise = Promise.resolve();

    for (let sample = 1000; sample--;) {
        promise = promise
            .then(() => Date.now())
            .then(start_time => generate_commits(const_options)
                .then(() => Date.now() - start_time))
            .then(const_time => const_times.push(const_time))
            .then(() => Date.now())
            .then(start_time => generate_commits(lin_options)
                .then(() => Date.now() - start_time)
            )
            .then(lin_time => lin_times.push(linl_time))
            .then(() => Date.now())
            .then(start_time => generate_commits(exp_options)
                .then(() => Date.now() - start_time)
            )
            .then(exp_time => exp_times.push(exp_time));
    }

    return promise.then(() => [const_times, lin_times, exp_times]);
}

const options = {
    n_subordinates: 100,
    request_delay: 2,
    n_commits: 100,
    timeout: 2,
    error_rate: 0.1,
    reboot_delay: 10,
    backoff: 8
};
Promise.fromCallback(callback => fs.writeFile('results', '#' + JSON.stringify(options) + '\nconstant backoff, linear backoff, exponential backoff\n', callback))
    .then(() => sample(options))
    .then(results => [results[0].sort((a, b) => a - b), results[1].sort((a, b) => a - b), results[2].sort((a, b) => a - b)])
    .then(sorted_results => transpose(sorted_results))
    .then(transposed_results => transposed_results.map(row => Promise.fromCallback(callback => fs.appendFile('results', row + '\n', callback))))
    .then(() => console.log('done'));