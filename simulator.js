const Promise = require('bluebird');
const Coordinator = require('./coordinator');
const Subordinate = require('./subordinate');
const fs = require('fs');
const options = require('./constants');

/**
 * options: {
 *      n_subordinates: value,
 *      message_delay: value,
 *      n_commits: value,
 *      timeout: value,
 *      error_rate: value
 *      reboot_delay: value,
 *      backoff: value
 * }
 */
function sample(options) {

    let times = [];

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
        let start_time;
        promise = promise
            .then(() => start_time = Date.now())
            .then(() => generate_commits(options))
            .then(() => times.push(Date.now() - start_time));
    }

    return promise.then(() => times);
}


sample(opions)
    .then(results => Promise.fromCallback(callback => fs.writeFile('results.csv', results.join('\n'), callback)));