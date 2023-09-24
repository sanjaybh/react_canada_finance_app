// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const bcrypt = require('bcrypt');
require('dotenv').config;

module.exports = async function (params, context) {
  const {name, email, password, phone, address} = params;

  if(!name || !email || !phone || !password) {
    context.status(400);
    return {
      "success": false,
      "message": "All fields are mandatory"
    }
  }

  //Check Password length
  const passwordLen = 6;
  
  if(password.length < passwordLen ){
    context.status(400);
    return {
      "success": false,
      "message": `Match password length [${passwordLen} char is must]`
    }
  }
  
  const userTable = aircode.db.table('user');

  const userExist = await userTable
  .where({email})
  .findOne()

  if(userExist){
    context.status(409);
    return {"success": false, "message": "User already exist"}
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {name, email, "password": hashedPassword, "isAdmin": false, phone, address, "disabled": false};  
  await userTable.save(newUser);
  context.status(200);
  return {"success": true, "message": "Record added"};
};
