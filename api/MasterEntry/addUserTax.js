// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config;
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {  
  const tokenUser = await verifyToken(context);
  //console.log("tokenUser - "+tokenUser);
  
  if(tokenUser != null) {
    const { _id } = tokenUser;

    const {taxPerYr, conversionRate, salaryPerYr} = params;
    if(!taxPerYr || !conversionRate || !salaryPerYr) {
      context.status(400);
      return {
        "success": false,
        "message": "All fields are mandatory"
      }
    }
    
    const userTable = aircode.db.table('userTax');
    const masterUsr_id = _id;
    const userExist = await userTable
    .where({masterUsr_id})
    .projection({createdAt:0, updatedAt:0})
    .findOne()
  
    if(userExist){
      context.status(409);
      return {"success": true,"message": "Record already exist"}
    }
    const newUser = {taxPerYr, conversionRate, salaryPerYr, masterUsr_id };
    await userTable.save(newUser);
    
    context.status(200);
    return {
      "success": true,
      "data": newUser,
      "message": "Record added"
    };
  }  
  
};
