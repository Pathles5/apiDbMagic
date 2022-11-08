const apiMagic = require('./controller/apiMagic');
const db = require('./controller/dynamo');

const transformCard = (card) => ({
  id: card.id,
  name: card.name,
  lang: card.lang,
  set: card.set,
  set_name: card.set_name,
  image_uris: card.image_uris,
  legalities: card.legalities,
  released_at: card.released_at,
});

const sortArray = (array) => array.sort((a, b) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) {
    return -1;
  }
  if (a.name.toLowerCase() > b.name.toLowerCase()) {
    return 1;
  }
  if (a.release_at > b.release_at) {
    return -1;
  }
  if (a.release_at < b.release_at) {
    return 1;
  }
  return 0;
});

const deleteRepaetedItems = (array) => {
  const hash = {};
  return array.filter((current) => {
    const exists = !hash[current.name];
    hash[current.name] = true;
    return exists;
  });
};

module.exports = {
  main: async () => {
    const { TABLE_CARDS } = process.env;
    console.log(TABLE_CARDS);
    const cards = await apiMagic.getCollections();
    const newCards = cards.flat();
    console.log('cards');
    console.log(newCards);
    const filteredCars = deleteRepaetedItems(sortArray(newCards));
    console.log('cards clean');
    console.log(filteredCars);
    const resultDb = await Promise.allSettled(filteredCars.map((card) => db.create(transformCard(card), 'id', TABLE_CARDS, null)));
    console.log('resultDb');
    console.log(resultDb);
    return resultDb;
  },
};
