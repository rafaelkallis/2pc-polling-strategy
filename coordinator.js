const Promise = require('bluebird');
const Queue = require('bluebird-queue');
const Strategies = require('./strategies');
const SubordinateError = require('./errors');

module.exports = function Coordinator() {
    this._subordinates = [];

    this.attach_subordinate = function (subordinate) {
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
    this.commit = function (options) {

        const request_delay = options.request_delay;
        const strategy = options.strategy;
        const concurrency = options.concurrency;
        const timeout = options.timeout;

        const response_delay = options.response_delay;
        const processing_delay = options.processing_delay;
        const error_rate = options.error_rate;
        const reboot_delay = options.reboot_delay;

        const queue = new Queue({ concurrency });

        const commit_subordinate = (subordinate, n_attempt) =>
            Promise.delay(request_delay)
                .then(() => subordinate.commit({
                    response_delay,
                    processing_delay,
                    error_rate,
                    reboot_delay
                }))
                .catch(SubordinateError, e => {
                    Promise.delay(timeout + strategy(++n_attempt))
                        .then(() => queue.add(commit_subordinate(subordinate, n_attempt)));
                });

        this._subordinates.map(subordinate => queue.add(commit_subordinate(subordinate, 0)));

        return queue.start().then(() => Promise.resolve());
    };
}