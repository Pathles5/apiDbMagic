'use estrict';

// start: GENERICS
const ids = {
  id: {
    nav: '#idNav',
    div: '#divId',
    button: '#idButton',
    input: '#idInput',
  },
  name: {
    nav: '#nameNav',
    div: '#nameId',
    button: '#nameButton',
    input: '#nameInput',
  },
  set: {
    nav: '#setNav',
    div: '#setId',
    button: '#setButton',
    input: '#setInput',
  },
  legal: {
    nav: '#legalNav',
    div: '#legalId',
    button: '#legalButton',
    input: '#legalInput',
  },
};

/// /  start: SIMPLES METHODS
const parseString = (jsonObject) => {
  if (jsonObject) {
    return JSON.stringify(jsonObject).replaceAll(',', '\n').replaceAll('{', '').replaceAll('}', '');
  }
  return '';
};
const transformCard = (card) => ({
  id: card.id,
  name: card.name,
  language: card.lang,
  collection: card.set,
  collection_name: card.set_name,
  image_uris: card.image_uris,
  legal: card.legalities,
  released_at: card.released_at,
});

const selectUrl = (value, key) => {
  let url = 'https://igv3shcb7k.execute-api.eu-west-1.amazonaws.com/pre/cards';
  switch (key) {
    case 'id':
      url += `/${value}`;
      break;
    case 'name':
    case 'set':
      url += `?${key}=${value}`;
      break;
    case 'legal':
      url += `/${key}/${value}`;
      break;
    default:
      break;
  }
  return url;
};
/// /  end: SIMPLES METHODS
const doRequest = async (value, key) => {
  const returned = {
    data: null,
    error: null,
  };
  console.log('selectUrl(value,key)');
  console.log(selectUrl(value, key));
  const query = await $.ajax({
    url: selectUrl(value, key),
    data: null,
    type: 'GET',
    dataType: null,
    success: (data) => {
      console.log('success');
    },
    error: (err) => {
      console.log('error');
    },
    complete: (data) => {
      console.log('complete');
    },
  });

  console.log('query');
  console.log(query);
  if (query) {
    returned.data = query;
  } else {
    returned.error = 'Not Found!!';
  }
  return returned;
};

const createContentTabel = (listCards, elementTable) => {
  listCards.forEach((card) => {
    elementTable.removeClass('d-none');
    $('tbody').append(`<tr>
        <td class="table-primary temp">${card.id}</td>
        <td class="table-primary temp">${card.name}</td>
        <td class="table-primary temp">${card.language}</td>
        <td class="table-primary temp">${card.relase_at}</td>
        <td class="table-primary temp">${parseString(card.image_uris)}</td>
        <td class="table-primary temp">${card.collection}</td>
        <td class="table-primary temp">${card.collection_name}</td>
        <td class="table-primary temp">${parseString(card.legal)}</td>
      </tr>`);
  });
};

const changeDisplay = (elementChosen) => {
  Object.keys(ids).filter((att) => att !== elementChosen).forEach((att) => {
    $(ids[att].nav).removeClass('active');
    $(ids[att].div).addClass('d-none');
  });
  $(ids[elementChosen].nav).addClass('active');
  $(ids[elementChosen].div).removeClass('d-none');
  $('tbody').empty();
  $('#table').addClass('d-none');
};
// end: GENERICS

// start: METHODS FOR QUERIES
// // ID
const getCardById = async () => {
  // id="6eb0d9a2-f9bb-4d8e-a1ca-896c42f8ad56"
  const id = $('#idInput').val();

  const card = await doRequest(id, 'id');
  containTable = transformCard(card.data);
  createContentTabel([containTable], $('#table'));
};

// // name & set
const getCardByAtt = async (attKey) => {
  // let attValue = 'Zirda, the Dawnwaker' //name
  const attValue = $(ids[attKey].input).val();
  const cards = await doRequest(attValue, attKey);

  const containTable = cards.data.items.map((card) => transformCard(card));
  createContentTabel(containTable, $('#table'));
};

// // legal
const getCardByLegal = async () => {
  // idLegal="gladiator"
  const idLegal = $(ids.legal.input).val();

  const cards = await doRequest(idLegal, 'legal');
  const containTable = cards.data.items.map((card) => transformCard(card));
  createContentTabel(containTable, $('#table'));
};
// end: METHODS FOR QUERIES

const main = async () => {
  // start: NAV
  Object.keys(ids).forEach((att) => {
    $(ids[att].nav).click(() => changeDisplay(att));
  });
  // end: NAV

  // start: Buttons
  $(ids.id.button).click(async () => {
    $('tbody').empty();
    await getCardById();
  });
  $(ids.name.button).click(async () => {
    $('tbody').empty();
    await getCardByAtt('name');
  });
  $(ids.set.button).click(async () => {
    $('tbody').empty();
    await getCardByAtt('set');
  });
  $(ids.legal.button).click(async () => {
    $('tbody').empty();
    await getCardByLegal();
  });
  // end: buttons
};

$(document).ready(main);
