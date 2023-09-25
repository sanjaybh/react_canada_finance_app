// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  //console.log(tokenUser);
  if (tokenUser != null) {
    const { _id } = tokenUser;
    const { disabled } = params;

    console.log("disabled - "+disabled)
    // if(!disabled) {
    //   context.status(400);
    //   return {
    //     "success": false,
    //     "message": "All fields are mandatory"
    //   }
    // }
    const userTable = aircode.db.table('user');
    
    const userRecord = await userTable
      .where({ _id })
      .projection({
        isAdmin: 0,
        email: 0,
        password: 0,
        accessToken: 0,
        createdAt: 0,
        updatedAt: 0
      })
      .findOne();

    console.log(JSON.stringify(userRecord))

    let disBol = Boolean(disabled);
    
    //email should not be allowed to change, make it readonly from UI
    userRecord.disabled = disBol //|| userRecord.disabled;
    console.log(JSON.stringify(userRecord))
    
    try {
      await userTable.save(userRecord);      
      context.status(200);
      return {
        success: true,
        message: 'Record updated successfully.',
        data: userRecord,
      };
    } catch (err) {
      context.status(500);
      return {
        success: false,
        message: err.message,
      };
    }
  } else {
    context.status(401);
    return {
      success: false,
      message: 'Token invalid or user is not authorized',
    };
  }
};
