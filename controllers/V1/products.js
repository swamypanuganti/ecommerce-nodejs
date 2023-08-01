const imports = {};
module.exports = function (commonObjects) {
  imports.config = commonObjects.config;
  imports.db = commonObjects.db;
  imports.path = commonObjects.path;
  imports.moment = commonObjects.moment;
  imports.logger = commonObjects.logger;
  imports.products = require('../../services/' + __dirname.split(imports.path.sep).pop() + '/products')(commonObjects);

  return {
    getItems: getItems,
    createItem: createItem,
    updateItem: updateItem,
    deleteItem:deleteItem
  }
}
/**
* below function serves All Get  API calls
*/
async function getItems(req, res, next) {
  try {
    const paramsObj = req.params;
    const queryObj = req.query;
    const loginUserObj = {};
    const result = await imports.products.getItems(paramsObj, queryObj, loginUserObj);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
/**
* below function serves  Post/Put/Delete  API calls,it handles request body data
*/
function getObjData(req) {
  const productObj = (req.body.productData && typeof req.body.productData == 'string') ? JSON.parse(req.body.productData) : req.body;
  return productObj;
}
/**
* below function serves Post  API calls
*/
async function createItem(req, res, next) {
  try { 
      const productObj = {};
      productObj.product = getObjData(req);
      console.log('====>>>',productObj);
      const productRetObj = await imports.products.createItem(productObj);
      if(productRetObj){
        res.status(201).json({code:'201',data:productRetObj});
      } else {
        res.status(412).json({code:'412',message:'Error while creating product'});
      }
    } catch (err) {

        next(err);
    }
}
/**
* below function serves Put  API calls
*/
async function updateItem(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    let productObj = getObjData(req);
    const productRetObj = await imports.products.updateItem(productObj, id);
    if (productRetObj) {
      res.status(204).json({code:'204',message: 'Updated Successfully'});
    } else {
      res.status(404).json({code:'404', message:'Error while updating fas'+ productRetObj});
    }
  } catch (err) {
      next(err);
  }
}
/**
* below function serves Delete  API calls
*/
async function deleteItem(req, res, next){
  try{
  const id = parseInt(req.params.id, 10);
  const productObj = {};
    const productRetObj = await imports.products.deleteItem(productObj, id);
    if (productRetObj) {
      res.status(202).json({code:'202',message:'Deleted successfully'});
    } else {
      res.status(404).json({code:'404', message:'Error while updating products'});
    }
  } catch (err) {
    next(err);
  }
}