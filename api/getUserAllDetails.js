// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { findIdsFromUserList } = require('./helper/util');
const { verifyToken } = require('./helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);  
  if(tokenUser != null) {
    const { _id } = tokenUser;
    //const { _id } = params;
  if(!_id) {
    context.status(400);
    return {
      "success": false, 
      "message": "Insufficient parameters"
    }
  }
  const masterUser = await aircode.db.table('user')
    .where({_id: _id})
    .projection({ password: 0, accessToken:0, createdAt:0, updatedAt:0, isAdmin:0 })
    .find()

  const userRentExp = await aircode.db.table('rentExpenses')
    .where({masterUsr_id: _id})
    .projection({ masterUsr_id:0, createdAt:0, updatedAt:0 })
    .find()

  const userTaxExp = await aircode.db.table('userTax')
    .where({masterUsr_id: _id})
    .projection({ masterUsr_id:0, createdAt:0, updatedAt:0 })
    .find()

  const extraExp = await aircode.db.table('extraExp')
    .where({masterUsr_id: _id})
    .projection({ masterUsr_id:0, createdAt:0, updatedAt:0 })
    .find()
  
  // const userIdsList = await findIdsFromUserList(includeResult).then((data) => {    
  //   console.log("Data received")
  // }) 
 
  return {
    "success": true, 
    "data" : {masterUser, userRentExp, userTaxExp, extraExp},
    'message': 'User all data'
  };
  } else {
    context.status(401);
    return {
      "success": false,
      'message': 'Token invalid or user is not authorized'
    }
  }  
};
