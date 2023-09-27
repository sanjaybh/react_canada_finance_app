// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  if(tokenUser != null) {
    //Type of exp [ONETIME/EXTRAEXP]
    const { item, price, type } = params;

    if(!item || !price || !type) {
      context.status(400);
      return {
        "success": true,
        'message': 'All fields are mandatory'
      }
    }
    
    const oneTimeExpTable = aircode.db.table('extraExp');

    try {
      const cart = {
        ...params,
        masterUsr_id: tokenUser._id
      }
      const result = await oneTimeExpTable.save(cart);
      context.status(201);

      //delete items
      delete result.createdAt
      delete result.updatedAt
      delete result.masterUsr_id
      return {
        "success": true,
        "data": result, "message":"Record added"
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