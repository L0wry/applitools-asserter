import axios from "axios"
import nock from "nock"
import applitoolsAsserter from "./applitools"

const PORT = 3010;
const BASE_URL = 'http://localhost';

let fastify

const startServer = () => new Promise((resolve, reject) => {
    fastify = require('fastify')({
        logger: true
    })

    fastify.get('/', applitoolsAsserter)

    fastify.listen(PORT, err => {
        if (err) reject(err)
        resolve()
    })
})

describe("Applitools asserter", () => {
    beforeAll(startServer)
    afterEach(() => nock.cleanAll())
    afterAll(() => fastify.close())

    it('should send a request to applitools with batch and apikey', () => {
        const batchId = 'batchId';
        const apiKey = 'apiKey';

        const scope = nock('https://eyes.applitools.com')
            .get(`/api/sessions/batches/${batchId}/bypointerid?apikey=${apiKey}`)
            .reply(200)

        return axios.get(`${BASE_URL}:${PORT}?apiKey=${apiKey}&batchId=${batchId}`).then(res => {
            expect(res.status).toBe(200)
            scope.done()
        })
    })

    it('should throw if batch Id is missing', () => {
        const apiKey = 'apiKey';
        return axios.get(`${BASE_URL}:${PORT}?apiKey=${apiKey}`).catch(err => expect(err.response.status).toBe(400))
    })

    it('should throw if api key is missing', () => {
        const batchId = 'batchId';
        return axios.get(`${BASE_URL}:${PORT}?batchId=${batchId}`).catch(err => expect(err.response.status).toBe(400))
    })
})

