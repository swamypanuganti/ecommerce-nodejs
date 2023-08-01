const imports = {};
module.exports = function (commonObjects) {
  imports.config = commonObjects.config;
  imports.db = commonObjects.db;
  imports.path = commonObjects.path;
  imports.moment = commonObjects.moment;
  imports.categories = require('../../services/' + __dirname.split(imports.path.sep).pop() + '/categories')(commonObjects);

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
    const result = await imports.categories.getItems(paramsObj, queryObj, loginUserObj);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
/**
* below function serves  Post/Put/Delete  API calls,it handles request body data
*/
function getObjData(req) {
  const categoryObj = (req.body.categoryData && typeof req.body.categoryData == 'string') ? JSON.parse(req.body.categoryData) : req.body;
  return categoryObj;
}
/**
* below function serves Post  API calls
*/
async function createItem(req, res, next) {
  try { 
      const categoryObj = {};
      categoryObj.category = getObjData(req);
      console.log('====>>>',categoryObj);
      const categoryRetObj = await imports.categories.createItem(categoryObj);
      if(categoryRetObj){
        res.status(201).json({code:'201',data:categoryRetObj});
      } else {
        res.status(412).json({code:'412',message:'Error while creating category'});
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
    let categoryObj = getObjData(req);
    const categoryRetObj = await imports.categories.updateItem(categoryObj, id);
    if (categoryRetObj) {
      res.status(204).json({code:'204',message: 'Updated Successfully'});
    } else {
      res.status(404).json({code:'404', message:'Error while updating fas'+ categoryRetObj});
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
  const categoryObj = {};
    const categoryRetObj = await imports.categories.deleteItem(categoryObj, id);
    if (categoryRetObj) {
      res.status(202).json({code:'202',message:'Deleted successfully'});
    } else {
      res.status(404).json({code:'404', message:'Error while updating categories'});
    }
  } catch (err) {
    next(err);
  }
}