const request = require('supertest')
const app = require('../../app')

const client = request(app)

describe("valid login", () => {
  it("should give a valid result", async () => {
    let resp = await client.post('/fetch_translation')
      .set('Accept', 'json')
      .send({
        source: "en",
        target: "es",
        query: "Hi"
      })

    expect(resp.status).toBe(200);
  })

  it("should give a error without query", async () => {
    let resp = await client.post('/fetch_translation')
      .set('Accept', 'json')
      .send({
        source: "es",
        target: "en",
        query: ""
      })

    expect(resp.status).not.toBe(200);
  })
  it("should give a error without source", async () => {
    let resp = await client.post('/fetch_translation')
      .set('Accept', 'json')
      .send({
        target: "en",
        query: "Hola"
      })

    expect(resp.status).not.toBe(200);
  })
  it("should give a error without target", async () => {
    let resp = await client.post('/fetch_translation')
      .set('Accept', 'json')
      .send({
        target: "en",
        query: "Hola"
      })

    expect(resp.status).not.toBe(200);
  })
})