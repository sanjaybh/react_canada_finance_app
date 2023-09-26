// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { isNull }=require('util');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  //console.log(tokenUser);
  
  if(tokenUser != null) {
    //const { _id } = tokenUser;
    const { _id } = params;
    
    const extraExpTable = aircode.db.table('extraExp');    
    const userRec = await extraExpTable
    .where({_id})
    .findOne();

    try {
      if(userRec !== null){
        const result = await extraExpTable.delete(userRec);
        context.status(200);
        return {
          "success": true,
          "result": [], "message":"Record deleted"
        }
      }else{
        context.status(404);
        return {
          "success": false,
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