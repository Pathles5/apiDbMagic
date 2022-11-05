const db = require('./dynamo');
const response = require('../utils/crud_cotroller_response');

module.exports = {
  getCardById: async (id) => {
    let returned;
    const { TABLE_CARDS } = process.env;
    const result = await db.getItemByKey(id, 'id', TABLE_CARDS);
    if (!result.error) {
      returned = response.ok(result.data);
    } else {
      returned = response.error('Error getting ItemByKey', result.error);
    }
    return returned;
  },

  getCardByAttribute: async (atts, startKey) => {
    let returned;
    const { TABLE_CARDS } = process.env;
    const queryStrings = atts;
    delete queryStrings.startKey;
    const queryKeys = Object.keys(queryStrings);
    const result = await db.getItemByAttributes(queryStrings, queryKeys, TABLE_CARDS, startKey);
    if (!result.error) {
      returned = response.ok(result.data);
    } else {
      returned = response.error('Error getting ItemByKey', result.error);
    }
    return returned;
  },

  getCardsLegal: async (id, startKey) => {
    let returned;
    const { TABLE_CARDS } = process.env;
    const result = await db.getCardsLegal(id, TABLE_CARDS, startKey);
    if (!result.error) {
      returned = response.ok(result.data);
    } else {
      returned = response.error('Error getting ItemByKey', result.error);
    }
    return returned;
  },
};
