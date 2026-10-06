const express = require("express");

/**
 * Substitui um módulo no cache do require antes de ele ser carregado.
 * @param {string} path Caminho do módulo (resolvido a partir deste arquivo).
 * @param {object} exports O que o módulo deve exportar.
 */
function mockModule(path, exports) {
  const resolved = require.resolve(path);
  require.cache[resolved] = {id: resolved, filename: resolved, loaded: true,
    exports};
}

/**
 * Sobe o app em uma porta livre. Assim como no Cloud Functions, o body
 * JSON chega já parseado.
 * @param {Function} app App Express a testar.
 * @return {Promise<{url: string, close: Function}>}
 */
function startServer(app) {
  const wrapper = express();
  wrapper.use(express.json());
  wrapper.use(app);

  return new Promise((resolve) => {
    const server = wrapper.listen(0, () => {
      resolve({
        url: `http://localhost:${server.address().port}`,
        close: () => new Promise((done) => server.close(done)),
      });
    });
  });
}

/**
 * Faz um POST JSON e devolve status, headers e body.
 * @param {string} url URL completa.
 * @param {object} body Corpo da requisição.
 * @param {object} headers Headers extras.
 * @return {Promise<{status: number, headers: Headers, body: object}>}
 */
async function postJson(url, body, headers = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: Object.assign({"content-type": "application/json"}, headers),
    body: JSON.stringify(body),
  });
  return {
    status: response.status,
    headers: response.headers,
    body: await response.json(),
  };
}

module.exports = {mockModule, startServer, postJson};
