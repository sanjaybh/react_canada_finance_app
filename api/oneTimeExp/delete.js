// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  
  if(tokenUser != null) {
    //const { _id } = tokenUser;
    const { _id } = params;
    
    const userTable = aircode.db.table('oneTimeExp');    
    const user = await userTable
    .where({_id})
    .findOne();

    try {
      const result = await userTable.delete(user);
      context.status(204);
      return {
        "success": true,
        "data": [], "message": "Record deleted"
      }
    }catch(err) {
      context.status(500);
      return {
        "success": false,
        'message': "Error - "+err.message
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