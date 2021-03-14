const logger = require("../utils/logger");

module.exports = function subTextResults(subText, indexes){
    
    let subTextResult = {};
    subTextResult.subText = subText;
    subTextResult.result = indexes.toString();

    return subTextResult;
}