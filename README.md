## Two Phase Commit Recovery Polling Strategy
### by [Rafael Kallis](http://rafaelkallis.com), [Elias Bernhaut](https://github.com/alpox)
[![Build Status](https://travis-ci.org/rafaelkallis/2pc-polling-strategy.svg?branch=master)](https://travis-ci.org/rafaelkallis/2pc-polling-strategy)
___
 
 ### Problem Definition:

 Unlike a transaction on a local database, a distributed transaction involves altering data on multiple databases. Consequently, distributed transaction processing is more complicated, because the database must coordinate the committing or rolling back of the changes in a transaction as a self-contained unit. In other words, the entire transaction commits, or the entire transaction rolls back.

 The database ensures the integrity of data in a distributed transaction using the two-phase commit mechanism. In the prepare phase, the coordinator in the transaction asks the subordinates to promise to commit or roll back the transaction. If all subordinates are able to commit the transaction, the transaction stages in the commit phase, otherwise it stages in the abort phase. During the commit phase, the coordinator asks all subordinates to commit the transaction. During the abort phase, all subordinates are asked to roll back.


// write more stuff

// state chart

// define constants & variables

//

 ```
 Coordinator                                        Subordinate
                        PREPARE
                -------------------------------->
                        VOTE YES/NO                 prepare*/abort*
                <-------------------------------
commit*/abort*         COMMIT/ROLLBACK
                -------------------------------->
                        ACKNOWLEDGMENT              commit*/abort*
                <--------------------------------  
end
```
```
An * next to the record type means that the record is forced to stable storage.
```