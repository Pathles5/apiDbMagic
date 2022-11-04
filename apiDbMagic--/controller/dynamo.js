// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');

// const dynamoDB = new AWS.DynamoDB.DocumentClient();
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY', // needed if you don't have aws credentials at all in env
  secretAccessKey: 'DEFAULT_SECRET', // needed if you don't have aws credentials at all in env
});
const response = require('../utils/crud_cotroller_response');

module.exports = {
  create: async (item, keyName, tableName, force) => {
    let returned;
    try {
      const params = {
        TableName: tableName,
        Item: item,
      };
      if (!force) {
        params.ExpressionAttributeNames = {
          '#keyName': keyName,
        };
        params.ConditionExpression = 'attribute_not_exists(#keyName)';
      }
      await dynamoDB.put(params).promise();
      returned = response.ok(item);
    } catch (error) {
      console.log(' ❌ Error creating cards into Dynamo ❌ ');
      console.log(error);
      returned = response.error('Error creating cards into Dynamo', error);
    }
    return returned;
  },
  getItemById: async (keyValue, keyName, tableName) => {
    let returned;
    const params = {
      TableName: tableName,
      Key: {
        [keyName]: keyValue,
      },
    };

    try {
      const { Item } = await dynamoDB.get(params).promise();
      if (Item) {
        console.log('Item');
        console.log(Item);
        returned = response.ok(Item);
      } else {
        returned = response.error('Could not find card with provided "id"', null, 404);
      }
    } catch (error) {
      console.log(error);
      returned = response.error('Could not retreive card', null, 500);
    }
    return returned;
  },
};
