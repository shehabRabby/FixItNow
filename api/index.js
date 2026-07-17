
const app = require('../dist/src/app.js').default;

module.exports = (req, res) => {
  app(req, res);
};