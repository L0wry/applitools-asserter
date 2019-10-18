import axios from "axios"
import applitoolsAsserter from "./applitools"

const PORT = 3010;
const BASE_URL = 'http://localhost';

let fastify

const startServer = () => new Promise((resolve, reject) => {
    fastify = require('fastify')({
        logger: true
    })

    fastify.get('/', (request, reply) => {
        applitoolsAsserter()
        reply.send({ hello: 'world' })
    })

    fastify.listen(PORT, err => {
        if (err) reject(err)
        resolve()
    })
})

describe("Applitools asserter", () => {
    beforeAll(startServer)
    afterAll(() => fastify.close())

    it("responds", () => axios.get(`${BASE_URL}:${PORT}`))
})