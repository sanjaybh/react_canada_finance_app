// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  //console.log(tokenUser);
  if(tokenUser != null) {
    //const { _id } = tokenUser;
    const { _id, item, price } = params;

    if(!item || !price) {
      context.status(400);
      return {
        "success": false,
        'message': 'Product Name, amount are mandatory'
      }
    }
    
    const oneTimeTable = aircode.db.table('extraExp');    
    const oneTimeExp = await oneTimeTable
    .where({_id})
    .projection({createdAt : 0, updatedAt:0, masterUsr_id:0})
    .findOne();
    
    //Update 
    oneTimeExp.item = item || oneTimeExp.item;
    oneTimeExp.price = price || oneTimeExp.price;
    
    try {
      await oneTimeTable.save(oneTimeExp);
      context.status(200);
      return {
        "success": true,
        'message': 'Record updated',
        "data": {...oneTimeExp}
      }
    }catch(err) {
      context.status(500);
      return {
        "success": false,
        'message': err.message
      }
    }
  } else {
    context.status(401);
    return {
      "success": false,
      'message': 'Token invalid or user is not authorized'
    }
  }
};