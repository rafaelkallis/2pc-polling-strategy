const Coordinator = require('../coordinator');
const Subordinate = require('../subordinate');
const Strategies = require('../strategies');
const assert = require('assert');

describe('coordinator', () => {
    let coordinator;
    let subordinate;
    const options = {
        request_delay: 0,
        strategy: Strategies.constant,
        concurrency: 10,
        timeout: 1000,
        response_delay: 0,
        processing_delay: 0,
        error_rate: 0,
        reboot_delay: 1000
    };

    beforeEach(() => {
        coordinator = new Coordinator();
        subordinate = new Subordinate();
        coordinator.attach_subordinate(subordinate);
    });

    it('should attach subordinate', () => {
        assert.equal(coordinator._subordinates.length, 1);
        assert.equal(coordinator._subordinates[0], subordinate);
    });

    it('should commit', done => {
        coordinator.commit(options)
            .then(done);
    });
});