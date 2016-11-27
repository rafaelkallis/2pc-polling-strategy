const Promise = require('bluebird');
const SubordinateError = require('./errors');
const Random = require('random-js');
const random = new Random(Random.engines.mt19937().autoSeed());

module.exports = class Subordinate {
    constructor() {
        this._active = true;
    }

    /**
     * options: {
     *      response_delay: value,
     *      processing_delay: value,
     *      error_rate: value
     *      reboot_delay: value,
     * }
     */
    commit(options) {

        const response_delay = options.response_delay;
        const processing_delay = options.processing_delay;
        const error_rate = options.error_rate;
        const reboot_delay = options.reboot_delay;

        if (this._active) {
            if (random.real(0, 1, false) > error_rate) {
                return Promise.delay(processing_delay + response_delay);
            } else {
                this._active = false;
                setTimeout(() => this._active = true, reboot_delay);
            }
        }
        return Promise.reject(new SubordinateError());
    }
}