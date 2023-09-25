// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
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
        "success": false,
        "message": "All fields are mandatory"
      }
    }
    
    const rentExpensesTable = aircode.db.table('rentExpenses');    
    const userRentExp = await rentExpensesTable
    .where({masterUsr_id})
    .projection({masterUsr_id:0, createdAt : 0, updatedAt : 0})
    .findOne();

    userRentExp.roomRent = roomRent || userRentExp.roomRent;
    userRentExp.hydro = hydro || userRentExp.hydro;
    userRentExp.water = water || userRentExp.water;
    userRentExp.electricity = electricity || userRentExp.electricity;
    userRentExp.wifi = wifi || userRentExp.wifi;
    userRentExp.laundry = laundry || userRentExp.laundry;
        
    try {
      await rentExpensesTable.save(userRentExp);
      context.status(200);
      return {
        "success": true,
        "message": "Record Updated",
        "data": {...userRentExp}
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