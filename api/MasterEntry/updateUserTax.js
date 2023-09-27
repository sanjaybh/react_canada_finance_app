// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  //console.log(tokenUser);
  if(tokenUser != null) {
    const { _id } = tokenUser;
    const {taxPerYr, conversionRate, salaryPerYr} = params;
    
    const userTable = aircode.db.table('userTax');    
    const user = await userTable
    .where({"masterUsr_id":_id})
    .projection({createdAt:0, updatedAt:0})
    .findOne();
    
    //change the entered values, set db fields
    user.taxPerYr = taxPerYr || user.taxPerYr;
    user.conversionRate = conversionRate || user.conversionRate;
    user.salaryPerYr = salaryPerYr || user.salaryPerYr;
    
    try {
      await userTable.save(user);
      context.status(200);
      return {
        "success": true,
        'message': 'Record updated successfully.',
        "data": user
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