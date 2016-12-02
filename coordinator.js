const Promise = require('bluebird');
const Queue = require('bluebird-queue');
const Strategies = require('./strategies');
const SubordinateError = require('./errors');

module.exports = function Coordinator() {
    this._subordinates = [];

    this.attach_subordinate = function(subordinate) {
        this._subordinates.push(subordinate);
    }

    /**
     * options: {
     *      request_delay: value,
     *      strategy: value,
     *      concurrency: value,
     *      timeout: value,
     *      response_delay: value,
     *      processing_delay: value,
     *      error_rate: value
     *      reboot_delay: value,
     * }
     */
    this.commit = function(options) {

        const queue = new Queue({ concurrency: options.concurrency });
        queue.add(Promise.resolve);
        return queue.start()
            .then(() => Promise.map(this._subordinates, subordinate => new Promise(resolve => {
                const commit_subordinate = (n_attempt) =>
                    subordinate.commit({ error_rate: options.error_rate, reboot_delay: options.reboot_delay })
                        .then(resolve)
                        .catch(SubordinateError, e =>
                            Promise.delay(options.timeout)
                                .then(() => {
                                    Promise.delay(options.strategy(n_attempt++))
                                        .then(() => queue.add(commit_subordinate(subordinate, n_attempt)));
                                })
                        );
                queue.add(commit_subordinate(subordinate, 1));
            })))
            .then(() => Promise.resolve());
    };
}