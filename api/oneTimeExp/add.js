// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  
  if(tokenUser != null) {
    const { _id } = tokenUser;
    const { item, price } = params;

    if(!item || !price) {
      context.status(400);
      return {
        "success": true,
        'message': 'Item Name, Price are mandatory'
      }
    }
    
    const oneTimeExpTable = aircode.db.table('oneTimeExp');

    try {
      const cart = {
        ...params,
        masterUsr_id: _id
      }
      const result = await oneTimeExpTable.save(cart);
      context.status(201);
      
      delete result.createdAt
      delete result.updatedAt
      delete result.masterUsr_id
      
      return {
        "success": true,
        'message': 'Item added successfully',
        "data":result
      }
    }catch (err) {
      context.status(500);
      return {
        "success": false,
        "message": err.message
      }
    }
  } else {
    context.status(401);
    return {"success": true, "message": "Token invalid or user is not authorized!"};
  } 
};