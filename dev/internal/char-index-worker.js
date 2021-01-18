'use strict';

const solutionBookMap =
require('./solution-book-map');
const { parentPort, workerData: { char, solutionBookMap: serializedSolutionBookMap } } =
require('worker_threads');

serializedSolutionBookMap.delete(char);
for (const [char, solutionBook] of serializedSolutionBookMap)
    solutionBookMap.importBook(char, solutionBook);
const solutionBook =
solutionBookMap.index
(
    char,
    progress => parentPort.postMessage({ progress }),
    missingChar => parentPort.postMessage({ missingChar }),
);
parentPort.postMessage({ solutionBook });
