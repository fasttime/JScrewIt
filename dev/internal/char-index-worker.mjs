import { parentPort, workerData }   from 'node:worker_threads';
import SolutionBookMap              from './solution-book-map.mjs';

const { char, SolutionBookMap: serializedSolutionBookMap } = workerData;
serializedSolutionBookMap.delete(char);
for (const [char, solutionBook] of serializedSolutionBookMap)
    SolutionBookMap.importBook(char, solutionBook);
{
    const solutionBook =
    await
    SolutionBookMap.index
    (
        char,
        progress => parentPort.postMessage({ progress }),
        missingChar => parentPort.postMessage({ missingChar }),
    );
    parentPort.postMessage({ solutionBook });
}
