const Promise = require('bluebird');
const SubordinateError = require('./errors');
const Random = require('random-js');
const random = new Random(Random.engines.mt19937().autoSeed());

module.exports = function Subordinate() {
    this._active = true;

    /**
     * options: {
     *      message_delay: value,
     *      error_rate: value,
     *      reboot_delay: value
     * }
     */
    this.commit = function (options) {
        if (this._active) {
            if (random.real(0, 1, false) > options.error_rate) {
                return Promise.delay(options.message_delay);
            } else {
                this._active = false;
                Promise.delay(options.reboot_delay).then(() => this._active = true);
            }
        }
        return Promise.reject(new SubordinateError());
    }
}