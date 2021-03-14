# Reckon Pre-Interview Test
This is the ReadMe file for the NodeJs Pre-Interview Coding Test

## Installation

To start the application

```sh
npm run start
```

On running the application, the development server will start on port 9999

## Test 1

Expected Output should be displayed at the URL

```sh
http://localhost:9999
```

## Test 2

Expected Output for this test will be submitted to the endpoint `submitResults`.
The `status code` will be displayed on the browser screen

```sh
http://localhost:9999/Occurences
```

## Implementation Details and Notes

- Axios library has been used for Promise based HTTP client for the browser and node.js

- Winston npm module used for logging mechanism. 
-- Configured to provide File level and Console level Logging
-- Configured to provide Info Level as well as Error logging

- Axios-Retry npm module has been used for auto-retry logic for failing requests.
`retries: 10, retryDelay: exponential`
-- Reason fo having the retrt delay set at exponential instead of regular intervals is so that the delay intervals increase with every retry so we do not burn out our retries sooner than it can take the API to recover
-- Max Retries have been set to 10 since we do not want to enter an infinite retry loop putting a lot of load on the system.

- Express Framework is used for the ease it provides in order to create and maintain robust servers. 
-- Comes with many built-in features and can be used to provide better functionality, increased security, and improved speed

