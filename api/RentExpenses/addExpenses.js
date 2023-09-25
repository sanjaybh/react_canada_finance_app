// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config;
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  
  if(tokenUser != null) {
    const { _id } = tokenUser;
    const {roomRent, hydro, water, electricity, wifi, laundry} = params;

    const masterUsr_id = _id;

    if(!roomRent || !electricity) {
      context.status(400);
      return {
        "success": true,
        "message": "All fields are mandatory"
      }
    }
    
    const userTable = aircode.db.table('rentExpenses');  
    const userExist = await userTable
    .where({masterUsr_id})
    .findOne()
  
    if(userExist){
      context.status(409);
      return {"success": true, "message": "Record already exist"}
    }
    const newUser = {masterUsr_id, roomRent, hydro, water, electricity, wifi, laundry };
    await userTable.save(newUser);
    
    context.status(200);

    //Delete Item
    delete newUser.masterUsr_id
    
    return {
      "success": true, 
      "message": "Record added",
      "data": newUser
    };
  }else {
    context.status(401);
    return {
      "success": true,
      'message': 'Token invalid or user is not authorized'
    }
  }
  
  
};
