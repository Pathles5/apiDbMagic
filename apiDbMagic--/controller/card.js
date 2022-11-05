const db = require('./dynamo');
const response = require('../utils/crud_cotroller_response');

module.exports = {
  getCardById: async (req) => {
    let returned;
    const { TABLE_CARDS } = process.env;
    const id = req.params.cardId;
    const result = await db.getItemByKey(id, 'id', TABLE_CARDS);
    if (!result.error) {
      returned = response.ok(result.data);
    } else {
      returned = response.error('Error getting ItemByKey', result.error);
    }
    return returned;
  },
  getCardByAttribute: async (req) => {
    let returned;
    const { TABLE_CARDS } = process.env;
    const queryStrings = req.query;
    const queryKeys = Object.keys(queryStrings);
    const result = await db.getItemByAttributes(queryStrings, queryKeys, TABLE_CARDS);
    if (!result.error) {
      returned = response.ok(result.data);
    } else {
      returned = response.error('Error getting ItemByKey', result.error);
    }
    return returned;
  },
};
