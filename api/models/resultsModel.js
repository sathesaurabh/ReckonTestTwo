const logger = require("../utils/logger");

module.exports = function Results(candidateName, textToSearch, subTextResults){

    logger.info('Start creating result model');

    let result = {};
    result.candidate = candidateName;
    result.text = textToSearch;
    result.results = subTextResults;

    logger.info('Finished creating result model');

    return result;
}