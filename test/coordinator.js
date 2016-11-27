const Coordinator = require('../coordinator');
const Subordinate = require('../subordinate');
const assert = require('assert');

describe('coordinator', () => {
    let coordinator;
    let subordinate;

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
        coordinator.commit()
            .then(done);
    });
});