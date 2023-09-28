// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');

module.exports = async function (params, context) {
  const {name, email, tel, comments} = params;

  if(!name || !email || !tel || !comments) {
    context.status(400);
    return {
      "success": false,
      "message": "All fields are mandatory"
    }
  }

  try {
    const dbTable = aircode.db.table('contact');    
    await dbTable.save(params);
    context.status(200);
    return {
      "success": true,
      "message": 'Request accepted',
    };
  } catch (e) {
    context.status(401);
    return {
      "success": false,
      'message': e.message
    }
  }
};
