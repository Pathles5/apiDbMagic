const AWS = require('aws-sdk');
const express = require('express');
const serverless = require('serverless-http');
const apiMagic = require('./controller/apiMagic');

const app = express();

const { USERS_TABLE } = process.env;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

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

app.post('/cards', async (req, res) => {
  // return apiMagic.getCollections()
  const cards = await apiMagic.getCollections();
  console.log(cards);
  res.status(202).json(cards);
  //TODO terminar pruebas con api e inyectar en dynamo DB
});

app.use((req, res, next) => res.status(404).json({
  error: 'Not Found',
}));

module.exports = {
  handler: serverless(app),
  task: serverless(app),
};
