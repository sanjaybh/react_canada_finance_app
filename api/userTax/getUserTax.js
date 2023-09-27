// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);

  if(tokenUser != null) { 
    const { _id } = tokenUser;
    
    const userTaxTable = aircode.db.table('userTax');
    
    const record = await userTaxTable
    .where({masterUsr_id: _id})
    .projection({masterUsr_id:0, createdAt:0, updatedAt:0})
    .findOne();
    //console.log("Count - "+JSON.stringify(record))
    
    const count = await userTaxTable
    .where({masterUsr_id: _id})
    .count();
    
    context.status(200);
    return {
      "success": true,
      "message": "",
      "count": count,
      "data": record
    }
  } else {
    context.status(401);
    return {"success": false, "message": "Token invalid or user is not authorized!"};
  }
};