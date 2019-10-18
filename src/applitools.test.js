import axios from "axios"
import nock from "nock"
import applitoolsAsserter from "./applitools"
import conflictsMock from './_mocks_/conflicts';
import passingMock from './_mocks_/passing';

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

const nockApplitools = (applitoolsResponse = {}) => {
    const batchId = 'batchId';
    const apiKey = 'apiKey';

    const scope = nock('https://eyes.applitools.com')
        .get(`/api/sessions/batches/${batchId}/bypointerid?apikey=${apiKey}`)
        .reply(200, applitoolsResponse)

    return axios.get(`${BASE_URL}:${PORT}?apiKey=${apiKey}&batchId=${batchId}`).then(res => {
        expect(res.status).toBe(200)
        scope.done()
        return res;
    }).catch(err => {
        console.log(err)
        throw err
    })
} 

describe("Applitools asserter", () => {
    beforeAll(startServer)
    afterEach(() => nock.cleanAll())
    afterAll(() => fastify.close())

    it('should send a request to applitools with batch and apikey', () => nockApplitools());

    it('should throw if batch Id is missing', () => {
        const apiKey = 'apiKey';
        return axios.get(`${BASE_URL}:${PORT}?apiKey=${apiKey}`).catch(err => expect(err.response.status).toBe(400))
    })

    it('should throw if api key is missing', () => {
        const batchId = 'batchId';
        return axios.get(`${BASE_URL}:${PORT}?batchId=${batchId}`).catch(err => expect(err.response.status).toBe(400))
    })

    it("should not assert when the tests are not complete", async () => {
        const batchId = 'batchId';
        const res = await nockApplitools({isCompleted: false})
        expect(res.status).toBe(200)
        expect(res.data).toEqual({status: 'failed', reason: `test batch: ${batchId} is still running`})
    })

    it("should assert when there are conflicts", async () => {
        const res = await nockApplitools(conflictsMock)
        expect(res.status).toBe(200)
        expect(res.data).toEqual({ status: 'failed', reason: `unresolved: 5 || failed: 0` })
    })

    it("should pass when there are no conflicts", async () => {
        const res = await nockApplitools(passingMock)
        expect(res.status).toBe(200)
        expect(res.data).toEqual({ status: 'passed'})
    })
})

