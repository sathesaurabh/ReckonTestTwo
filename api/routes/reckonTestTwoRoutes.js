'use strict'

module.exports = function(app) {
  let subTextsSearch = require('../controllers/subTextsSearchController');
  
  // SubTextSearch Routes
  app.route('/Occurences')
    .get(subTextsSearch.search_all_subtexts);
};
