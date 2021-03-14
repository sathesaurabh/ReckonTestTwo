const axios = require('axios');
const axiosRetry = require('axios-retry');
const logger = require('../ReckonTestTwo/api/utils/logger');

const rangeInfoEndpoint = 'https://join.reckon.com/test1/rangeInfo';
const divisorRangeInfoEndpoint = 'https://join.reckon.com/test1/divisorInfo';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 9999,
    bodyParser = require('body-parser');

    app.get('/', (req, res) => {
    
        //Retry has been set to happen 10 times with an exponential delay
        axiosRetry(axios, { retries: 10, retryDelay: axiosRetry.exponentialDelay });
    
        //Call the Reckon API to get the range information
        axios.get(rangeInfoEndpoint)
            .then(result => {

                logger.info('Made request to API. URL: '+ rangeInfoEndpoint + 'with Status Code: ' + result.status);
                const lowerValue = result.data['lower'];
                const upperValue = result.data['upper'];
    
                logger.info('Lower Value: ' + lowerValue);
                logger.info('Upper Value: ' + upperValue);
    
                //Call the Reckon API to get the divisor and output information
                axios.get(divisorRangeInfoEndpoint)
                .then(result2 => {
    
                    logger.info('Made request to API. URL: '+ divisorRangeInfoEndpoint + 'with Status Code: ' + result2.status);

                    //Find the number of objects with divisor and output we need to consider
                    let objectsLength = result2.data['outputDetails'].length;
    
                    // Looped over 'outputDetails' below and save both the 'divisor's and both the 'output's into separate arrays
                    let divisor = new Array(objectsLength);
                    let output = new Array(objectsLength);
    
                    let highestDivisor = 1;
                    let highestOutput = '';
    
                    for (let i = 0; i <= objectsLength - 1; i++)
                    {
                        divisor[i] = result2.data['outputDetails'][i]['divisor'];
                        output[i] = result2.data['outputDetails'][i]['output'];
    
                        logger.info('Divisor ' + parseInt(i) + ': ' + divisor[i]);
                        logger.info('Output ' + parseInt(i)  + ': ' + output[i]);
    
                        highestDivisor = highestDivisor * divisor[i];
                        highestOutput = highestOutput + output[i];
                    }
    
                    logger.info('Highest Divisor: ' + highestDivisor);
                    logger.info('Highest Output: ' + highestOutput);
    
                    let print = '';
    
                    for (let i=lowerValue; i <= upperValue; i++)
                    {
                        if(i == 0)
                            print = print + '0:' + '<br />';
                            
                        else if (i % highestDivisor == 0)
                            print = print + i + ': ' + highestOutput + '<br />';
                            
                        else if (i % divisor[0] == 0)
                            print = print + i + ': ' + output[0] + '<br />';
                            
                        else if (i % divisor[1] == 0)
                            print = print + i + ': ' + output[1] + '<br />';
                            
                        else
                            print = print + i + ':' + '<br />';
                    }
                    res.send(JSON.stringify(print));
    
                })
                .catch(error => {
                    console.log(error);
                });
            })
            .catch(error => {
                console.log(error);
            });
    });

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Import Routes
var routes = require('./api/routes/reckonTestTwoRoutes');

//Register the routes
routes(app);

app.listen(port, () => console.log(`Listening on port ${port}...`));