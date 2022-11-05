const axios = require('axios');
const response = require('../utils/crud_cotroller_response');

const getCardsByCollection = async (idCollection) => {
  let returned;
  try {
    let url = process.env.URL_API;
    let parametros = { params: { q: `set=${idCollection}` } };
    const headers = { 'Content-Type': 'application/json' };
    let resultadoTotal = [];
    let resultado;
    let index = 0;
    do {
      if (resultado && resultado.data.next_page) {
        url = resultado.data.next_page;
        parametros = null;
      }
      // eslint-disable-next-line no-await-in-loop
      resultado = await axios.get(url, parametros, headers);
      console.log(` ✔️ Result from API: ${idCollection}: request ${index} ✔️ `);
      resultadoTotal = resultadoTotal.concat(resultado.data.data);
      index += 1;
    } while (resultado.data.has_more);
    returned = response.ok(resultadoTotal/* .map((collection) => collection.data) */);
  } catch (error) {
    console.log(' ❌ Error Getting cards from collection ❌ ');
    console.log(error);
    returned = response.error('Error Getting cards from collection', error);
  }
  return returned;
};

module.exports = {
  getCollections: async () => {
    const { MGC_COLLECTIONS } = process.env;
    const arrayCollections = MGC_COLLECTIONS.split(';');
    // const promise = await getCardsByCollection(arrayCollections[0]);
    // eslint-disable-next-line max-len
    const result = await Promise.allSettled(arrayCollections.map((idCollection) => getCardsByCollection(idCollection)));
    return result.map((resu) => {
      const index = result.indexOf(resu);
      return (resu.status === 'fulfilled') ? resu.value.data : response.error(`Error getting cards form collections: ${index}`);
    });
  },
};
