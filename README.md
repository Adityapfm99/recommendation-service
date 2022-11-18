<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```
or

```bash
$ yarn install
```

## Running the app

```bash
$ yarn start
```
or
```bash
$ npm start
```
## Unit testing

```bash
$ npm test
```
or
```bash
$ yarn test
```

## API Documentation Swagger
![Alt text](img/swagger.png)
```bash
$ {}url/docs
```

# Upsert Recommendation
```
Request: 
Base_url = /api/v1

url : [POST] {Base_url}/recommendation
payload :  {
	 "clevertapId" : "b5229904b-3752-44ef-b37d-a152aa99c495",
    "restaurantIds" : [ 
        443, 
        345, 
        322, 
        433
    ],
     "cuisineIds" : [ 
        450, 
        321, 
        333
    ]
 }


Response:
{
	"message": "success",
	"statusCode": 200,
	"result": {
		"clevertapId": "b5229904b-3752-44ef-b37d-a152aa99c495",
		"restaurantIds": [
			443,
			345,
			322,
			433
		],
    "cuisineIds" : [ 
        450, 
        321, 
        333
    ]
	}
}
```
# Get Recommendation by clevertapId
```
Request: 
Base_url = /api/v1

url : [Get] {Base_url}/recommendation/{clevertapId}
payload :  {
	 "clevertapId" : "b5229904b-3752-44ef-b37d-a152aa99c495",
    "restaurantIds" : [ 
        443, 
        345, 
        322, 
        433
    ],
     "cuisineIds" : [ 
        450, 
        321, 
        333
    ]
 }


Response:
{
	"message": "success",
	"statusCode": 200,
	"result": {
		"clevertapId": "b5229904b-3752-44ef-b37d-a152aa99c495",
		"restaurantIds": [
			443,
			345,
			322,
			433
		],
     "cuisineIds" : [ 
        450, 
        321, 
        333
    ]
	}
}
```
## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).

