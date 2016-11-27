
let SubordinateError = function() { };

SubordinateError.prototype = Object.create(Error.prototype);

module.exports = SubordinateError;