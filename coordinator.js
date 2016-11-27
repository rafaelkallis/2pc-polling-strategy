const Promise = require('bluebird');
const Queue = require('bluebird-queue');
const Strategies = require('./strategies');
const SubordinateError = require('./errors');

const request_delay_fallback = 10;
const strategy_fallback = Strategies.constant;
const concurrency_fallback = 10;
const timeout_fallback = 1000;

const response_delay_fallback = 10;
const processing_delay_fallback = 50;
const error_rate_fallback = 0;
const reboot_delay_fallback = 1000;

module.exports = class Coordinator {

    constructor() {
        this._subordinates = [];
    }

    attach_subordinate(subordinate) {
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
    commit(options = {}) {

        const request_delay = getOrFallback(options.request_delay, request_delay_fallback);
        const strategy = getOrFallback(options.strategy, strategy_fallback);
        const concurrency = getOrFallback(options.concurrency, concurrency_fallback);
        const timeout = getOrFallback(options.timeout, timeout_fallback);

        const response_delay = getOrFallback(options.response_delay, response_delay_fallback);
        const processing_delay = getOrFallback(options.processing_delay, processing_delay_fallback);
        const error_rate = getOrFallback(options.error_rate, error_rate_fallback);
        const reboot_delay = getOrFallback(options.reboot_delay, reboot_delay_fallback);

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
    }
}

function getOrFallback(value, fallback) {
    if (typeof value === 'undefined') {
        return fallback;
    }
    return value;
}