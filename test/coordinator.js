const Coordinator = require('../coordinator');
const Subordinate = require('../subordinate');
const assert = require('assert');

describe('coordinator', () => {
    let coordinator;
    let subordinate;

    const options = {
        n_subordinates: 2,
        message_delay: 2,
        n_commits: 2,
        timeout: 2,
        error_rate: 0,
        reboot_delay: 10,
        backoff: 8
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