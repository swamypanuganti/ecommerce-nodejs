const imports = {};
const fieldName = {
  keyField: 'id',
  listSortField: 'productName',
  dropDownField: 'productName'
};
module.exports = function (commonObjects) {
  imports.config = commonObjects.config;
  imports.path = commonObjects.path;
  imports.db = commonObjects.db;
  imports.sequelizeCon = commonObjects.sequelizeCon;
  imports.moment = commonObjects.moment;
  return {
    getItems: getItems,
    createItem: createItem,
    updateItem: updateItem,
    deleteItem: deleteItem
  }
}
/**
* below function servs for All Get API requests
* @param {*} Obj 
* @returns 
*/
async function getItems(paramsObj, queryObj, loginUserObj) {
  const context = {};
  context.id = parseInt(paramsObj.id, 10);
  context.skip = parseInt(queryObj.skip, 10);
  context.limit = parseInt(queryObj.limit, 10);
  context.type = queryObj.type;
  context.sort = queryObj.sort;
  context.search = queryObj.search;
  context.loginUserObj = loginUserObj;
  context.filtersJson = JSON.parse(JSON.stringify(queryObj));
  delete context.filtersJson.skip;
  delete context.filtersJson.limit;
  delete context.filtersJson.sort;
  delete context.filtersJson.search;
  delete context.filtersJson.type;
  const result = (context.id && (!context.type || context.type == 'list')) ? await getItem(context) : ((!context.type || context.type == 'list') ? await getItemsList(context) : await getItemsDropDown(context));
  return result;
}

/**
* below function servs for All Get API requests (view api call)
* @param {*} id 
* @returns  obj
*/
async function getItem(context) {
  console.log('=====>>>>getrecordbyid', context.id);
  const result = await imports.db.products.findOne({
    where: { 'ID': context.id },
  });
  return result;
}

/**
* below function servs for All Get API requests (listing api call)
* @param {*} type = list & limt & skip &search & sort 
* @returns  obj
*/
async function getItemsList(context) {
  console.log('===inside users db listing=====', context);
  const { binds, searchColumnsCond } = await getQueryObj(context);
  if (context.id) {
    binds[fieldName.keyField] = context.id;
  }
  const limit = (context.limit > 0) ? context.limit : imports.config.rowsPerPage;
  const offset = (context.skip > 0) ? limit * (context.skip - 1) : 0;

  const whereCond = {};
  if (binds && Object.keys(binds).length > 0) {
    whereCond.$and = [binds];
  }
  if (searchColumnsCond && searchColumnsCond.length > 0) {
    whereCond.$or = searchColumnsCond;
  }
  const selectQuery = `SELECT * FROM `;
  const tableNames = `products WHERE isenabled = 1 AND isdeleted = 0`;
  const condtion = ` LIMIT ${limit}  OFFSET ${offset}`;
  const query = selectQuery + tableNames + condtion;
  const countQuery = `SELECT COUNT(*) COUNT FROM ` + tableNames;
  const result1 = await imports.sequelizeCon.query(query);
  const count1 = await imports.sequelizeCon.query(countQuery);
  const count = count1[0][0].COUNT;
  const resultJson = {
    total_count: count,
    pages: Math.ceil(count / limit),
    rows: result1[0]
  }
  return resultJson;
}
/**
* below function servs for All Get API requests (dropdown api call)
* @param {*} type = list & limt & skip &search & sort 
* @returns  obj
*/
async function getItemsDropDown(context) {
  const { binds, searchColumnsCond } = await getQueryObj(context);
  if (context.id) {
    binds[fieldName.keyField] = context.id;
  }
  const limit = (context.limit > 0) ? context.limit : imports.config.rowsPerPage;
  const offset = (context.skip > 0) ? limit * (context.skip - 1) : 0;

  const whereCond = {};
  if (binds && Object.keys(binds).length > 0) {
    whereCond.$and = [binds];
  }
  if (searchColumnsCond && searchColumnsCond.length > 0) {
    whereCond.$or = searchColumnsCond;
  }
  const selectQuery = `SELECT id,productName FROM `;
  const tableNames = `products`;
  const condtion = ` LIMIT ${limit}  OFFSET ${offset}`;
  const query = selectQuery + tableNames + condtion;
  const countQuery = `SELECT COUNT(*) FROM ` + tableNames;
  const result1 = await imports.sequelizeCon.query(query);
  const count = await imports.sequelizeCon.query(countQuery);
  console.log('=====>>>>>', result1, count);
  const result = await imports.db.products.findAll();
  return result;
}
/**
* below function servs for making filterconditins dynamic
* @param {*} Obj 
* @returns 
*/
async function getQueryObj(context) {
  const binds = { is_deleted: false };
  const filtersJsonKeys = Object.keys(context.filtersJson);
  for (let m = 0; m < filtersJsonKeys.length; m++) {
    if (context.filtersJson[filtersJsonKeys[m]]) {
      const intValue = parseInt(context.filtersJson[filtersJsonKeys[m]], 10);
      if (intValue || intValue === 0) {
        binds[filtersJsonKeys[m]] = parseInt(context.filtersJson[filtersJsonKeys[m]], 10);
      } else {
        binds[filtersJsonKeys[m]] = context.filtersJson[filtersJsonKeys[m]];
      }
    }
  }
  let searchColumnsCond = [];
  if (context.search && context.search.trim()) {
    const searchString = context.search.trim().toLowerCase();
    searchColumnsCond = await getSearchConditions(searchString, context.type);
  }
  return { binds: binds, searchColumnsCond: searchColumnsCond }
}
/**
* below function servs for Apply search conditions
* @param {*} Obj 
* @returns 
*/
async function getSearchConditions(searchString, type) {
  const searchColumnsCond = [];
  searchLikeCond = { $regex: searchString, $options: 'i' };
  if (!type || type == 'list') {
    searchColumnsCond.push({ QUESTION: searchLikeCond });
    searchColumnsCond.push({ ANSWER: searchLikeCond });
  } else {
    searchColumnsCond.push({ QUESTION: searchLikeCond });
    searchColumnsCond.push({ ANSWER: searchLikeCond });
  }
  return searchColumnsCond;
}
/**
* below function servs for FAQ
* @param {*} Obj 
* @returns 
*/
async function createItem(test) {
  try {
    const productObj = JSON.parse(JSON.stringify(test.product));
    console.log('=========>>>>DBAPI', productObj);
    const result = await imports.db.products.create(productObj);
    return result;
  } catch (err) {
    console.log('Error while create Faq' + err);

  }
}
/**
* below function servs for FAQ update
* @param {*} Obj 
* @returns 
*/
async function updateItem(test, id) {
  const productObj = test;
  const result = await imports.db.products.update(productObj, { where: { 'ID': id } });
  return result;
}

/**
* below function servs for delete FAQ 
* @param {*} Obj 
* @returns 
*/
async function deleteItem(test, id) {
  const productObj = test;
  const result = await imports.db.products.update(productObj, { where: { 'ID': id } });
  return result;
}