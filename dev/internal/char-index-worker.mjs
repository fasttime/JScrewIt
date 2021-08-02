import solutionBookMap              from './solution-book-map.js';
import { parentPort, workerData }   from 'worker_threads';

const { char, solutionBookMap: serializedSolutionBookMap } = workerData;
serializedSolutionBookMap.delete(char);
for (const [char, solutionBook] of serializedSolutionBookMap)
    solutionBookMap.importBook(char, solutionBook);
(async () =>
{
    const solutionBook =
    await
    solutionBookMap.index
    (
        char,
        progress => parentPort.postMessage({ progress }),
        missingChar => parentPort.postMessage({ missingChar }),
    );
    parentPort.postMessage({ solutionBook });
}
)();
