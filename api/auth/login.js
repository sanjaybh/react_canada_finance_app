// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config;

module.exports = async function (params, context) {
  const {email, password} = params;
  
  if(!email || !password) {
    context.status(400);
    return {"success": false,"message" : "All fields are mandatory"};
  }

  const userTable = aircode.db.table('user');

  const user = await userTable
  .where({email})
  .projection({createdAt:0, updatedAt:0})
  .findOne();
  //console.log("CHECK - "+JSON.stringify(user) === '{}')
  
  if(!user) {
    context.status(401);
    return {"success": false,"message": "User Not found"};
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  try {
    if(matchPassword) {
      const accessToken = jwt.sign(
        {
          "_id": user._id,
          "isAdmin": user.isAdmin
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn : '1d'}
      );
  
      const currentUser = {...user, accessToken};
      await userTable.save(currentUser);
      context.status(200);
      
      //remove few fields from current user
      delete currentUser._id;
      delete currentUser.password;
      
      return {
        "success": true,
        "data" : currentUser
      }
    }else {
      context.status(401);
      return {"success": false, "message": "Authentication failed, password mismatch"};
    }
  }catch(e){
    context.status(401);
    return {"success": false, "message": "User not authorized"};
  }
  
};