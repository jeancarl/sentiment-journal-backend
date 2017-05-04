/**
****************************************************************************
* Copyright 2017 IBM
*
*   Sentiment Journal - Backend API
*
*   By JeanCarl Bisson (@dothewww)
*   More info: https://ibm.biz/nodejs-sentiment-journal-backend
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
****************************************************************************
*/

"use strict";

const express = require("express");
const cfenv = require("cfenv");
const app = express();
const bodyParser = require("body-parser");

app.use(express.static(__dirname + "/public"));

// Load local VCAP configuration
let vcapLocal = null;

try {
  vcapLocal = require("./vcap-local.json");
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) {
  // Assume application is running in IBM Bluemix platform with Cloudant and 
  // Watson Natural Language Understanding services bound to this application.
}

const appEnvOpts = vcapLocal ? {
  vcap: vcapLocal
} : {}
const appEnv = cfenv.getAppEnv(appEnvOpts);

const NaturalLanguageUnderstandingV1 = require("watson-developer-cloud/natural-language-understanding/v1.js");

const nlu = new NaturalLanguageUnderstandingV1({
  username: appEnv.services["natural-language-understanding"][0].credentials.username,
  password: appEnv.services["natural-language-understanding"][0].credentials.password,
  version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2016_01_23
});

let db = require("./lib/cloudant-db")(appEnv.services["cloudantNoSQLDB"][0].credentials);

app.use(bodyParser.urlencoded({
  extended: false
}));

// Returns CORS headers so other domains can call this API.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * Returns an array of journal entries from the database.
 */
app.get("/api/items", (req, res) => {
  console.log("getting items");
  db.search().then(items => {
    res.send(items);
  }).catch(err => {
    res.status(500).send({ error: err });
  });
});

/**
 * Analyzes journal entry content, stores analysis in the Cloudant DB, and returns the result to the client.
 */
app.post("/api/items", (req, res) => {
  const options = {
    text: req.body.text,
    features: {
      "sentiment": {}
      // Add other features here for other types of analysis.
    }
  };

  nlu.analyze(options, (err, response) => {
    if (err) {
      res.status(500).send({error: err});
    }

    const item = {
      text: req.body.text,
      sentiment: response.sentiment.document
    };

    db.create(item).then(i => {
      item.id = i.id;
      res.send(item);
    }).catch(err => {
      res.status(500).send({error: err});
    });
  });
});

db.init().then(() => {
  app.listen(appEnv.port, "0.0.0.0", function() {
    console.log("server starting on "+appEnv.url);
  });
});
