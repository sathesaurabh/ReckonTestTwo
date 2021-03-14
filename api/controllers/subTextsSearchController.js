'use strict'

const axios = require('axios');
const axiosRetry = require('axios-retry');
const logger = require('../utils/logger');
const resultModel = require('../models/resultsModel');
const subTextResultsModel = require('../models/subTextResultsModel');



const textToSearchEndpoint = 'https://join.reckon.com/test2/textToSearch';
const retrieveSubtextsEndpoint = 'https://join.reckon.com/test2/subTexts';
const submitResultsEndpoint = 'https://join.reckon.com/test2/submitResults';


exports.search_all_subtexts = function(req, res) {

    // Retry has been set to happen 10 times with an exponential delay
    axiosRetry(axios, { retries: 10, retryDelay: axiosRetry.exponentialDelay });

    //Call API endpoint 1 and get the 'textToSearch' string
    axios.get(textToSearchEndpoint)
        .then(result => {
            const textToSearch = result.data['text'];

            logger.info('Made request to API. URL: '+ textToSearchEndpoint + 'with Status Code: ' + result.status);
            logger.info('Text to search from has been retrieved from API: ' + textToSearch);

            //Call API endpoint 2 and get the 'subTexts'
            axios.get(retrieveSubtextsEndpoint)
                .then(result2 => {
                    var subTexts = result2.data.subTexts;
                    
                    logger.info('Made request to API. URL: '+ retrieveSubtextsEndpoint + 'with Status Code: ' + result2.status);
                    logger.info(`Subtexts saved to Array: ${JSON.stringify(subTexts)}`);
                    
                    //Format it as expected

                    let subTextResults = [];
                    
                    subTexts.forEach(wordToSearch => {
                        
                        // Logic to individually search each subText from the Array<subTexts> within the 'textToSearch' string
                        let indexResult = getIndicesOfSubText(wordToSearch, textToSearch);

                        logger.info('Word Searched: ' + wordToSearch);
                        logger.info('Index Result: ' + indexResult);

                        let subTextResult = subTextResultsModel(wordToSearch, indexResult);

                        subTextResults.push(subTextResult);
                        
                    });

                    let tempResult = resultModel('Saurabh Sathe', textToSearch, subTextResults);

                    logger.info(tempResult);

                    //Post the model in a JSON format to the submitResults API endpoint provided
                    axios.post(submitResultsEndpoint, tempResult)
                        .then(response => {

                            logger.info('Made request to API. URL: '+ submitResultsEndpoint + 'with Status Code: ' + response.status);
                            res.send('Occurences Submitted Successfully: ' + 'Status Code - ' + response.status + ' Description - ' + response.statusText);
                            
                            logger.info(response.status);
                            logger.info(response.statusText);

                        }, (error) => {
                            logger.error(error);
                        })

                })
                .catch(error => {
                    logger.error(error);
                })
        })
        .catch(error => {
            logger.error(error);
        });
}

function getIndicesOfSubText(wordToSearch, textToSearch){

    const indices = [];
    let i;
    let j;

    for (i = 0; i < textToSearch.length - wordToSearch.length; i += 1) {
        for(j = 0;j < wordToSearch.length; j += 1) {
            if (wordToSearch[j].toLowerCase() != textToSearch[i + j].toLowerCase())
                break;
        }

        if(j === wordToSearch.length)
            indices.push(i + 1);
            
    }

    // Specific Output string when no matches found
    if(indices.length == 0) {
        return '<No Output>';
    }
    return indices;
}
