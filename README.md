# Sentiment Journal Backend API

This repo contains a Node.js that exposes a couple API endpoints to analyze and retrieve journal entries. See the section titled API Endpoints for more details on how to use this application once running.

For the user interface, please refer to the [Angular application](http://github.com/jeancarl/sentiment-journal-frontend).

## Pre-requistes

* Install the Git CLI tool.
* Install Cloud Foundry CLI is used in to create services and deploy the application.

## Getting Started

There are three ways to run this application:

* Running Locally - run the Node.js application via localhost
* Deploy To IBM Bluemix via Continuous Delivery Toolchain - create a Continuous Delivery pipeline that deploys changes from a Git Repo to the IBM Bluemix platform
* Deploy To IBM Bluemix via Cloud Foundry CLI - manually deploy the Node.js application to the IBM Bluemix platform.

## Running Locally

Note: the `cf` CLI is used in this example to create two IBM Bluemix services and retrieve the the service credentials. Alternatively, you can create the two services in the IBM Bluemix console and copy the credentials from the Service Credentials tab.

1. Clone this Git repo locally.

	```
	git clone https://github.com/jeancarl/sentiment-journal-backend
	cd sentiment-journal-backend
	```

1. Copy the file named `vcap-local.sample.json` to `vcap-local.json`.

	```
	cp vcap-local.sample.json vcap-local.json
	```

1. In the next several steps, we'll replace the ... placeholders with credentials for two IBM Bluemix services that will be created/used: a Cloudant NoSQL Database and a Watson Natural Language Understanding service. The contents of this file is a skeleton:

	```
	{
	  "services": {
	    "cloudantNoSQLDB": [
				{
					"credentials": {
						...
					}
				}
	    ],
	    "natural-language-understanding": [
				{
					"credentials": {
						...
					}
				}
	    ]
	  }
	}
	```

1. Create a Cloudant NoSQL Database service via the `cf` CLI tool:

	```
	cf create-service cloudantNoSQLDB Lite sentiment-journal-cloudant
	cf create-service-key sentiment-journal-cloudant Credentials-1
	cf service-key sentiment-journal-cloudant Credentials-1

	```
1. Copy the service credential JSON into the first placeholder in the `vcap-local.json` file. Values will be different from those shown below.

	```
	{
	  "services": {
	    "cloudantNoSQLDB": [
	      {
					"credentials": {
						"host": "a0123b4c-d5e6-7feg-hijk-890lm12n34op-bluemix.cloudant.com",
						"password": "01ab2cde3f4g5h67890i1j2kl34m5no67pq890r1s23456789012tu34v5678w90",
						"port": 443,
						"url": "https://a0123b4c-d5e6-7feg-hijk-890lm12n34op-bluemix:01ab2cde3f4g5h67890i1j2kl34m5no67pq890r1s23456789012tu34v5678w90@a0123b4c-d5e6-7feg-hijk-890lm12n34op-bluemix.cloudant.com",
						"username": "a0123b4c-d5e6-7feg-hijk-890lm12n34op-bluemix"
					}
	      }
	    ],
	    "natural-language-understanding": [
	      {
					"credentials": {
						...
					}
				}
	    ]
	  }
	}
	```

1. Create a Watson Natural Language Understanding service via the `cf` CLI tool.

	```
	cf create-service natural-language-understanding free sentiment-journal-nlu
	cf create-service-key sentiment-journal-nlu Credentials-1
	cf service-key sentiment-journal-nlu Credentials-1
	```

1. Copy the service credential JSON into the second placeholder in the `vcap-local.json` file. Values will be different from those shown below.

	```
	{
	  "services": {
	    "cloudantNoSQLDB": [
	      {
	        "credentials": {
						"host": "a0123b4c-d5e6-7feg-hijk-890lm12n34op-bluemix.cloudant.com",
						"password": "01ab2cde3f4g5h67890i1j2kl34m5no67pq890r1s23456789012tu34v5678w90",
						"port": 443,
						"url": "https://a0123b4c-d5e6-7feg-hijk-890lm12n34op-bluemix:01ab2cde3f4g5h67890i1j2kl34m5no67pq890r1s23456789012tu34v5678w90@a0123b4c-d5e6-7feg-hijk-890lm12n34op-bluemix.cloudant.com",
						"username": "a0123b4c-d5e6-7feg-hijk-890lm12n34op-bluemix"
					}
	      }
	    ],
	    "natural-language-understanding": [
	      {
	        "credentials": {
						"password": "012A3bcDE45F",
	          "url": "https://gateway.watsonplatform.net/natural-language-understanding/api",
	          "username": "0a123b4c-d567-890e-f123-4gh5ij678kl9"
					}
	      }
	    ]
	  }
	}	
	```
1. Install the necessary NPM dependencies:

	```
	npm install
	```

1. Run the application:

	```
	node app.js
	```

## Deploy to IBM Bluemix via Continuous Delivery Toolchain

The Continious Delivery Toolchain in IBM Bluemix uses a Git repo and other components to deploy code into a Cloud Foundry application.

1. Create a Continuous Delivery service (under DevOps) in the IBM Bluemix catalog.

1. Click on `Simple Cloud Foundry toolchain (v2)`.

	![](assets/cdselecttemplate.png)

1. Click on the `Git Repos and Issue Tracking` icon. Clone this repo (https://github.com/jeancarl/sentiment-journal-backend) into a new repository named `sentiment-journal-backend`. This will create a new Git repo in your account with the contents of the project.

	![](assets/cdgitrepo.png)

1. Click on the `Delivery Pipeline` icon. Choose an app name and the region, organization, space where you want to deploy this application. Click Create.

	![](assets/cddeliverypipeline.png)


1. Click on the `Deploy` tile. When the two stages are completed (green), a mybluemix.net application URL should be displayed under the Last Execution Result section. Click on the application URL to access the application.

	![](assets/cdoverview.png)

1. To further modify the project, click `Git` tile under `Code` to access the project's Git repo. Under the title and description of the project, copy the Git repo URL which can be cloned and changed:

	```
	git clone GIT_URL
	```


## Deploy to IBM Bluemix via Cloud Foundry CLI

This application can also be pushed via the Cloud Foundry CLI. Ensure you have the Cloud Foundry CLI tool installed locally.

1. Clone this Git Repo locally.

	```
	git clone https://github.com/jeancarl/sentiment-journal-backend
	cd sentiment-journal-backend
	```

1. Create a Cloudant NoSQL Database service via the `cf` CLI tool:

	```
	cf create-service cloudantNoSQLDB Lite sentiment-journal-cloudant
	cf create-service-key sentiment-journal-cloudant Credentials-1
	```

1. Create a Watson Natural Language Understanding service via the `cf` CLI tool.

	```
	cf create-service natural-language-understanding free sentiment-journal-nlu
	cf create-service-key sentiment-journal-nlu Credentials-1
	```

1. Open the `manifest.yml` file. Two declared services, a Cloudant NoSQL database and a Watson Natural Language Understanding service, will be bound to when the application is deployed.

	You can also change the name of the application, how much memory, and the host and domain of the application.

	```
	applications:
	- name: sentiment-journal-backend
	  path: .
	  memory: 256M
	  instances: 1
	  domain: mybluemix.net
	  host: sentiment-journal-backend
	  disk_quota: 1024M
	  services:
	    - sentiment-journal-cloudant
	    - sentiment-journal-nlu
	```

1. Push the application to IBM Bluemix.

	```
	cf push
	```

## Manually calling the API endpoints

#### What base URL do I use?

* If you deploy locally, the URL base should be `http://localhost:3000`
* If you deploy via Continous Delivery, the URL can be found in the Deploy stage.
* If you deploy via the Cloud Foundry CLI, the URL can be found at the end of the output from the `cf push` command.


1. Test out the API endpoint to get a list of journal entries. Append `/api/items` to the end of the base URL. For example, if the application URL was `https://myapp.mybluemix.net`, the API endpoint would be `https://myapp.mybluemix.net/api/items`

	Since there are no items in the database yet, the endpoint should return an empty JSON array.

	```
	[]
	```

1. Use an REST Client (such as Postman) to POST a form field text to the `/api/items` API endpoint.

	```
	POST http://myapp.mybluemix.net/api/items
	text=this+is+a+test
	```

	The JSON response will contain the sentiment analysis returned by the Watson Natural Language Understanding service.

	```
	{
	  "text": "this is a test",
	  "sentiment": {
	    "score": 0,
	    "label": "neutral"
	  },
	  "id": "fc6664d482170f26285d0f78de58270b"
	}
	```

## API Endpoints

This section describes the API endpoints exposed by this Node.js application.

**GET /api/items**

Gets a list of journal entries that have been analyzed for sentiment.

Example Response (JSON):

	[{
	  "text": "this is an awesome demo",
	  "sentiment": {
	    "score": 0.860625,
	    "label": "positive"
	  },
	  "id": "eeb326cf3b13655af11c3828d059a36e"
	},
	{
	  "text": "this is a test",
	  "sentiment": {
	    "score": 0,
	    "label": "neutral"
	  },
	  "id": "fc6664d482170f26285d0f78de58270b"
	}
	...
	,
	{
	  "text": "i am so sad my friend couldn't make it",
	  "sentiment": {
	    "score": -0.949402,
	    "label": "negative"
	  },
	  "id": "3f08b8fada76808cccaf90e234a78b3a"
	}]

| Property | Type | Description |
|-----------|------|-------------|
| text | string | journal text that is analyzed for sentiment |
| sentiment | object | sentiment analysis of the content |
| sentiment.score | number | sentiment score from Watson Natural Language Understanding service |
| sentiment.label | string | label of sentiment from Watson Natural Language Understanding service |
| id | string | Cloudant document ID |

**POST /api/items**

Analyze a new entry and add it to the journal.

| Parameter | Type | Description |
|-----------|------|-------------|
| text | string | journal text that is analyzed for sentiment |

Example Response (JSON):

	{
	  "text": "this is an awesome demo",
	  "sentiment": {
	    "score": 0.860625,
	    "label": "positive"
	  },
	  "id": "eeb326cf3b13655af11c3828d059a36e"
	}

| Property | Type | Description |
|-----------|------|-------------|
| text | string | journal text that is analyzed for sentiment |
| sentiment | object | sentiment analysis of the content |
| sentiment.score | number | sentiment score from Watson Natural Language Understanding service |
| sentiment.label | string | label of sentiment from Watson Natural Language Understanding service |
| id | string | Cloudant document ID |
