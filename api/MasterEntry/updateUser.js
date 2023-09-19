// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  //console.log(tokenUser);
  if(tokenUser != null) {
    const { _id } = tokenUser;
    const {name, email, password, phone, address} = params;
        
    const userTable = aircode.db.table('user');    
    const user = await userTable
    .where({_id})
    .projection({isAdmin: 0, email:0, password:0, accessToken : 0, createdAt:0, updatedAt:0})
    .findOne();
    
    //email should not be allowed to change, make it readonly from UI
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    
    try {
      await userTable.save(user);
      context.status(200);
      return {
        "success": true,
        ...user
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