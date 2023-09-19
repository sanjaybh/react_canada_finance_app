// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config;

module.exports = async function (params, context) {
  const {email, password} = params;

  if(!email || !password) {
    context.status(400);
    return {"success": true,"message" : "All fields are mandatory"};
  }

  const userTable = aircode.db.table('user');

  const user = await userTable
  .where({email})
  .findOne();

  if(!user) {
    context.status(401);
    return {"success": true,"message": "email or password is not valid"};
  }

  const matchPassword = await bcrypt.compare(password, user.password);

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
    delete currentUser.isAdmin;
    delete currentUser.password;
    delete currentUser.createdAt;
    delete currentUser.updatedAt;
    
    return {
      "success": true,
      "data" : currentUser
    }
  }else {
    context.status(401);
    return {"success": false, "message": "email or password is not valid"};
  }
};