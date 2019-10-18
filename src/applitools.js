import axios from "axios";
import urlJoin from 'url-join';

const APPLITOOLS_BASE_URL = 'https://eyes.applitools.com';

export default async (request, reply) => {
    const { apiKey, batchId } = request.query

    if (!batchId) {
        reply.code(400).send({ error: 'missing batchID' }) 
        return;
    }
    if (!apiKey) {
        reply.code(400).send({ error: 'missing api key ' })
        return;
    }

    const url = urlJoin(APPLITOOLS_BASE_URL, 'api', 'sessions', 'batches', batchId, 'bypointerid', `?apikey=${apiKey}`)
    const res = axios.get(url)
    
    reply.code(200).send(res)
}