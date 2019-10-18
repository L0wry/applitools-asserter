import axios from "axios";
import urlJoin from 'url-join';

const APPLITOOLS_BASE_URL = 'https://eyes.applitools.com';

const isPassing = (completedCount, passedCount) => completedCount === passedCount;

export default async (request, reply) => {
    const { apiKey, batchId } = request.query

    if (!batchId) {
        return reply.code(400).send({ error: 'missing batchID' })
    }
    if (!apiKey) {
        return reply.code(400).send({ error: 'missing api key ' })
    }

    const url = urlJoin(APPLITOOLS_BASE_URL, 'api', 'sessions', 'batches', batchId, 'bypointerid', `?apikey=${apiKey}`)
    const res = await axios.get(url)

    const { isCompleted: isTestCompleted, passedCount, unresolvedCount, completedCount, failedCount } = res.data;
    if (isTestCompleted) {

        if (isPassing(completedCount, passedCount)) {
            return reply.code(200).send({ status: 'passed' });
        }
        
        return reply.code(200).send({ status: 'failed', reason: `unresolved: ${unresolvedCount} || failed: ${failedCount}`});
    } else {
        return reply.code(200).send({ status: 'failed', reason: `test batch: ${batchId} is still running` })
    }
}