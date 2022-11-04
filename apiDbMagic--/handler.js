// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');
const express = require('express');
const serverless = require('serverless-http');
/* const apiMagic = require('./controller/apiMagic'); */
const db = require('./controller/dynamo');

const app = express();

const { USERS_TABLE } = process.env;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get('/cards/:cardId', async (req, res) => {
  const { TABLE_CARDS } = process.env;
  const id = req.params.cardId;
  const result = await db.getItemById(id, 'id', TABLE_CARDS);
});

app.get('/users/:userId', async (req, res) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not retreive user' });
  }
});

app.post('/users', async (req, res) => {
  const { userId, name } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId,
      name,
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ userId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not create user' });
  }
});

/* app.post('/cards', async (req, res) => {
  const { TABLE_CARDS } = process.env;
  console.log(TABLE_CARDS);
  const cards = await apiMagic.getCollections();
  const resultDb = await Promise.allSettled(cards.flat().map((card) => db.create(card, 'id', TABLE_CARDS, null)));
  res.status(200).json(resultDb);
  // TODO terminar pruebas con api e inyectar en dynamo DB
}); */

app.use((req, res, next) => res.status(404).json({
  error: 'Not Found',
}));

module.exports = {
  handler: serverless(app),
};
