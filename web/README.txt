mongodb: 'mongodb://IbmCloud_9lh68nv7_a79tmedj_un7b3bfh:4kqYZGzP7GAM6eA73rX6PJy2aiyfdxL1@ds035760.mongolab.com:35760/IbmCloud_9lh68nv7_a79tmedj'

mongo -u IbmCloud_9lh68nv7_a79tmedj_un7b3bfh -p 4kqYZGzP7GAM6eA73rX6PJy2aiyfdxL1 ds035760.mongolab.com:35760/IbmCloud_9lh68nv7_a79tmedj

schemas:
    - code:
        + isOriginal
        + challengeId
        + text
        + language
        + cached output from ideone
        + ideone link id

    - challenge:
        + code
        + test cases (input str)
        + isCompleted
        + projectId

    - player:
        + score
        + [codeId]

    - game:
        + challenges (could be from diff. projects)
        + playerOne
        + playerTwo
        + slug

    - project:
        + name
        + fromLang
        + toLang
        + slug
# Node.js Starter Application

Bluemix provides a Node.js starter application as a template so that you can add your code and push the changes back to the Bluemix environment.


## Files

The Node.js starter application has files as below:

*   instructions.md

	This file describes the Next Steps for getting started with this template.

*   app.js

	This file contains the server side JavaScript code for your application written using the Node.js API

*   views/

	This directory contains the views of the application. It is required by the express framework and jade template engine in this sample application.

*   public/

	This directory contains public resources of the application. It is required by the express framework in this sample application.

*   package.json

	This file is required by the Node.js environment. It specifies this Node.js project name, dependencies, and other configurations of your Node.js application.


