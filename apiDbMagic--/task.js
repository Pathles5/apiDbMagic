const apiMagic = require('./controller/apiMagic');
const db = require('./controller/dynamo');

module.exports = {
  main: async () => {
    const { TABLE_CARDS } = process.env;
    console.log(TABLE_CARDS);
    const cards = await apiMagic.getCollections();
    const resultDb = await Promise.allSettled(cards.flat().map((card) => db.create(card, 'id', TABLE_CARDS, null)));
    console.log(resultDb);
  },
};
