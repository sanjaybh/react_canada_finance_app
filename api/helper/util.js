// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');

module.exports.findIdsFromUserList = async function (includeResult) {
  var userAry = []
  for (const keyOuter in includeResult) {
    for (const keyInner in includeResult[keyOuter]) {
      //console.log(keyInner+" : "+includeResult[keyOuter][keyInner])
      if(keyInner === '_id'){
        userAry.push({ "_id" : includeResult[keyOuter][keyInner]})
      }
    }
  }
  return userAry;
};
