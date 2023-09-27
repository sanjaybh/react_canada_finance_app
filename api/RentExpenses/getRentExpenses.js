// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);

  if(tokenUser != null) { 
    const { _id } = tokenUser;
    
    const userTaxTable = aircode.db.table('rentExpenses');
    
    const record = await userTaxTable
    .where({masterUsr_id: _id})
    .projection({masterUsr_id:0, createdAt:0, updatedAt:0})
    .findOne();
        
    context.status(200);
    return {
      "success": true,
      "message": "",
      "data": record
    }
  } else {
    context.status(401);
    return {"success": false, "message": "Token invalid or user is not authorized!"};
  }
};