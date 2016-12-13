## Two Phase Commit Recovery Polling Strategy
### by [Rafael Kallis](http://rafaelkallis.com), [Elias Bernhaut](https://github.com/alpox)
[![Build Status](https://travis-ci.org/rafaelkallis/2pc-polling-strategy.svg?branch=master)](https://travis-ci.org/rafaelkallis/2pc-polling-strategy)
___
 
 Used for two phase commit protocol simulation, just like [here](http://2pc.rafaelkallis.com).

 Make sure you have [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com) installed.

 Additionally run `npm install` in order to get the required dependencies.

 Available scripts:

```
// Run tests:
$ npm run test

// Run simulator:
$ npm run simulator

// Run randomness test:
$ npm run rng
```

Tweak simulation variables in `constants.js`.