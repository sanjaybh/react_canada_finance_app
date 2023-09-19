// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  if(tokenUser != null) {
    const { item, price } = params;

    if(!item || !price) {
      context.status(400);
      return {
        "success": true,
        'message': 'Product Name, amount are mandatory'
      }
    }
    
    const oneTimeExpTable = aircode.db.table('oneTimeExp');

    try {
      const cart = {
        ...params,
        masterUsr_id: tokenUser._id
      }
      const result = await oneTimeExpTable.save(cart);
      context.status(201);
      return {
        "success": true,
        result
      }
    }catch (err) {
      context.status(500);
      return {
        "success": false,
        'message': err.message
      }
    }
  } else {
    context.status(401);
    return {"success": true, "message": "Token invalid or user is not authorized!"};
  } 
};