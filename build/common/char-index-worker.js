'use strict';

const solutionBookMap =
require('./solution-book-map');
const { parentPort, workerData: { char, serializedSolutionBookMap } } = require('worker_threads');

solutionBookMap.load(serializedSolutionBookMap);
solutionBookMap.delete(char);
const solutionBook =
solutionBookMap.index
(
    char,
    progress => parentPort.postMessage({ progress }),
    missingChar => parentPort.postMessage({ missingChar }),
);
const serializedSolutionBook = solutionBookMap.serialize(solutionBook);
parentPort.postMessage({ serializedSolutionBook });
