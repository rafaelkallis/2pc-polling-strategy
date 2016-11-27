const Subordinate = require('../subordinate');
const SubordinateError = require('../errors');

describe('subordinate', () => {
    let subordinate;
    const options = {
        response_delay: 0,
        processing_delay: 0,
        error_rate: 0,
        reboot_delay: 1000
    };

    beforeEach(() => {
        subordinate = new Subordinate();
    });

    it('should commit', done => {
        subordinate.commit(options)
            .then(done);
    });

    it('should not commit when error happens', done => {
        options.error_rate = 1;

        subordinate.commit(options)
            .catch(SubordinateError, e => done());
    });

    it('should not be active', done => {
        options.error_rate = 1;
        options.reboot_delay = 100;

        subordinate.commit(options)
            .catch(SubordinateError, e => { })
            .then(() => {
                if (!subordinate._active) {
                    done();
                }
            });
    });

    it('should reboot', done => {
        options.error_rate = 1;
        options.reboot_delay = 0;

        subordinate.commit(options)
            .catch(SubordinateError, e => { })
            .delay(10)
            .then(() => {
                if (subordinate._active) {
                    done();
                };
            });
    });

    it('should throw subordinate error when not active', done => {
        subordinate._active = false;

        subordinate.commit(options)
            .catch(SubordinateError, e => done());
    });
});