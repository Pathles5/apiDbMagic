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
      console.log('params DB Create');
      console.log(params);
      const result = await dynamoDB.put(params).promise();
      console.log('Created:');
      console.log(result);
      returned = response.ok(item);
    } catch (error) {
      console.log(' ❌ Error creating cards into Dynamo ❌ ');
      console.log(error);
      returned = response.error('Error creating cards into Dynamo', error);
    }
    return returned;
  },
  getItemByKey: async (keyValue, keyName, tableName) => {
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

  getItemByAttributes: async (attributtes, keyAttributes, tableName, startKey) => {
    let returned;
    const params = {
      TableName: tableName,
      FilterExpression: '',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ...(startKey && { ExclusiveStartKey: { id: startKey } }),
    };
    keyAttributes.forEach((att, idx, array) => {
      params.ExpressionAttributeNames[`#${att}`] = att;
      params.ExpressionAttributeValues[`:${att}`] = attributtes[att];
      if (idx === array.length - 1) {
        params.FilterExpression = params.FilterExpression.concat(`#${att} = :${att}`);
      } else {
        params.FilterExpression = params.FilterExpression.concat(`#${att} = :${att} and `);
      }
    });
    console.log(params);
    try {
      const result = await dynamoDB.scan(params).promise();
      console.log(result);
      if (result.Items) {
        returned = response.ok({ items: result.Items, last_key: result.LastEvaluatedKey?.id });
      } else {
        returned = response.error('Could not find card with provided params', null, 404);
      }
    } catch (error) {
      console.log(error);
      returned = response.error('Could not retreive card', null, 500);
    }
    return returned;
  },

  getCardsLegal: async (value, tableName, startKey) => {
    let returned;
    const params = {
      TableName: tableName,
      FilterExpression: '#legalities.#mode = :value',
      ExpressionAttributeNames: {
        '#legalities': 'legalities',
        '#mode': value,
      },
      ExpressionAttributeValues: { ':value': 'legal' },
      ...(startKey && { ExclusiveStartKey: { id: startKey } }),
    };
    console.log(params);
    try {
      const result = await dynamoDB.scan(params).promise();
      // console.log(result);
      if (result.Items) {
        returned = response.ok({ items: result.Items, last_key: result.LastEvaluatedKey?.id });
      } else {
        returned = response.error('Could not find card with provided params', null, 404);
      }
    } catch (error) {
      console.log(error);
      returned = response.error('Could not retreive card', null, 500);
    }
    return returned;
  },
};
