const axios = require('axios');
const response = require('../utils/crud_cotroller_response');

const getCardsByCollection = async (idCollection) => {
  let returned;
  try {
    const { URL_API } = process.env;
    // const parametros = { params: { q: `set=${idCollection}` } };
    // const headers = { 'Content-Type': 'application/json' };
    const resultado = await axios.get(URL_API, { params: { q: `set=${idCollection}` } }, { headers: { 'Content-Type': 'application/json' } });
    console.log(' ✔️ Result from API: ✔️ ');
    // console.log(resultado.data);
    returned = response.ok(resultado.data);
  } catch (error) {
    console.log(' ❌ Error Getting Cards ❌ ');
    console.log(error);
    returned = response.error('Error Getting Cards', error);
  }
  return returned;
};

module.exports = {
  getCollections: async () => {
    const { MGC_COLLECTIONS } = process.env;
    const arrayCollections = MGC_COLLECTIONS.split(';');
    const promiseX = await getCardsByCollection(arrayCollections[0]);
    // const result = Promise.allSettled(promise);
    console.log(promiseX);
    return promiseX;
  },
};
