// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);

  if(tokenUser != null) {
    const { _id } = tokenUser;
    const oneTimeTable = aircode.db.table('extraExp');
    
    const products = await oneTimeTable
    .where({masterUsr_id: _id})
    .projection({ masterUsr_id:0, createdAt:0, updatedAt:0 })
    .find();
  
    const count = await oneTimeTable
    .where({masterUsr_id: _id})
    //.projection({ createdAt:0, updatedAt:0 })
    .count();
  
    return {
      "success": true,
      "count": count,
      "data": products
    }
  } else {
    context.status(401);
    return {"success": false, "message": "Token invalid or user is not authorized!"};
  }
};