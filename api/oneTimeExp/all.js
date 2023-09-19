// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);

  if(tokenUser != null) {
  
    const oneTimeTable = aircode.db.table('oneTimeExp');
    
    const products = await oneTimeTable
    .where({masterUsr_id: tokenUser._id})
    .find();
  
    const count = await oneTimeTable
    .where()
    .count();
  
    return {
      "success": true,
      count,
      products
    }
  } else {
    context.status(401);
    return {"success": true, "message": "Token invalid or user is not authorized!"};
  }
};