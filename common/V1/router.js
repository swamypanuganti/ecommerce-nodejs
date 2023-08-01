const express = require('express');
const path = require('path')
const router = new express.Router();
const fs = require('fs');
// const logger = require('../logger');
const fileList = fs.readdirSync(`./controllers/${__dirname.split(path.sep).pop() + path.sep}`);
module.exports = function (commonObjects) {
  try{
    const config = commonObjects.config;
    fileList.forEach(file => {
      const controller = require(`../../controllers/${__dirname.split(path.sep).pop() + path.sep + file}`)(commonObjects);    
      router.route(config.apiList[file.split('.js')[0]])
      .get(controller.getItems ? controller.getItems : notFoundItem)
      .post(controller.createItem ? controller.createItem : notFoundItem)
      .put(controller.updateItem ? controller.updateItem : notFoundItem)
      .patch(controller.patchItem ? controller.patchItem : notFoundItem)
      .delete(controller.deleteItem ? controller.deleteItem : notFoundItem);
    });
    return router;
  } catch(error){
    // logger.error('error in router v1'+JSON.stringify(error));
    console.log('===== error in router.js', error);
  }
}
async function notFoundItem(req, res, next) {
  return res.status(404).end();
}
module.exports.notFoundItem = notFoundItem;