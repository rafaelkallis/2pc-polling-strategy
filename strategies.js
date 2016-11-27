const delay = 100;

module.exports = {
    constant: (n_attempt) => !n_attempt ? 0 : delay,
    linear: (n_attempt) => !n_attempt ? 0 : n_attempt * delay,
    exponential: (n_attempt) => !n_attempt ? 0 : delay * Math.pow(2, n_attempt)
}