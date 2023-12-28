# NumericaIdeas - Microservice (NodeJS) [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fnumerica-ideas%2Fni-microservice-nodejs&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://blog.numericaideas.com)

This project serves as a simple micro-service usable to build highly scalable backends in an hybrid setup as part of a cloud migration, either in the cloud (Lambda or EC2) or into a custom VPS.

This project/branch is extracted from: https://github.com/numerica-ideas/ni-microservice-nodejs

## Running

First, you should install the dependencies by typing `npm install` command from the root folder of the project.

Then you can run it by executing either `node server.js`, `npm start`, `forever start server.js` or simply `nodemon server` (considering you have it installed) which enables live reloading at the same time.

Once it's running (non production profile), you can access the Swagger generated API docs at http://localhost:3000/api-docs.

## Tests

Unit tests are written using [AVAJS](https://github.com/avajs/ava), they are located into the **tests** folder and runnable with one of the following commands:
- npm test
- npx ava
- npm ava --watch (watch for changes then running the tests again)

Guide: [Syntax](https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md) | [Assertions](https://github.com/avajs/ava/blob/master/docs/03-assertions.md) | [Timeouts](https://github.com/avajs/ava/blob/master/docs/07-test-timeouts.md)

## Environment variables
### (EC2 - VPS)
Use the .env (a copy of .env.sample file) to store sensitive config informations. The vars in use should be define in the config/index.js file explicitly for clarity/security purposes.

Be sure the lambda role has the "AWSLambdaFullAccess" permission.

### Lambda

- **dev.json** is in use for development.

- **prod.json** is in use for production.

## Deployments
### (EC2 - VPS)
Server deployment is comong and sometimes highly needed, here are some considerations to note:

The environment variables should be provided into the .env file before hitting the command `forever server.js` to run the App.

### Lambda (Cloud Function)
If deployed with Lambda we first need to make sure that the env var for each environment is set explicitly into their respective files (dev.json and prod.json).

Then let's replace `AWS_ACCOUNT_ID` (package.json & in the policies folder) with our AWS account ID prior to follow the steps below:

1) Create the lambda: `npm run create`
2) Define the env var for the lambda function (dev.json & prod.json)
3) Deploying/updating the App (claudia update):
    - `npm run deploy:dev` - Deploying the dev version
    - `npm run deploy:prod` - Deploying the prod version
4) Destroying: claudia destroy

Once deployed, we should have the text "SERVICE IS FINE" when attempting to access the [PING](http://localhost:3000/ni-microservice-node/pingify) endpoint.

**Note**: Let's remember to replace ${env} with the appropriate environment (dev or prod), it's just a placeholder.

## Clean codes recommendation
- Move all the controllers to the **controllers** folder.
- Create routes for API endpoints into the **routes** folder.
- Services can reside in the **services** folder.

Under the hood ClaudiaJS uses **AWS-CLI** to interact with AWS resources, a walkthrough guide is available in the following article:
https://blog.numericaideas.com/easiest-gitlab-cicd-lambda-pipeline

The full version is available at: https://github.com/numerica-ideas/ni-microservice-nodejs

[MIT License](https://github.com/numerica-ideas/ni-microservice-nodejs/blob/master/LICENSE)
