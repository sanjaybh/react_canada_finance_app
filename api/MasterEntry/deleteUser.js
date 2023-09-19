// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  console.log(tokenUser);
  
  if(tokenUser != null) {
    const { _id } = tokenUser;
    const userTable = aircode.db.table('user');    
    const user = await userTable
    .where({_id})
    .findOne();

    try {
      if(user !== null){
        const result = await userTable.delete(user);
        context.status(204);
        return {
          "success": true,
          "result":[], "message":"Record deleted"
        }
      }else{
        context.status(404);
        return {
          "success": true,
          "message":"Record not found"
        }
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