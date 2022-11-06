// eslint-disable-next-line import/no-extraneous-dependencies
// const AWS = require('aws-sdk');
const express = require('express');
const serverless = require('serverless-http');
const check = require('express-validator');
const { getCardById, getCardByAttribute, getCardsLegal } = require('./controller/card');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.get( // id
  '/cards/:cardId',
  check.param('cardId').exists(),
  async (req, res) => {
    const errors = check.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    const id = req.params.cardId;
    const result = await getCardById(id);
    if (!result.error) {
      return res.status(200).json(result.data);
    }
    return res.status(500).json(result);
  },
);

app.get( // name and set
  '/cards',
  async (req, res) => {
    const result = await getCardByAttribute(req.query);
    if (!result.error) {
      return res.status(200).json(result.data);
    }
    return res.status(500).json(result);
  },
);

app.get( // legal
  '/cards/legal/:idLegal',
  check.param('idLegal').isString(),
  async (req, res) => {
    const errors = check.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    const id = req.params.idLegal;
    const startKey = req.query.start_key;
    const result = await getCardsLegal(id, startKey);
    if (!result.error) {
      return res.status(200).json(result.data);
    }
    return res.status(500).json(result);
  },
);
app.use((req, res, next) => res.status(404).json({
  error: 'Not Found',
}));

module.exports = {
  handler: serverless(app),
};
