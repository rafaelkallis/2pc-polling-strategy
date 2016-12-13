const assert = require('assert');

describe('simulator', () => {
    it('should load config', () => {
        const options = require('../constants');

        assert.ok(options.n_subordinates);
        assert.ok(options.message_delay);
        assert.ok(options.n_commits);
        assert.ok(options.timeout);
        assert.ok(options.error_rate);
        assert.ok(options.reboot_delay);
        assert.ok(options.backoff);
    });
})